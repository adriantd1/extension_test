// background.js
chrome.runtime.onMessage.addListener(
    function(request, sender, callback) {
      if(request.message == "getRating"){
        console.log("Sending xhr request");
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            callback(xhr.responseText);
        };
        xhr.onerror = function() {
            callback();
        };

        xhr.open('GET', request.url, true);
        xhr.send();
        return true; // prevents the callback from being called too early on return
      } else if(request.message == "actualPage"){
        console.log("Actual Page: " + request.url);
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            callback(xhr.responseText);
        };
        xhr.onerror = function() {
            callback();
        };

        xhr.open('GET', request.url, true);
        xhr.send();
        return true; // prevents the callback from being called too early on return
      }
  }
);
