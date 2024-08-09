document.addEventListener('DOMContentLoaded', function() {
  updateClickCountUI();
});

function updateClickCountUI() {
  chrome.storage.sync.get('clicks', function(result) {
    if (!chrome.runtime.lastError && result.clicks !== undefined) {
      document.getElementById('clickCount').textContent = result.clicks;
    }
  });
}


