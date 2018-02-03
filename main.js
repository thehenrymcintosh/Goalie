
const electron = require('electron');
const {app, BrowserWindow} = electron
const ipc = require('electron').ipcMain
const Menu = electron.Menu
const Tray = electron.Tray
var configuration = require('./configuration');
var path = require('path')

var appIcon = null
'use strict';

app.dock.setBadge('')
app.dock.hide();      //Hide from dock

var iconName = process.platform === 'win32' ? 'tray_1.png' : 'tray_1.png'  // Icon paths for the trays
 const iconPath_1 = __dirname + '/imgs/' + iconName

iconName = process.platform === 'win32' ? 'tray_2.png' : 'tray_2.png'   // Icon paths for the trays
 const iconPath_2 = __dirname + '/imgs/' + iconName


app.on('ready', function () {
  win = new BrowserWindow({width:800, height:450, frame:false, resizable: false,}) // Make app window

  win.icon = 'file://' + __dirname + '/assets/icons/png/64x64.png'  //window icon (not really necessary as window is hidden)
    
  try{

  

    if (!configuration.readSettings('Goal')) { //check if config goal is set
      var goal = 'Eat 5 muffins'; //default goal
      configuration.saveSettings('Goal', goal); //save goal
    };

    if (!configuration.readSettings('Name')) { //check if config name is set
      var name = 'Mycroft';          // default name
      configuration.saveSettings('Name', name); // save name
    };

    if (!configuration.readSettings('Streak')) { //check if streak is set
      var streak = 0;          // streak is 0
      configuration.saveSettings('Streak', streak); // save streak
    };

    if (!configuration.readSettings('Color')) { //check if streak is set
      configuration.saveSettings('Color', '#e78b00'); // save streak
    };
    if (!configuration.readSettings('ColorMain')) { //check if streak is set
      configuration.saveSettings('ColorMain', '#ffffff'); // save streak
    };
    if (configuration.readSettings('onStreak') == null) { //check if streak status is set
      configuration.saveSettings('onStreak', false); // save streak status
    };
    if (!configuration.readSettings('backgroundPath')) { //check if bg  is set
      configuration.saveSettings('backgroundPath', './imgs/img_3.jpeg'); // save bg
    };
  }catch(err){
    configuration.saveSettings('Color', '#e78b00'); // reset highlight color
    configuration.saveSettings('ColorMain', '#ffffff'); // reset main color
    configuration.saveSettings('backgroundPath', './imgs/img_3.jpeg'); // reset bg
    configuration.saveSettings('Goal', 'Eat too many wasabi peas'); // reset goal
    configuration.saveSettings('Name', 'Mycroft'); // reset name
    configuration.saveSettings('Streak', 0); // reset streak
    configuration.saveSettings('onStreak', false); 
    console.log(err);

    }


    win.loadURL('file://' + __dirname + '/index_main.html'); // load main screen
    
    appIcon = new Tray(iconPath_1) // tray

    if(configuration.readSettings('onStreak')){
      appIcon.setImage(iconPath_2);
    }
    var contextMenu = get_menu(); // function to reset tray menu
    appIcon.setToolTip('Goalie') ;     // set tray tooltip
    appIcon.setContextMenu(contextMenu); //set tray menu

  });

exports.changeScreen_main = ()=>{
  win.loadURL('file://' + __dirname + '/index_main.html');  //change screen - called by browser setup
}
exports.changeScreen_goalChange = ()=>{
  win.loadURL('file://' + __dirname + '/index_setup.html'); // change screen - called by browser main
}



var goal = configuration.readSettings('Goal');
var name = configuration.readSettings('Name');
var streak = configuration.readSettings('Streak');


ipc.on('set-goal', function (event, arg) {
  let currentGoal = configuration.readSettings('Goal');
  if (currentGoal != arg){
    configuration.saveSettings('Goal', arg);
    resetAll();
  }
  

  const contextMenu = get_menu()
  appIcon.setContextMenu(contextMenu)
})

ipc.on('set-name', function (event, arg) {
  configuration.saveSettings('Name', arg);
  const contextMenu = get_menu()
  appIcon.setContextMenu(contextMenu)
})

ipc.on('set-color', function (event, arg) {
  configuration.saveSettings('Color', arg);
})
ipc.on('set-maincolor', function (event, arg) {
  configuration.saveSettings('ColorMain', arg);
})

ipc.on('get-goal', function (event, arg) {
  event.sender.send('new-goal', goal)
})

ipc.on('get-name', function (event, arg) {
  event.sender.send('new-name', name)
})

ipc.on('change-tray_2', function (event, arg) {
   appIcon.setImage(iconPath_2)
})
ipc.on('change-tray_1', function (event, arg) {
   appIcon.setImage(iconPath_1)
})
ipc.on('ipcgoal_achieved', goalAcheived);





var interval;

function goalAcheived() {
  configuration.saveSettings('onStreak', true);
  appIcon.setImage(iconPath_2);
  resetCountdown();
}
exports.resetCountdownRemote = () => {resetCountdown();}
function resetCountdown(midnight){
  clearInterval(interval);
  var midnight = new Date();
  midnight.setHours(24,0,0,0);
  interval = setInterval(checkMidnight,1000, midnight);
}

function checkMidnight(midnight){
  var millisTillMidnight = midnight - new Date();
  console.log(millisTillMidnight);
  if (millisTillMidnight < 0) {
      clearInterval(interval);
      if(!configuration.readSettings('onStreak')){
        resetAll();
      } else {
        newDay();
      }
      
  }
}
exports.resetAllRemote = () => {resetAll();}
resetAll = () => {
  configuration.saveSettings('Streak', 0);
  configuration.saveSettings('onStreak', false);
  clearInterval(interval);
  newDay()
}
newDay = ()=> {
  if(configuration.readSettings('onStreak')){
    resetCountdown();
    configuration.saveSettings('onStreak', false);
  }
  appIcon.setImage(iconPath_1);
  win.webContents.send('update');

}

function get_menu(){
  contextmenu = Menu.buildFromTemplate([{

    label: 'Hello ' + configuration.readSettings('Name') },
    {
      label:'Daily Goal: ' + configuration.readSettings('Goal')
    },

    {
 label: 'Show',
 click: function () {
   win.show();
   }
 },

 {
 label: 'Hide',
 click: function () {
   win.hide();
   }
 },

 {
   label: 'Quit',
   click: function () {
     app.quit();
   }
 }
])
return contextmenu;
}


 function goal_2(goal_name, type, time_period) {
  this.goal_name = goal_name;
  this.type = type;
  this.time_period = time_period;
  this.streak_date = null;
  this.time_spent_period = 0;
  this.time_spent_total = 0;
}
