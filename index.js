document.addEventListener('DOMContentLoaded', function() {
  updateClickCountUI();
  changeCursor();
});

function updateClickCountUI() {
  chrome.storage.sync.get('clicks', function(result) {
    if (!chrome.runtime.lastError && result.clicks !== undefined) {
      document.getElementById('clickCount').textContent = result.clicks;
    }
  });
}

function changeCursor(){
  const cursorSelect = document.getElementById('cursor');

  cursorSelect.addEventListener('change', function() {
    var selectedValue = cursorSelect.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'changeCursor', value: selectedValue }, function(response) {
        if (response.status === 'success') {
          console.log('Cursor changed successfully');
        }
      });
    });
  });
}


