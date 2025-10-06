# ========================================
# OUTPUTS - Información del despliegue
# ========================================

output "instance_id" {
  description = "ID de la instancia EC2"
  value       = module.svc_general.instance_id
}

output "general_public_dns" {
  description = "DNS público de la instancia"
  value       = module.svc_general.public_dns
}

output "general_private_ip" {
  description = "IP privada en la VPC compartida"
  value       = module.svc_general.private_ip
}

output "url" {
  description = "URL base de la API"
  value       = "http://${module.svc_general.public_dns}/"
}

output "api_endpoints" {
  description = "Endpoints principales de la API"
  value = {
    base       = "http://${module.svc_general.public_dns}/"
    health     = "http://${module.svc_general.public_dns}/"
    login      = "http://${module.svc_general.public_dns}/api/users/login"
    register   = "http://${module.svc_general.public_dns}/api/users/register"
    cursos     = "http://${module.svc_general.public_dns}/api/cursos"
    profesores = "http://${module.svc_general.public_dns}/api/profesores"
  }
}

output "security_groups" {
  description = "Security groups aplicados (compartidos desde alertas-tf)"
  value = {
    internal = data.terraform_remote_state.alertas.outputs.security_group_id
    public   = data.terraform_remote_state.alertas.outputs.public_security_group_id
  }
}

output "shared_infrastructure" {
  description = "Infraestructura compartida desde alertas-tf"
  value = {
    subnet_id         = data.terraform_remote_state.alertas.outputs.subnet_id
    availability_zone = data.terraform_remote_state.alertas.outputs.availability_zone
  }
}

output "ssh_command" {
  description = "Comando SSH para conectarse a la instancia"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ec2-user@${module.svc_general.public_dns}"
}

output "docker_logs_command" {
  description = "Comando para ver logs del contenedor"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ec2-user@${module.svc_general.public_dns} 'docker logs ${var.project}-general'"
}

output "deployment_info" {
  description = "Información del despliegue"
  value = {
    project       = var.project
    service_name  = "general"
    region        = var.region
    instance_type = var.instance_type
    runtime_image = var.runtime_image
    repository    = var.repo_url
  }
}
