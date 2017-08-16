// Background script that listens for messages coming from injected.js and
// updates the watch time in the badge.

// Allow watching a maximum of 90 minutes of Netflix during the monitored
// period.
const MAX_MINUTES_OF_NETFLIX_PER_DAY = 90;
// Allow watching Netflix from 12pm. Before that, it will close itself
// immediately.
const NETFLIX_ALLOWED_START_HOUR = 12;
// Allow watching MAX_MINUTES_OF_NETFLIX_PER_DAY until 10pm. After that, it
// will close itself immediately.
const NETFLIX_ALLOWED_STOP_HOUR = 22;

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
      chrome.storage.local.set({ seconds_per_date: secondsPerDate }, null);
      console.log("Spent time: " + secondsPerDate[todayKey]);

      var now = new Date();
      var minTime = new Date();
      minTime.setHours(NETFLIX_ALLOWED_START_HOUR, 0, 0, 0);
      var maxTime = new Date();
      maxTime.setHours(NETFLIX_ALLOWED_STOP_HOUR, 0, 0, 0);
      var timeRatio =
        (now.getTime() - minTime.getTime()) /
        (maxTime.getTime() - minTime.getTime());
      var watchRatio = minutes / MAX_MINUTES_OF_NETFLIX_PER_DAY;
      console.log("Time ratio: " + timeRatio);
      console.log("Watch ratio: " + watchRatio);
      if (watchRatio > timeRatio || watchRatio > 1) {
        chrome.tabs.remove(sender.tab.id);
      } else {
        chrome.browserAction.setBadgeText({
          text: `${Math.round(watchRatio / timeRatio * 100)}%`
        });
        chrome.browserAction.setBadgeBackgroundColor({
          color: "#E33"
        });
      }
    }
  }
}
