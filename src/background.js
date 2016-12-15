// Background script that listens for messages coming from injected.js and
// updates the watch time in the badge.

var today = new Date();
today.setHours(0, 0, 0, 0);
var todayKey = today.toString();
console.log(todayKey);
var timeElapsedSeconds;
chrome.storage.sync.get('seconds_per_date', function(value) {
	var secondsPerDate = value['seconds_per_date'] || {};
  timeElapsedSeconds = secondsPerDate[todayKey] || 0;
  console.log("Initial spent time for today: " + timeElapsedSeconds);
	chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
		if (request.playing !== null) {
			if (request.playing) {
				timeElapsedSeconds++;
        secondsPerDate[todayKey] = timeElapsedSeconds;
        var minutes = parseInt(timeElapsedSeconds / 60);
        chrome.browserAction.setBadgeText({
          text: '' + minutes
        });
        chrome.browserAction.setBadgeBackgroundColor({
          color: '#E33'
        });
				chrome.storage.sync.set({'seconds_per_date': secondsPerDate}, null);
				console.log("Spent time: " + timeElapsedSeconds);
			}
		}
	});
});
