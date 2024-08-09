let clickCount = 0;
let saveTimeout = null;

// Initialize or retrieve click count from storage
chrome.storage.sync.get('clicks', function(result) {
  if (!chrome.runtime.lastError && result.clicks !== undefined) {
    clickCount = result.clicks;
  }
});

// Send onStartup current clickCount message to content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.getClickCount) {
    sendResponse({ clickCount: clickCount});
  }
});

// Listen for clicks
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

// This function will be called to change the cursor on a specific tab
function changeCursor(tabId) {
  const cursorUrl = "cursors/cursor1.png";

  function trySendMessage(retries) {
    if (retries <= 0) {
      console.error('Failed to send message after multiple attempts');
      return;
    }
    chrome.tabs.sendMessage(tabId, { type: 'changeCursor', value: cursorUrl }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('Error changing cursor:', chrome.runtime.lastError.message);
        // Retry sending the message after a short delay
        setTimeout(() => trySendMessage(retries - 1), 1000);
      } else if (response && response.status === 'success') {
        console.log('Cursor changed successfully');
      }
    });
  }

  // Try to send the message with 3 retries
  trySendMessage(3);
}

// Listen for tab updates and apply the cursor when a page finishes loading
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    changeCursor(tabId);
  }
});

// Optionally, you can also listen for newly created tabs and apply the cursor
chrome.tabs.onCreated.addListener((tab) => {
  changeCursor(tab.id);
});

// TO DO: When click count reaches *number* change cursor to that cursorURL.