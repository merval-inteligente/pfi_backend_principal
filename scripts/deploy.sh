#!/bin/bash
# =============================================================================
# Script de despliegue para general-service
# Ejecutar en la instancia EC2: ssh -i labsuser.pem ec2-user@54.175.193.150
# =============================================================================

set -e

echo "=========================================="
echo "🚀 Despliegue de general-service"
echo "=========================================="

# Variables
REPO_URL="https://github.com/merval-inteligente/pfi_backend_principal.git"
APP_DIR="/home/ec2-user/general-service"
BRANCH="master"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[1/8] Verificando servicios existentes...${NC}"
if docker ps -a | grep -q "general-service"; then
    echo "Contenedor existente encontrado. Deteniendo..."
    docker stop general-service 2>/dev/null || true
    docker rm general-service 2>/dev/null || true
fi

echo -e "${YELLOW}[2/8] Limpiando contenedores antiguos...${NC}"
docker container prune -f
docker image prune -f

echo -e "${YELLOW}[3/8] Preparando directorio de la aplicación...${NC}"
if [ -d "$APP_DIR" ]; then
    echo "Directorio existente. Actualizando repositorio..."
    cd $APP_DIR
    git fetch origin
    git reset --hard origin/$BRANCH
    git pull origin $BRANCH
else
    echo "Clonando repositorio..."
    git clone -b $BRANCH $REPO_URL $APP_DIR
    cd $APP_DIR
fi

echo -e "${YELLOW}[4/8] Configurando variables de entorno...${NC}"
if [ ! -f .env ]; then
    echo "Creando archivo .env desde .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${RED}⚠️  IMPORTANTE: Edita el archivo .env con tus valores reales${NC}"
        echo "   nano $APP_DIR/.env"
    else
        cat > .env << 'EOF'
# MongoDB
MONGODB_URI=mongodb://your-mongodb-host:27017/merval

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourapp.com

# Server
PORT=80
NODE_ENV=production
EOF
        echo -e "${RED}⚠️  IMPORTANTE: Edita el archivo .env con tus valores reales${NC}"
    fi
fi

echo -e "${YELLOW}[5/8] Construyendo imagen Docker...${NC}"
docker-compose build --no-cache

echo -e "${YELLOW}[6/8] Iniciando servicio...${NC}"
docker-compose up -d

echo -e "${YELLOW}[7/8] Esperando a que el servicio inicie...${NC}"
sleep 10

echo -e "${YELLOW}[8/8] Verificando estado del servicio...${NC}"
echo ""
echo "Estado del contenedor:"
docker ps | grep general-service || echo "Contenedor no encontrado"
echo ""

echo "Probando endpoints..."
echo ""

# Test root endpoint
echo "📍 GET / :"
curl -s http://localhost:80/ || echo "Error en endpoint /"
echo ""
echo ""

# Test health endpoint
echo "📍 GET /health :"
curl -s http://localhost:80/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:80/health
echo ""
echo ""

echo "=========================================="
echo -e "${GREEN}✅ Despliegue completado${NC}"
echo "=========================================="
echo ""
echo "Información del servicio:"
echo "  - IP Pública: 54.175.193.150"
echo "  - Puerto: 80"
echo "  - Health Check: http://54.175.193.150/health"
echo "  - API Base: http://54.175.193.150/api"
echo ""
echo "Comandos útiles:"
echo "  - Ver logs: docker logs -f general-service"
echo "  - Reiniciar: docker-compose restart"
echo "  - Detener: docker-compose down"
echo "  - Estado: docker-compose ps"
echo ""
