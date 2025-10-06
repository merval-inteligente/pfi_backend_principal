variable "name" {
  type = string
}

variable "project" {
  type = string
}

# VPC y Security Groups vienen de alertas-tf via remote state

variable "subnet_id" {
  type        = string
  description = "Subnet ID desde alertas-tf remote state"
}

variable "security_group_ids" {
  type        = list(string)
  description = "Security Group IDs desde alertas-tf remote state"
}

variable "ami_id" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "key_name" {
  type    = string
  default = ""
}

variable "container_port" {
  type = number
}

variable "public_http_port" {
  type    = number
  default = 80
}

variable "repo_url" {
  type    = string
  default = ""
}

variable "start_command" {
  type = string
}

variable "runtime_image" {
  type    = string
  default = "node:20-alpine"
}

variable "extra_env" {
  type    = map(string)
  default = {}
}
