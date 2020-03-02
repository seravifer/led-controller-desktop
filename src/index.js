const { ipcRenderer } = require('electron')
const iro = require('@jaames/iro');

const switchButton = document.getElementById('switch');
var colorPicker = new iro.ColorPicker('#color-picker', {
  borderColor: '#ffffff',
  borderWidth: 2
});

if (!window.localStorage.getItem('value')) {
  window.localStorage.setItem('value', JSON.stringify(colorPicker.color.rgb))
}

if (!window.localStorage.getItem('switch')) {
  window.localStorage.setItem('switch', 'off')
}

colorPicker.color.rgb = JSON.parse(window.localStorage.getItem('value'));
switchButton.checked = window.localStorage.getItem('switch') == 'on' ? true : false;
if (switchButton.checked) {
  setTimeout(() => ipcRenderer.send('value', colorPicker.color.rgb), 2000);
}
 
colorPicker.on('input:change', throttled(200, (color) => {
  if (!switchButton.checked) return;
  ipcRenderer.send('value', color.rgb);
  window.localStorage.setItem('value', JSON.stringify(colorPicker.color.rgb))
}));

switchButton.value = false;
switchButton.addEventListener('change', () => {
  if (switchButton.checked) {
    ipcRenderer.send('value', colorPicker.color.rgb);
    window.localStorage.setItem('switch', 'on')
  } else {
    ipcRenderer.send('value', { r: 0, g: 0, b: 0 });
    window.localStorage.setItem('switch', 'off')
  }
})


function throttled(delay, fn) {
  let lastCall = 0;
  return function (...args) {
    const now = (new Date).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}