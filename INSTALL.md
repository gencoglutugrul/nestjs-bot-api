# SETUP GUIDE

This documentation was tested on the latest version of Ubuntu for the demo server. If you use Debian-based distributions or Ubuntu itself, you can copy and paste all these commands. If you use another distribution you need to change the commands according to the package manager of the distribution that you choose. But we strongly suggest to use Ubuntu. You need to follow the steps in an ordered way.

## INITIAL NOTE

DO NOT USE ROOT USER TO FOLLOW THESE STEPS. YOU NEED A NON ROOT USER FOR THIS SETUP. IF YOU HAVE ONE YOU CAN SKIP TO NEXT STEP.

You can create one if you don't have any by following commands.

```bash
# do not forget to set a password to this user.
adduser newUser

# change user
su newUser
```

## CREATE SLACK APP FOR NOTIFICATION

- Go to https://api.slack.com/apps
- Login if needed
- Click 'Create New App' button on the top right.
- Click 'From stratch' on the popup.
- Input a name for your app (e.g: Captcha Notifier)
- Select workspace
- Click 'Create App' button.
- Click 'OAuth & Permissions' button on the sidebar.
- Below of the 'Scopes' title, click 'Add an OAuth Scope' on below of the 'Bot Token Scopes'.
- Type 'channels:read' and select it.
- Type 'chat:write' and select it.
- On same page click 'Install to Workspace' button on belof of the 'OAuth Tokens for Your Workspace' title.
- Click allow.
- You can now see the 'Bot User OAuth Token'.
- Copy and note it for next steps.
- Go to channel that you want to send notification.
- Click 'View all members of this channel'
- Switch to 'Integrations' tab.
- Click 'Add an App'
- Select the app that you created, click Add again.

## EASY INSTALL

You can use the setup script for easy installation. Before runing the script you should upload the project to the server. You can do it as the following command below.

```bash
scp /theproject/zipfile/on/local/computer/project.zip userName@yourserver.com:/home/userName
```

Or you can upload to a git server and clone it by git.

```bash
# unzip the project file if needed
unzip project.zip

# change directory with project directory
cd project

# make script executable
chmod +x ./setup.sh

# start installation
./setup.sh

```

## MANUAL INSTALL

### INSTALL DESKTOP ENVIRONMENT

We choosed **Xfce** as desktop environment. You can install other desktop environments if you want anyting else. But we suggest xfce for both user firendly interface and in order to keep resource expenditures to a minimum. You can also choose **Lxde** if you want to keep your resource expenditures lower.

```bash
sudo apt update

# to install xfce
sudo apt install xfce4

# to install lxde
sudo apt install lxde
```

### INSTALL CHROME REMOTE DESKTOP

- Install chrome remote desktop to the server as following commands below.

```bash
# Download chrome remote desktop installing package
wget https://dl.google.com/linux/direct/chrome-remote-desktop_current_amd64.deb

# Install required dependencies for chrome remote desktop
sudo apt install xvfb xbase-clients python3-psutil

# Install
sudo dpkg -i ./chrome-remote-desktop_current_amd64.deb
```

- Go to https://remotedesktop.google.com/headless
- Switch your account to `hosthub.captcha.solver@gmail.com`
- Click `Begin`
- Click `Next`
- Click `Authorize`
- Copy the code below the **Debian Linux** title.
- Run the copied command on the server. The command should be similar to the following command below.

```bash
DISPLAY= /opt/google/chrome-remote-desktop/start-host --code="XXXXX" --redirect-url="https://remotedesktop.google.com/_/oauthredirect" --name=$(hostname)
```

- This command asks you for a **PIN**. Choose a pin of at least six digits. And keep this pin for the next steps. The command can output some warnings, ignore if it does.

### INSTALL WEB SERVER & API DEPENDENCIES

```bash
## Add nodejs repository to the package manager repositories
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -

# Install nodejs
sudo apt install -y nodejs

# Update the npm version
sudo npm install -g npm

# Install nginx as a webserver
sudo apt install nginx

# Install redis to keep job queue
sudo apt install redis-server
```

- Change the content of the file `/etc/nginx/sites-enabled/default` as below to configure nginx as a proxy to the API.

```nginx
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	server_name _;

	location / {
		proxy_pass http://127.0.0.1:3000;
	}
}
```

- You can use the following command to change content of file.

```bash
sudo nano /etc/nginx/sites-enabled/default
```

- After making your changes you can save the file by pressing CTRL+O

- Restart the nginx service with following command

```bash
sudo service nginx restart
```

### TEST CHROME REMOTE DESKTOP CONNECTION

- Go to https://remotedesktop.google.com/access/
- Switch your account to `hosthub.captcha.solver@gmail.com`
- You should see a device under the **Remote devices** section. Click it. It should ask for a PIN. Enter the pin that you setup before.
- Check `Remember my PIN on this device` and submit. This way you will never encounter with PIN section again.

- A blank page with the popup will welcome you. Click OK button on the popup.

- You can see a authentication popup, type password of your user and click authenticate. You will never encounter it again.

### SETUP & RUN THE API

You need to copy the project files to the server. You can download it to the server on a browser by connecting to remote desktop, or you can use command called **scp** as following.

```bash
scp /theproject/zipfile/on/your/computer/project.zip userName@yourserver.com:/home/userName
```

After this command you should extract project as following command.

```bash
# Extract project
unzip project.zip

# Change dir to project dir
cd project

# Install npm packages
npm install

# Create directory for storing the sessions
mkdir ~/sessions

# Specify which desktop session should chrome run
ps e | grep chrome-remote-desktop | grep DISPLAY | sed -rn 's/.* DISPLAY=(.*).*/DISPLAY=\1/p' | head -n 1 >> .env

# Specify sessions directory to API
echo "SESSIONS_DIR=$(realpath ~/sessions/)" >> .env

# Specify redis host and port
echo "REDIS_HOST=localhost" >> .env
echo "REDIS_PORT=6379" >> .env

# Specify slack token and channel
echo "SLACK_TOKEN=xoxb-XXXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXXX" >> .env
echo "SLACK_CHANNEL=#your-channel" >> .env

# Start the API
npm run start:nohup

# Exit from the ssh
exit
```

### ENVIRONMENT VARIABLES

- SESSIONS_DIR: full path of the directory that will store sessions
- REDIS_HOST: Redis host
- REDIS_PORT: Redis port
- DISPLAY: X session id where the browser will run. It can be obtained by connecting to google remote desktop and running `echo $DISPLAY` on a terminal that is run on a graphical interface. In Linux, it is this environment variable that determines which application will run on which desktop.
- SLACK_TOKEN: Slack token that will be used on sending notification. It should start with `xoxb`
- SLACK_CHANNEL: Slack channel to send the message to. It can be the channel name itself, it can be #channel-name, or channel id.

There is no deffault values for the environment variables. All should be setted in .env file.
