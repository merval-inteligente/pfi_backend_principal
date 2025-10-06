terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.60" }
  }
}

provider "aws" { region = var.region }

# AMI Amazon Linux 2023
data "aws_ami" "al2023" {
  owners      = ["137112412989"]
  most_recent = true
  
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
  
  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
  
  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }
}

module "svc_general" {
  source            = "./modules/service-ec2"
  name              = "general"
  project           = var.project

  vpc_id            = var.vpc_id
  subnet_id         = var.subnet_id
  intra_sg_id       = var.intra_sg_id
  vpc_cidr          = var.vpc_cidr

  ami_id            = data.aws_ami.al2023.id
  instance_type     = var.instance_type
  key_name          = var.key_name
  enable_ssh        = var.enable_ssh
  ssh_cidr          = var.ssh_cidr

  container_port    = var.container_port
  public_http_port  = var.public_http_port
  repo_url          = var.repo_url
  start_command     = var.start_command
  runtime_image     = var.runtime_image
  extra_env         = var.extra_env
}

# Health check deshabilitado - no funciona en Windows porque no tiene /bin/bash
# Si querés habilitarlo, instalá Git Bash o WSL
# resource "null_resource" "wait_http" {
#   depends_on = [module.svc_general]
#   triggers = {
#     url = "http://${module.svc_general.public_dns}/"
#   }
#   provisioner "local-exec" {
#     interpreter = ["/bin/bash", "-lc"]
#     command = <<-EOC
#       url="${self.triggers.url}"
#       echo "Esperando a que $url responda 200..."
#       for i in {1..60}; do
#         if curl -fsS -o /dev/null -m 5 "$url" || curl -fsS -o /dev/null -m 5 "$${url}health"; then
#           echo "OK: servicio arriba."
#           exit 0
#         fi
#         sleep 5
#       done
#       echo "Timeout esperando la app. Revisá logs en la instancia."
#       exit 1
#     EOC
#   }
# }
