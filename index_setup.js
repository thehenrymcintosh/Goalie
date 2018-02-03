const remote = require('electron').remote
const main = remote.require('./main.js')
const ipc = require('electron').ipcRenderer
var configuration = require('./configuration.js');

var btnDone = document.querySelector('#back');
var goalField = document.querySelector('#goal');
var nameField = document.querySelector('#name');
var colorPicker = document.querySelector('#color');
var body = document.querySelector('body');
var color;

window.onLoad = defaultGoal();
function defaultGoal() {
  goalField.innerHTML = configuration.readSettings('Goal');  
  nameField.innerHTML = configuration.readSettings('Name');
  color = configuration.readSettings('Color');
  colorPicker.value = color;
  body.setAttribute("style", "--depth-color: " + color +"");
}

colorPicker.addEventListener('change', ()=>{
  body.setAttribute("style", "--depth-color: " + colorPicker.value +"");
});

btnDone.addEventListener('click', ()=>{
  var goal = goalField.innerHTML;
  var name = nameField.innerHTML;
  main.changeScreen_main();
  ipc.send('set-goal', goal);
  ipc.send('set-name', name);
  ipc.send('set-color', colorPicker.value );

},false)

function drophandler() {
  var holder = document.querySelector('body');

  holder.ondragover = () => {
      return false;
  };

  holder.ondragleave = () => {
      return false;
  };

  holder.ondragend = () => {
      return false;
  };

  holder.ondrop = (e) => {
      e.preventDefault();

      for (let f of e.dataTransfer.files) {
          console.log('File(s) you dragged here: ', f.path)
      }
      
      return false;
  };
};
