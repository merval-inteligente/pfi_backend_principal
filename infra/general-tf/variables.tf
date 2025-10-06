variable "project" {
  type    = string
  default = "general"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "key_name" {
  type    = string
  default = "millaveuade"
}

variable "enable_ssh" {
  type    = bool
  default = true
}

variable "ssh_cidr" {
  type    = string
  default = "0.0.0.0/0"
}

variable "vpc_id" {
  type    = string
  default = "vpc-0a9472df1004235bd"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0936477549098d860"
}

variable "intra_sg_id" {
  type    = string
  default = "sg-060fffa1e9ad51d8f"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "container_port" {
  type    = number
  default = 8080
}

variable "public_http_port" {
  type    = number
  default = 80
}

variable "repo_url" {
  type    = string
  default = "https://github.com/nicopetcoff/pfi_backend_principal.git"
}

variable "runtime_image" {
  type    = string
  default = "node:20-alpine"
}

variable "start_command" {
  type    = string
  default = "npm ci --only=production || npm install --only=production; node app.js"
}

variable "extra_env" {
  type = map(string)
  default = {
    # Servidor
    NODE_ENV    = "production"
    PORT        = "8080"
    HOST        = "0.0.0.0"
    
    # Base de datos - USAR VARIABLES DE ENTORNO O SECRETS
    MONGODB_URI   = ""  # Configurar en terraform.tfvars (NO subir a Git)
    DATABASE_NAME = "MervalDB"
    DB_PORT       = "27017"
    
    # Seguridad - USAR VARIABLES DE ENTORNO O SECRETS
    SECRET         = ""  # Configurar en terraform.tfvars (NO subir a Git)
    JWT_EXPIRES_IN = "7d"
    
    # Cloudinary - USAR VARIABLES DE ENTORNO O SECRETS
    CLOUDINARY_CLOUD_NAME = ""  # Configurar en terraform.tfvars (NO subir a Git)
    CLOUDINARY_API_KEY    = ""  # Configurar en terraform.tfvars (NO subir a Git)
    CLOUDINARY_API_SECRET = ""  # Configurar en terraform.tfvars (NO subir a Git)
    
    # Archivos
    UPLOAD_DIR    = "imagenes/"
    MAX_FILE_SIZE = "5242880"
    
    # Email - USAR VARIABLES DE ENTORNO O SECRETS
    EMAIL_HOST = "smtp-mail.outlook.com"
    EMAIL_PORT = "587"
    EMAIL_USER = ""  # Configurar en terraform.tfvars (NO subir a Git)
    EMAIL_PASS = ""  # Configurar en terraform.tfvars (NO subir a Git)
    EMAIL_FROM = ""  # Configurar en terraform.tfvars (NO subir a Git)
    
    # CORS
    CORS_ORIGIN = "http://localhost:3000,http://localhost:3001"
    
    # Rate Limiting
    RATE_LIMIT_WINDOW_MS    = "900000"
    RATE_LIMIT_MAX_REQUESTS = "100"
    
    # Debug
    DEBUG = "false"
    
    # URLs de otros servicios
    ALERTAS_URL = "http://XXX.XXX.XXX.XXX:8000"
    CHAT_URL    = "http://YYY.YYY.YYY.YYY:8084"
  }
}
