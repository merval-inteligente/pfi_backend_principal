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
    NODE_ENV                = "production"
    PORT                    = "8080"
    HOST                    = "0.0.0.0"
    MONGODB_URI             = ""
    DATABASE_NAME           = "MervalDB"
    DB_PORT                 = "27017"
    SECRET                  = ""
    JWT_EXPIRES_IN          = "7d"
    CLOUDINARY_CLOUD_NAME   = ""
    CLOUDINARY_API_KEY      = ""
    CLOUDINARY_API_SECRET   = ""
    UPLOAD_DIR              = "imagenes/"
    MAX_FILE_SIZE           = "5242880"
    EMAIL_HOST              = "smtp.gmail.com"
    EMAIL_PORT              = "587"
    EMAIL_USER              = ""
    EMAIL_PASS              = ""
    EMAIL_FROM              = ""
    CORS_ORIGIN             = "http://localhost:3000,http://localhost:3001,http://localhost:8081,http://localhost:19000,http://localhost:19006"
    RATE_LIMIT_WINDOW_MS    = "900000"
    RATE_LIMIT_MAX_REQUESTS = "100"
    DEBUG                   = "false"
    ALERTAS_URL             = "http://XXX.XXX.XXX.XXX:8000"
    CHAT_URL                = "http://YYY.YYY.YYY.YYY:8084"
  }
}
