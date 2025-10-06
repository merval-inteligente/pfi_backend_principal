output "general_public_dns" {
  value = module.svc_general.public_dns
}

output "general_private_ip" {
  value = module.svc_general.private_ip
}

output "url" {
  value = "http://${module.svc_general.public_dns}/"
}
