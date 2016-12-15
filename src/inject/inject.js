// This script injects the separate "injected.js" script inside Netflix pages.

chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      var injectedScript = document.createElement('script');
      injectedScript.src = chrome.extension.getURL('src/inject/injected.js');
      injectedScript.onload = function() {
        this.remove();
      };
      (document.head || document.documentElement).appendChild(injectedScript);
    }
  }, 10);
});
