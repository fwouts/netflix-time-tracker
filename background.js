// Background script that listens for messages coming from injected.js and
// updates the watch time in the badge.

var todayKey;
var secondsPerDate = {};

function refreshTodayKey() {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  todayKey = today.toString();
}
// Refresh the current date once a minute + on initialization.
setInterval(refreshTodayKey, 60 * 1000);
refreshTodayKey();

chrome.runtime.onMessageExternal.addListener(onMessageReceived);
chrome.storage.local.get("seconds_per_date", function(value) {
  secondsPerDate = value["seconds_per_date"] || {};
  var timeElapsedSeconds = secondsPerDate[todayKey] || 0;
  console.log("Initial spent time for today: " + timeElapsedSeconds);
});

function onMessageReceived(request, sender, sendResponse) {
  if (request.playing !== null) {
    if (request.playing) {
      secondsPerDate[todayKey] = (secondsPerDate[todayKey] || 0) + 1;
      var minutes = parseInt(secondsPerDate[todayKey] / 60);
      chrome.browserAction.setBadgeText({
        text: "" + minutes
      });
      chrome.browserAction.setBadgeBackgroundColor({
        color: "#E33"
      });
      chrome.storage.local.set({ seconds_per_date: secondsPerDate }, null);
      console.log("Spent time: " + secondsPerDate[todayKey]);
    }
  }
}
