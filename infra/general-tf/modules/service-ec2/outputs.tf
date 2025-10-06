# ========================================
# MODULE OUTPUTS - Service EC2
# ========================================

output "instance_id" {
  description = "ID de la instancia EC2 creada"
  value       = aws_instance.svc.id
}

output "public_dns" {
  description = "DNS público de la instancia"
  value       = aws_instance.svc.public_dns
}

output "private_ip" {
  description = "IP privada de la instancia"
  value       = aws_instance.svc.private_ip
}

output "public_ip" {
  description = "IP pública de la instancia"
  value       = aws_instance.svc.public_ip
}

output "availability_zone" {
  description = "Availability Zone donde se desplegó la instancia"
  value       = aws_instance.svc.availability_zone
}
