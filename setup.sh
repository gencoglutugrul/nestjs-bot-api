#!/bin/bash

# exit if any error occurs
set -e

# change dir as project directory
cd $(dirname "$0")

# update repositories
echo "## Updating the repositories"
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt update

# install desktop environment
clear;
echo "## Installing desktop environment"
sudo apt install -y xfce4

# Install dependencies
clear;
echo "## Installing web server"
sudo apt install -y nodejs nginx redis-server
sudo npm install -g npm

# configure nginx
clear;
echo "## Configuring web server"
echo 'server {
	listen 80 default_server;
	listen [::]:80 default_server;

	server_name _;

	location / {
		proxy_pass http://127.0.0.1:3000;
	}
}' | sudo tee /etc/nginx/sites-enabled/default

# restart nginx
sudo service nginx restart


# Install chrome remote desktop
clear;
echo "## Installing chrome remote desktop"
sudo apt install -y xvfb xbase-clients python3-psutil
rm -rf /tmp/chrome-remote-desktop_current_amd64.deb
wget https://dl.google.com/linux/direct/chrome-remote-desktop_current_amd64.deb -P  /tmp
sudo dpkg -i /tmp/chrome-remote-desktop_current_amd64.deb

# Authorize chrome remote desktop
clear;
echo "Please go https://remotedesktop.google.com/headless"
echo "Switch your account if needed"
echo "Click to Begin, Next, Authorize in an ordered way"
echo "Copy the command below the Debian Linux title"
echo "Enter the command to here:"
read remote_desktop_command;
auth_code=$(echo $remote_desktop_command |  sed -n 's/.*--code="\([^"]*\).*/\1/p')
echo "Authorizing chrome remote desktop with code: $auth_code"

# generate PIN
pin_number=$(shuf -i100000-999999 -n1)

DISPLAY= /opt/google/chrome-remote-desktop/start-host --code="$auth_code" --redirect-url="https://remotedesktop.google.com/_/oauthredirect" --name=$(hostname) --pin=$pin_number

clear;
echo "Please go to https://remotedesktop.google.com/access/"
echo "Switch your account if needed"
echo "You should see a device named '$(hostname)' under the **Remote devices** section. Click it."
echo "It should ask for a PIN. Enter '$pin_number' as PIN."
echo "Check 'Remember my PIN on this device' and submit."
echo "Click OK button on the popup."
echo "If it asks for the authorization, type your password and click to authenticate."
echo "Waiting for you to complete these steps..."
until [[ ! -z $(pidof xfce4-session) ]]; do sleep 1; done;

# install packages and run API
clear;
echo "## Installing npm packages"
npm install --silent
mkdir -p ~/sessions

# configure env variables
clear;
echo "Configuring environment variables"
rm -rf .env

cat /proc/$(pidof xfce4-session)/environ | tr "\0" "\n" | grep "DISPLAY" >> .env
echo "SESSIONS_DIR=$(realpath ~/sessions/)" >> .env
echo "REDIS_HOST=localhost" >> .env
echo "REDIS_PORT=6379" >> .env

# setup slack env
clear;
slack_token=""
while : ; do
	echo "Please create an app on https://api.slack.com/ if you don't"
	echo "Go to 'OAuth & Permissions'."
	echo "On 'Bot Token Scopes' add 'channels:read' and 'chat:write' scopes."
	echo "On 'OAuth Tokens for Your Workspace', click 'Reinstall to Workspace' button."
	echo "Copy the 'Bot User OAuth Token'."
	echo "Go to channel that you want to add bot, click view all members"
	echo "On integration tab, click Add an App button."
	echo "Click add next on your app."
	echo ""
	echo "Please enter the Bot User OAuth Token that you copied: "
	read slack_token;
	curl_result=$(curl "https://slack.com/api/api.test" -H "Authorization: Bearer $slack_token")
	token_test=$(echo $curl_result | grep -c "\"token\":\"$slack_token\"")
	[ $token_test -eq 1 ] && break
	clear;
	echo "Error: your token is not valid!"
done

echo "The token is valid: $slack_token"

clear;
slack_channel=""
while : ; do
	curl_result=$(curl 'https://slack.com/api/conversations.list' -H "Authorization: Bearer $slack_token" | tr ',' '\n' | grep '"name":' | cut -d '"' -f4)
	i=1
	for channel in $curl_result; do
		echo "$i. $channel";
		i=$((i+1))
	done;
	i=$((i-1))
	
	echo "Please enter a channel number to send notification [1-$i]: "
	read channel_id
	
	slack_channel=$(echo $curl_result | cut -d " " -f$channel_id)
	[ $channel_id -ge 1 ] && [ $channel_id -le $i ] && break;

	clear;
	echo "Error: invalid selection!"
done

echo "Selected channel: $slack_channel"

echo "SLACK_TOKEN=$slack_token" >> .env
echo "SLACK_CHANNEL=$slack_channel" >> .env

# starting the API
echo "Starting up the API"
npm run start:nohup

echo "Finished successfuly."
exit