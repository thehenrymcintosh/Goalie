# Goalie
Keep on top of your daily goal, with a remembrall in the tray to remind you. 

### To run: 
- Clone repo
- npm install
- npm start

### To package for mac (outputs to desktop, remember to increment version, new folder will overwrite previous build):
- npm install -g electron-packager (only do this once)
- electron-packager ./ Goalie --Darwin --out ~/Desktop/Goalie --version 2.0.0 --overwrite --icon=./assets/icons/mac/goalie.icns
