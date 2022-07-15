npm install
npm run typeorm migration:run
killall -9 node # kill the process
npm run start:nohup # start the new version