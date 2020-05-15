const { ipcRenderer } = require('electron')
const iro = require('@jaames/iro');

const switchButton = document.getElementById('switch');
var colorPicker = new iro.ColorPicker('#color-picker', {
  borderColor: '#ffffff',
  borderWidth: 2
});

if (!window.localStorage.getItem('state')) {
  window.localStorage.setItem('state', JSON.stringify(colorPicker.color.rgb))
}

if (!window.localStorage.getItem('power')) {
  window.localStorage.setItem('power', false)
}

colorPicker.color.rgb = JSON.parse(window.localStorage.getItem('state'));
switchButton.checked = window.localStorage.getItem('power');

if (switchButton.checked) {
  ipcRenderer.on('connected', () => {
    ipcRenderer.send('change-color', colorPicker.color.rgb);
  });
}

colorPicker.on('input:change', throttled(100, (color) => {
  if (!switchButton.checked) return;
  ipcRenderer.send('change', color.rgb);
  window.localStorage.setItem('state', JSON.stringify(colorPicker.color.rgb));
}));

switchButton.value = false;
switchButton.addEventListener('change', () => {
  ipcRenderer.send('power', switchButton.checked);
  window.localStorage.setItem('power', switchButton.checked)

})


/**
 * Helpers
 */
function throttled(delay, fn) {
  let lastCall = 0;
  return function (...args) {
    const now = (new Date).getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  }
}
