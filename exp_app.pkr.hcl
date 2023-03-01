

locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}

source "amazon-ebs" "amazon-linux-2" {
  ami_name      = "${var.ami_name}-${local.timestamp}"
  instance_type = var.instance_type
  region        = var.region
  profile       = var.profile
  source_ami_filter {
    filters = {
      name                = var.ami_filter_name
      root-device-type    = var.device_type
      virtualization-type = var.virtual_type
    }
    most_recent = true
    owners      = [var.owner]
  }
  ami_users = [var.ami_user]

  ssh_username = var.ssh_username
  ssh_timeout  = var.ssh_timeout

  associate_public_ip_address = true
}


// 944066285630



build {
  
   sources = ["source.amazon-ebs.amazon-linux-2"]

  provisioner "file" {
source = "dist/Express_App-1.zip"
destination = "/home/ec2-user/ExpressApp.zip"
}

  provisioner "file" {
source = "./Express_App.service"
destination =  "/tmp/ExpressApp.service"
}

  provisioner "shell" {
    script = "./app.sh"
  }
}





