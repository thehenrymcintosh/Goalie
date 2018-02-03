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
  win = new BrowserWindow({width:800, height:450, frame:true, resizable: true,}) // Make app window

  win.icon = 'file://' + __dirname + '/assets/icons/png/64x64.png'  //window icon (not really necessary as window is hidden)

    if (!configuration.readSettings('Goal')) { //check if config goal is set
      var goal = 'Eat too many wasabi peas'; //default goal
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

    win.loadURL('file://' + __dirname + '/index_main.html'); // load main screen
    
    appIcon = new Tray(iconPath_1) // tray

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
  goal = `${arg}`
  configuration.saveSettings('Goal', goal);

  const contextMenu = get_menu()
  appIcon.setContextMenu(contextMenu)
})

ipc.on('set-name', function (event, arg) {
  name = `${arg}`
  configuration.saveSettings('Name', name);
  const contextMenu = get_menu()
  appIcon.setContextMenu(contextMenu)
})

ipc.on('set-color', function (event, arg) {
  color = arg;
  configuration.saveSettings('Color', color);
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

function goalAcheived() {
  appIcon.setImage(iconPath_2);
}

function get_menu(){
  contextmenu = Menu.buildFromTemplate([{

    label: 'Hello ' + configuration.readSettings('Name')},
    {
      label:'Daily Goal: ' + configuration.readSettings('Goal'),
      click: goalAcheived
      // click: function () {
      //   win.webContents.send( 'ipcgoal_achieved' );
      // }
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
