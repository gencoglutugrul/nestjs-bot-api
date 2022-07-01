# change dir as project directory
cd $(dirname "$0")

# update repositories
echo "Updating the repositories"
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
apt update

# install de & chrome remote desktop
echo "Installing desktop environment"
apt install -y xfce4

echo "Installing chrome remote desktop"
apt install -y xvfb xbase-clients python3-psutil
wget https://dl.google.com/linux/direct/chrome-remote-desktop_current_amd64.deb -P  /tmp
dpkg -i /tmp/chrome-remote-desktop_current_amd64.deb

# Authorize chrome remote desktop
echo "Please go https://remotedesktop.google.com/headless"
echo "Switch your account if needed"
echo "Click to Begin, Next, Authorize in an ordered way"
echo "Copy the command below the Debian Linux title"
echo "Enter the command to here:"
read remote_desktop_command;
auth_code=$(echo $remote_desktop_command |  sed -n 's/.*--code="\([^"]*\).*/\1/p')

echo "Authorizing chrome remote desktop."
$(DISPLAY= /opt/google/chrome-remote-desktop/start-host --code="$auth_code" --redirect-url="https://remotedesktop.google.com/_/oauthredirect" --name=$(hostname))

# Install dependencies
echo "Installing web server"
apt install -y nodejs nginx redis-server
npm install -g npm

# configure nginx
echo "Configuring web server"
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

# install packages and run API
echo "Installing npm packages"
npm install
mkdir ~/sessions

# configure env variables
echo "Configuring environment variables"
rm -rf .env
ps e | grep chrome-remote-desktop | grep DISPLAY | sed -rn 's/.* DISPLAY=(.*).*/DISPLAY=\1/p' | head -n 1 >> .env
echo "SESSIONS_DIR=$(realpath ~/sessions/)" >> .env
echo "REDIS_HOST=localhost" >> .env
echo "REDIS_PORT=6379" >> .env

# starting the API
echo "Starting up the API"
killall -9 node
npm run start:nohup

echo "Finished successfuly."
exit