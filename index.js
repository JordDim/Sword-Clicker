// index.js

document.addEventListener('DOMContentLoaded', function() {
    // Update UI with current click count
    updateClickCountUI();
  });
  
  function updateClickCountUI() {
    chrome.storage.sync.get('clicks', function(result) {
      if (!chrome.runtime.lastError && result.clicks !== undefined) {
        document.getElementById('clickCount').textContent = result.clicks;
      }
    });
  }
  