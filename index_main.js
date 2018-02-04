
const remote = require('electron').remote
const main = remote.require('./main.js')
const ipc = require('electron').ipcRenderer
var configuration = require('./configuration');

var name = document.querySelector('#name');
var goal = document.querySelector('#goal span');
var goalWrapper = document.querySelector('.goal__wrapper');
var successWrapper = document.querySelector('.success__wrapper');
var successText = document.querySelector('.success__title');
var successCheck = document.querySelector('.success__checkbox span');
var settings = document.querySelector('.settings');
var body = document.querySelector('body');
var streak = document.querySelector('.streak');
var streakVal = document.querySelector('.streak .number');
var path = configuration.readSettings('backgroundPath');

var arrStreakText = ['You achieved your daily goal!', "Yay! You completed your daily goal!", "Well done " + configuration.readSettings('Name') + ", keep up the good work!", "You're on a " + configuration.readSettings('Streak') + " day streak, keep it up!" ];

window.onLoad = reset();
function reset() {
  goal.innerHTML = configuration.readSettings('Goal');  
  name.innerHTML = configuration.readSettings('Name');
  streakVal.innerHTML = configuration.readSettings('Streak');
  setStreakText();
  if(configuration.readSettings('Streak') > 0 ){
    streak.classList.remove('hide');
  } else {
    streak.classList.add('hide');
  }
  if(configuration.readSettings('onStreak')){
    ui_goal_acheived();
    main.resetCountdownRemote();
  } else {
    ui_goal_reset();
  }
  streak
  color = configuration.readSettings('Color');  
  colorMain = configuration.readSettings('ColorMain');
  // body.setAttribute("style", "--depth-color: " + color +"");
  // body.setAttribute("style", "--main-color: " + colorMain +"");
  body.setAttribute("style", "--depth-color: " + color + "; --main-color: " + colorMain +"; --background-img: url('" + path + "');");
}

goalWrapper.addEventListener('click',() =>{
  ipc.send('ipcgoal_achieved');
  goal_achieved();
});

settings.addEventListener('click', ()=>{
    main.changeScreen_goalChange();
    // goal_reset();
  },false)


function goal_achieved(){
  let streakLength = configuration.readSettings('Streak') + 1;
  configuration.saveSettings('Streak', streakLength );
  configuration.saveSettings('onStreak', true);
  streakVal.innerHTML = streakLength;
  arrStreakText = ['You achieved your daily goal!', "Yay! You completed your daily goal!", "Well done " + configuration.readSettings('Name') + ", keep up the good work!", "You're on a " + streakLength + " day streak, keep it up!" ];
  setStreakText();
  ui_goal_acheived();
}

function ui_goal_acheived(){
  goalWrapper.classList.add('hide');
  successWrapper.classList.remove('hide')
  successCheck.classList.add('check');
  let streakLength = configuration.readSettings('Streak');
  streakVal.innerHTML = streakLength;
  streak.classList.remove('hide');
}
function ui_goal_reset(){
  goalWrapper.classList.remove('hide');
  successWrapper.classList.add('hide')
  successCheck.classList.remove('check');
  let streakLength = configuration.readSettings('Streak');
  streakVal.innerHTML = streakLength;
  if(streakLength > 0 ){
    streak.classList.remove('hide');
  } else {
    streak.classList.add('hide');
  }
}

function setStreakText(){
  let i = getRandomInt(arrStreakText.length);
  successText.innerHTML = arrStreakText[i];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

ipc.on('ipcgoal_reset', function (event, arg) {
  // goal_reset();
})

ipc.on('update' , reset);

var holder = document;

  holder.ondragover = () => {
      return false;
  };

  holder.ondragleave = () => {
      return false;
  };

  holder.ondragend = () => {
      return false;
  };

  holder.ondrop = () => {
      return false;
  };




// function goal_achieved() {

//   goal.innerHTML = ' ';
//   subtitle.innerHTML = 'Daily Goal Complete. Well done!';
//   goal.setAttribute("style", "background-color: green");
//   goal.setAttribute("class", "done get_started");
//   for (var i=0; i < check.length; i++) {
//     check[i].style.transition = "all 0s 1s ease";
//     check[i].style.opacity = "100";
//   }
//   ipc.send('change-tray_2','')
//   goal.removeEventListener('click', goal_achieved);
//   date_achieved = new Date();
//   midnight = new Date(date_achieved.getFullYear(), date_achieved.getMonth(), date_achieved.getDate(), 0, 0, 0, 0);
//   time_check = window.setInterval(check_midnight, 10000);
// }

// function goal_reset() {
//     goal.setAttribute("class", "get_started");
//     goal.setAttribute("style", "");
//     goal.innerHTML = configuration.readSettings('Goal');
//     subtitle.innerHTML = "Here's your daily goal";
//     for (var i=0; i < check.length; i++) {
//       check[i].style.transition = "all 0s 0s ease";
//       check[i].style.opacity = "0";
//     }
//   ipc.send('change-tray_1','')
//   window.clearInterval(time_check);

// }

// function check_midnight() {
//   now = new Date()
//   //alert(midnight - now + 86400000);
//   if ((midnight - now + 86400000) < 0){
//     goal_reset();
//   }
// }

// window.onLoad = changeGoal();
// function changeGoal() {
//   ipc.send('get-goal', '')
//   document.getElementById('name').innerHTML = configuration.readSettings('Name');

// }

// ipc.on('new-goal', function (event, arg) {
//   const new_goal= `${arg}`
//   document.getElementById('goal').innerHTML = new_goal
// })

// var btnSetGoal = document.querySelector('.back');
// btnSetGoal.addEventListener('click', ()=>{

//   main.changeScreen_goalChange();
//     goal_reset();
// },false)







/*
goal.addEventListener('click', ()=>{
  goal.innerHTML = ' ';
  subtitle.innerHTML = 'Daily Goal Complete. Well done!';
  goal.setAttribute("style", "background-color: green");
  goal.setAttribute("class", "done get_started");
  for (var i=0; i < check.length; i++) {
    check[i].setAttribute("style", "opacity:100");
}
var now = new Date();
var millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0) - now;
if (millisTillMidnight < 0) {
     millisTillMidnight += 86400000; // it's after 10am, try 10am tomorrow.
}
ipc.send('change-tray_2','')
setTimeout(function(){

  goal.setAttribute("class", "get_started");
  goal.setAttribute("style", "");
  goal.innerHTML = configuration.readSettings('Goal');
  subtitle.innerHTML = "Here's your daily goal";
  for (var i=0; i < check.length; i++) {
    check[i].setAttribute("style", "opacity:0");
  }
ipc.send('change-tray_1','')
}, millisTillMidnight);


},false)
*/