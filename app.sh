#!/bin/bash

sleep 30 

sudo yum update -y

    sudo yum install -y gcc-c++ make

    curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
    sudo yum install -y nodejs

    sudo yum install mysql -y


    echo "Installing Cloudwatch Agent"

#download cloudwatch agent rpm
sudo wget https://s3.us-east-1.amazonaws.com/amazoncloudwatch-agent-us-east-1/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm

#install cloudwatch agent
sudo rpm -U ./amazon-cloudwatch-agent.rpm

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ec2-user/agentConfig.json -s

#check if cloudwatch agent is running
sudo systemctl status amazon-cloudwatch-agent.service


    # Install MySQL
    # sudo amazon-linux-extras install epel -y 
    # sudo yum install https://dev.mysql.com/get/mysql80-community-release-el7-5.noarch.rpm -y
    # sudo yum install mysql-community-server -y
    # sudo systemctl start mysqld.service
    # password=$(sudo cat /var/log/mysqld.log | grep "A temporary password" | awk '{print $NF}')
    # sudo mysql -u root -p$password --connect-expired-password -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root1234';CREATE DATABASE ExpressApp;USE ExpressApp;"

# export temp=$(sudo cat /var/log/mysqld.log | grep "A temporary password" | awk -F ' ' '{print $NF}')
# sudo mysql -u root -p$temp --connect-expired-password -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'S@1ch@r@nreddymaila';CREATE DATABASE ExpressApp;USE ExpressApp;"

cd /home/ec2-user && unzip ./ExpressApp.zip

# cd ~/Express_App-1

npm install

npm uninstall bcrypt

npm install bcrypt

echo "done init"

sudo mv /tmp/ExpressApp.service /etc/systemd/system/ExpressApp.service
sudo systemctl enable ExpressApp.service
sudo systemctl start ExpressApp.service