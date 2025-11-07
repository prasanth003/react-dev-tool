/// <reference types="chrome"/>

chrome.devtools.panels.create(
  'React Perf Monitor',
  '',
  'panel.html',
  () => {
    console.log('Panel created');
  }
);