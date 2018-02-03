const electron = require('electron');
const path = require('path');

const userDataPath = (electron.app || electron.remote.app).getPath('userData');
this.path = path.join(userDataPath, 'goalie-data.json');


var nconf = require('nconf').file({file: this.path});

function saveSettings(settingKey, settingValue) {
    nconf.set(settingKey, settingValue);
    nconf.save();
}

function readSettings(settingKey) {
    nconf.load();
    return nconf.get(settingKey);
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}


module.exports = {
    saveSettings: saveSettings,
    readSettings: readSettings
};
