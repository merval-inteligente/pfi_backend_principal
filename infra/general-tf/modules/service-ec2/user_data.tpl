#!/bin/bash
set -euxo pipefail

dnf -y update
dnf -y install docker git
systemctl enable --now docker
usermod -aG docker ec2-user

# Instalar docker-compose v2 (standalone)
DOCKER_COMPOSE_VERSION="2.24.5"
curl -L "https://github.com/docker/compose/releases/download/v$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

mkdir -p /opt/app
cd /opt/app

# Generar .env desde variables Terraform
cat > /opt/app/.env <<'ENVEOF'
${EXTRA_ENVS}
ENVEOF

# Código: repo público opcional (si no, subiré por SSH luego)
if [ -n "${REPO_URL}" ]; then
  git clone ${REPO_URL} /opt/app/src || true
else
  mkdir -p /opt/app/src
fi

# Compose: publicar 80 de la instancia -> puerto ${CONTAINER_PORT} del contenedor (8080)
cat > docker-compose.yml <<'EOF'
services:
  app:
    image: ${RUNTIME_IMAGE}
    working_dir: /app
    command: sh -c "${START_COMMAND}"
    ports:
      - "${PUBLIC_HTTP}:${CONTAINER_PORT}"
    env_file:
      - /opt/app/.env
    volumes:
      - /opt/app/src:/app
    restart: unless-stopped
EOF

/usr/local/bin/docker-compose up -d

# systemd para iniciar compose al boot
cat > /etc/systemd/system/${APP_NAME}.service <<'SYS'
[Unit]
Description=App ${APP_NAME} con docker compose
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
WorkingDirectory=/opt/app
ExecStart=/usr/local/bin/docker-compose up -d
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
SYS

systemctl daemon-reload
systemctl enable ${APP_NAME}.service
systemctl start ${APP_NAME}.service
