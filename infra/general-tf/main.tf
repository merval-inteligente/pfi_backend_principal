terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.60" }
  }
}

provider "aws" { region = var.region }

# Remote state desde alertas-tf para compartir VPC y Security Groups
data "terraform_remote_state" "alertas" {
  backend = "local"
  config = {
    path = "C:/Users/Nicolas/Desktop/Alertas/alertas-tf/terraform.tfstate"
  }
}

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
  source  = "./modules/service-ec2"
  name    = "general"
  project = var.project

  # Usar infraestructura compartida de alertas-tf via remote state
  subnet_id = data.terraform_remote_state.alertas.outputs.subnet_id
  security_group_ids = [
    data.terraform_remote_state.alertas.outputs.security_group_id,       # SG interno
    data.terraform_remote_state.alertas.outputs.public_security_group_id # SG público (HTTP/SSH)
  ]

  ami_id        = data.aws_ami.al2023.id
  instance_type = var.instance_type
  key_name      = var.key_name

  container_port   = var.container_port
  public_http_port = var.public_http_port
  repo_url         = var.repo_url
  start_command    = var.start_command
  runtime_image    = var.runtime_image
  extra_env        = var.extra_env
}
