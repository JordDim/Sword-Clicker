let clickCount = 0;
let saveTimeout = null;

// Initialize or retrieve click count from storage
chrome.storage.sync.get('clicks', function(result) {
  if (!chrome.runtime.lastError && result.clicks !== undefined) {
    clickCount = result.clicks;
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'incrementClick') {
    incrementClickCount();
    sendResponse({ status: 'success' });
  }
});

function incrementClickCount() {
  clickCount++;
  debounceSaveClickCount();
}

function debounceSaveClickCount() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  // Save click count after a delay to minimize frequent writes
  saveTimeout = setTimeout(() => {
    chrome.storage.sync.set({ 'clicks': clickCount }, function() {
      if (chrome.runtime.lastError) {
        console.error('Error saving click count:', chrome.runtime.lastError.message);
      } else {
        console.log('Click count saved successfully');
      }
    });
  }, 5000); // Save every 5 seconds
}

console.log(clickCount);