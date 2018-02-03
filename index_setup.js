const remote = require('electron').remote
const main = remote.require('./main.js')
const ipc = require('electron').ipcRenderer
var configuration = require('./configuration.js');

var btnDone = document.querySelector('#back');
var goalField = document.querySelector('#goal');
var nameField = document.querySelector('#name');
var colorPicker = document.querySelector('#color');
var colorPickerMain = document.querySelector('#color_main');
var body = document.querySelector('body');
var path = configuration.readSettings('backgroundPath');
var btnReset = document.querySelector('#reset');
var color;

window.onLoad = reset();
function reset() {
  goalField.innerHTML = configuration.readSettings('Goal');  
  nameField.innerHTML = configuration.readSettings('Name');
  var path = configuration.readSettings('backgroundPath');
  color = configuration.readSettings('Color');
  colorPicker.value = color;

  colorMain = configuration.readSettings('ColorMain');
  colorPickerMain.value = colorMain;
  body.setAttribute("style", "--depth-color: " + colorPicker.value + "; --main-color: " + colorPickerMain.value + "; --background-img: url('" + path + "');")
  
}

colorPicker.addEventListener('change', ()=>{
    body.setAttribute("style", "--depth-color: " + colorPicker.value + "; --main-color: " + colorPickerMain.value + "; --background-img: url('" + path + "');")
});
colorPickerMain.addEventListener('change', ()=>{
    body.setAttribute("style", "--depth-color: " + colorPicker.value + "; --main-color: " + colorPickerMain.value + "; --background-img: url('" + path + "');")
});

btnDone.addEventListener('click', ()=>{
  var goal = goalField.innerHTML;
  var name = nameField.innerHTML;
  main.changeScreen_main();
  ipc.send('set-goal', goal);
  ipc.send('set-name', name);
  ipc.send('set-color', colorPicker.value );
  ipc.send('set-maincolor', colorPickerMain.value );
  ipc.send('set-bgimg', colorPickerMain.value );
},false)

btnReset.addEventListener('click', () => {
  
        configuration.saveSettings('Color', '#e78b00'); // reset highlight color
        configuration.saveSettings('ColorMain', '#ffffff'); // reset main color
        configuration.saveSettings('backgroundPath', './imgs/img_3.jpeg'); // reset bg
        reset();
});

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

  holder.ondrop = (e) => {
      e.preventDefault();

      for (let f of e.dataTransfer.files) {
        if(f.type.includes('image')){
            path = f.path;
            body.setAttribute("style", "--depth-color: " + colorPicker.value + "; --main-color: " + colorPickerMain.value + "; --background-img: url('" + path + "');")
            configuration.saveSettings('backgroundPath', path);
        }

      }
      
      return false;
  };

