// This script is added inside Netflix pages.
//
// It sends a message every second to the background script to let it know
// whether we are currently playing or not.

setInterval(function() {
  var playPauseButton = document.querySelector(".player-play-pause");
  if (playPauseButton) {
    var playing = playPauseButton.classList.contains("pause");
    chrome.runtime.sendMessage(chromeExtensionId, {
      playing: playing
    });
  }
}, 1000);
