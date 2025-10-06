#!/bin/bash
set -euxo pipefail

# Configurar logging estructurado
exec > >(tee -a /var/log/cloud-init-app.log)
exec 2>&1

echo "[$(date)] === Iniciando aprovisionamiento de ${APP_NAME} ==="

# Actualizar sistema e instalar dependencias
echo "[$(date)] Instalando Docker y Git..."
dnf -y update
dnf -y install docker git curl
systemctl enable --now docker
usermod -aG docker ec2-user

# Instalar docker-compose v2 (standalone)
echo "[$(date)] Instalando Docker Compose v2.24.5..."
DOCKER_COMPOSE_VERSION="2.24.5"
curl -L "https://github.com/docker/compose/releases/download/v$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
/usr/local/bin/docker-compose --version

# Crear estructura de directorios
echo "[$(date)] Creando estructura de directorios..."
mkdir -p /opt/app/{src,logs}
cd /opt/app

# Generar .env desde variables Terraform
echo "[$(date)] Generando archivo .env..."
cat > /opt/app/.env <<'ENVEOF'
# Auto-generado por Terraform
# Fecha: $(date)
${EXTRA_ENVS}
ENVEOF

# Validar que .env no esté vacío
if [ ! -s /opt/app/.env ]; then
  echo "[$(date)] ADVERTENCIA: .env está vacío. Verifica terraform.tfvars"
fi

# Clonar repositorio (repo público)
echo "[$(date)] Clonando repositorio..."
if [ -n "${REPO_URL}" ]; then
  rm -rf /opt/app/src
  git clone ${REPO_URL} /opt/app/src
  echo "[$(date)] Repositorio clonado: ${REPO_URL}"
else
  mkdir -p /opt/app/src
  echo "[$(date)] Sin repositorio configurado. Crear /opt/app/src manualmente."
fi

# Generar docker-compose.yml optimizado
echo "[$(date)] Generando docker-compose.yml..."
cat > docker-compose.yml <<'EOF'
services:
  app:
    image: ${RUNTIME_IMAGE}
    container_name: ${APP_NAME}
    working_dir: /app
    command: sh -c "${START_COMMAND}"
    ports:
      - "${PUBLIC_HTTP}:${CONTAINER_PORT}"
    env_file:
      - /opt/app/.env
    volumes:
      - /opt/app/src:/app
      - /opt/app/logs:/app/logs
    restart: always
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:${CONTAINER_PORT}/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
EOF

echo "[$(date)] Iniciando contenedor Docker..."
/usr/local/bin/docker-compose up -d

# Esperar y validar que el contenedor arranque
echo "[$(date)] Esperando inicio del contenedor (60s)..."
sleep 60

# Verificar estado del contenedor
if docker ps | grep -q ${APP_NAME}; then
  echo "[$(date)] ✅ Contenedor ${APP_NAME} ejecutándose correctamente"
  docker ps --filter name=${APP_NAME}
else
  echo "[$(date)] ❌ ERROR: Contenedor ${APP_NAME} no está corriendo"
  docker logs ${APP_NAME} || true
  exit 1
fi

# Crear systemd service para auto-inicio en boot
echo "[$(date)] Configurando systemd service..."
cat > /etc/systemd/system/${APP_NAME}.service <<'SYS'
[Unit]
Description=MERVAL Backend API - ${APP_NAME}
After=docker.service network-online.target
Requires=docker.service
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/app
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
Restart=on-failure
RestartSec=10s

[Install]
WantedBy=multi-user.target
SYS

systemctl daemon-reload
systemctl enable ${APP_NAME}.service
systemctl start ${APP_NAME}.service

# Health check final
echo "[$(date)] Ejecutando health check final..."
sleep 10
HEALTH_CHECK=$(curl -s -o /dev/null -w "%%{http_code}" http://localhost:${PUBLIC_HTTP}/ || echo "000")

if [ "$HEALTH_CHECK" = "200" ]; then
  echo "[$(date)] ✅ ÉXITO: Servicio respondiendo HTTP $HEALTH_CHECK"
  echo "[$(date)] URL: http://\$(curl -s http://169.254.169.254/latest/meta-data/public-hostname)/"
else
  echo "[$(date)] ⚠️  ADVERTENCIA: Servicio respondió HTTP $HEALTH_CHECK (puede estar iniciando...)"
fi

echo "[$(date)] === Aprovisionamiento completado ==="
echo "[$(date)] Logs disponibles en: /var/log/cloud-init-app.log"
echo "[$(date)] Logs del contenedor: docker logs ${APP_NAME}"
