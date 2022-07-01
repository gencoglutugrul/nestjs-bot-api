#!/bin/bash

# exit if any error occurs
set -e

# change dir as project directory
cd $(dirname "$0")

# update repositories
echo "## Updating the repositories"
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
apt update

# install desktop environment
echo "## Installing desktop environment"
apt install -y xfce4

# Install dependencies
echo "## Installing web server"
apt install -y nodejs nginx redis-server
npm install -g npm

# configure nginx
echo "## Configuring web server"
echo 'server {
	listen 80 default_server;
	listen [::]:80 default_server;

	server_name _;

	location / {
		proxy_pass http://127.0.0.1:3000;
	}
}' > /etc/nginx/sites-enabled/default

# restart nginx
service nginx restart


# Install chrome remote desktop
echo "## Installing chrome remote desktop"
apt install -y xvfb xbase-clients python3-psutil
rm -rf /tmp/chrome-remote-desktop_current_amd64.deb
wget https://dl.google.com/linux/direct/chrome-remote-desktop_current_amd64.deb -P  /tmp
dpkg -i /tmp/chrome-remote-desktop_current_amd64.deb

# Authorize chrome remote desktop
echo "##################################################"
echo ""
echo "Please go https://remotedesktop.google.com/headless"
echo "Switch your account if needed"
echo "Click to Begin, Next, Authorize in an ordered way"
echo "Copy the command below the Debian Linux title"
echo "Enter the command to here:"
read remote_desktop_command;
auth_code=$(echo $remote_desktop_command |  sed -n 's/.*--code="\([^"]*\).*/\1/p')
echo ""
echo "#################################################"
echo "Authorizing chrome remote desktop with code: $auth_code"

# find username
user_name=$(who am i |awk '{print $1}')

# generate PIN
pin_number=$(shuf -i100000-999999 -n1)
echo "## Username:" $user_name
echo "## PIN:" $pin_number
DISPLAY= /opt/google/chrome-remote-desktop/start-host --code="$auth_code" --redirect-url="https://remotedesktop.google.com/_/oauthredirect" --name=$(hostname) --user-name=$user_name --pin=$pin_number
echo $DISPLAY

echo "#################################################"
echo ""
echo "Please go to https://remotedesktop.google.com/access/"
echo "Switch your account if needed"
echo "You should see a device named '$(hostname)' under the **Remote devices** section. Click it."
echo "It should ask for a PIN. Enter '$pin_number' as PIN."
echo "Check 'Remember my PIN on this device' and submit."
echo "Click OK button on the popup."
echo "If it asks for the authorization, type your password and click to authenticate."
echo "Waiting for you to complete these steps..."
until [[ ! -z $(pidof xfce4-session) ]]; do sleep 1; done;
echo "#################################################"

# install packages and run API
echo "## Installing npm packages"
npm install --silent
mkdir -p ~/sessions

# configure env variables
echo "Configuring environment variables"
rm -rf .env

cat /proc/$(pidof xfce4-session)/environ | tr "\0" "\n" | grep "DISPLAY" >> .env
echo "SESSIONS_DIR=$(realpath ~/sessions/)" >> .env
echo "REDIS_HOST=localhost" >> .env
echo "REDIS_PORT=6379" >> .env

# starting the API
echo "Starting up the API"
$(npm run start:nohup)

echo "Finished successfuly."
exit