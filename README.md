# Install

TODO: Will Be Improved

Update the package manager repos `sudo apt update`
Install xfce to have desktop ui `sudo apt install xfce4`
Go to https://remotedesktop.google.com/headless, switch your account to `hosthub.captcha.solver@gmail.com`
Click Begin, download the chrome remote desktop with running the following command
`wget https://dl.google.com/linux/direct/chrome-remote-desktop_current_amd64.deb`
Install dependencies `sudo apt install xvfb xbase-clients python3-psutil`
Install chrome remote desktop `sudo dpkg -i ./chrome-remote-desktop_current_amd64.deb`
Click Next and Authorize
Copy content below of Debian Linux, and run it on the server.
Enter a pin (For example: 252525)

Once it has done you should see a remote device on here https://remotedesktop.google.com/access

Install Node 14 and npm 8
Use nginx to serve API (proxy_pass localhost:3000)
Install redis `sudo apt install redis-server`
