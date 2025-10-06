# 🚀 Terraform Infrastructure - MERVAL Backend

Infraestructura como código para desplegar el backend de MERVAL en AWS EC2.

## 📋 Pre-requisitos

- Terraform >= 1.5.0
- AWS CLI configurado con credenciales
- Par de claves SSH en AWS (millaveuade)

## 🔐 Configuración de Variables Sensibles

**⚠️ IMPORTANTE**: Las credenciales NO están en este repositorio por seguridad.

### 1. Crear archivo de variables:

```bash
cp terraform.tfvars.example terraform.tfvars
```

### 2. Editar `terraform.tfvars` con tus credenciales reales:

```hcl
extra_env = {
  MONGODB_URI   = "tu-mongodb-uri-real"
  SECRET        = "tu-jwt-secret"
  EMAIL_USER    = "tu-email@outlook.com"
  EMAIL_PASS    = "tu-password"
  # ... etc
}
```

### 3. Verificar que `terraform.tfvars` esté en .gitignore:

```bash
git status  # NO debe aparecer terraform.tfvars
```

## 🚀 Deployment

```bash
# Inicializar Terraform (solo primera vez)
terraform init

# Ver qué se va a crear
terraform plan

# Crear la infraestructura
terraform apply

# Obtener las URLs
terraform output
```

## 🗑️ Destruir Infraestructura

```bash
terraform destroy
```

## 📦 Recursos Creados

- **EC2 Instance** (t3.micro)
- **Security Groups** (HTTP 80, SSH 22, intra-VPC)
- **Docker Container** (Node.js 20 Alpine)
- Auto-deploy desde GitHub

## 🔒 Seguridad

- ✅ Variables sensibles en `terraform.tfvars` (no se sube a Git)
- ✅ Estados de Terraform en `.gitignore`
- ✅ Credenciales nunca en el código fuente
- ✅ HTTPS recomendado para producción (usar ALB + ACM)

## 📝 Estructura

```
general-tf/
├── main.tf                    # Configuración principal
├── variables.tf               # Variables sin valores sensibles
├── outputs.tf                 # Outputs (IPs, DNS)
├── terraform.tfvars.example   # Plantilla de variables
├── terraform.tfvars           # TUS credenciales (NO en Git)
└── modules/
    └── service-ec2/
        ├── main.tf
        ├── variables.tf
        └── user_data.tpl
```

## ⚙️ Variables de Entorno Configurables

Ver `terraform.tfvars.example` para la lista completa.

## 🆘 Troubleshooting

### Error: credenciales no encontradas
```bash
# Asegúrate de crear terraform.tfvars
cp terraform.tfvars.example terraform.tfvars
# Luego edítalo con tus credenciales
```

### Servicio no responde
```bash
# Conectarse por SSH
ssh -i "path/to/key.pem" ec2-user@<public-dns>

# Ver logs
sudo docker logs app-app-1
sudo tail -f /var/log/cloud-init-output.log
```
