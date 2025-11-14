/// <reference types="chrome"/>

chrome.devtools.panels.create(
  'React Performance Monitor',
  '',
  'panel.html',
  () => {
    console.log('Panel created');
  }
);