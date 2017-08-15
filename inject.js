// This script injects the separate "injected.js" script inside Netflix pages.

chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      var extensionIdScript = document.createElement("script");
      extensionIdScript.textContent =
        "const chromeExtensionId = " + JSON.stringify(chrome.runtime.id);
      (document.head || document.documentElement)
        .appendChild(extensionIdScript);
      var injectedScript = document.createElement("script");
      injectedScript.src = chrome.extension.getURL("injected.js");
      injectedScript.onload = function() {
        this.remove();
      };
      (document.head || document.documentElement).appendChild(injectedScript);
    }
  }, 10);
});
