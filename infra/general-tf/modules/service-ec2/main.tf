# Security Groups se gestionan desde alertas-tf
# Usamos los SGs compartidos via remote state

data "template_file" "user_data" {
  template = file("${path.module}/user_data.tpl")
  vars = {
    RUNTIME_IMAGE  = var.runtime_image
    CONTAINER_PORT = var.container_port
    PUBLIC_HTTP    = var.public_http_port
    REPO_URL       = var.repo_url
    START_COMMAND  = var.start_command
    EXTRA_ENVS     = join("\n", [for k, v in var.extra_env : "${k}=${v}"])
    APP_NAME       = var.name
  }
}

resource "aws_instance" "svc" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = var.security_group_ids
  associate_public_ip_address = true
  key_name                    = var.key_name != "" ? var.key_name : null

  user_data = data.template_file.user_data.rendered

  tags = { Name = "${var.project}-${var.name}" }
}
