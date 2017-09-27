// This script is added inside Netflix pages.
//
// It sends a message every second to the background script to let it know
// whether we are currently playing or not.

setInterval(function() {
  var pauseButton = document.querySelector(".button-nfplayerPause");
  if (pauseButton) {
    chrome.runtime.sendMessage(chromeExtensionId, {
      playing: true
    });
  } else {
    chrome.runtime.sendMessage(chromeExtensionId, {
      playing: false
    });
  }
}, 1000);
