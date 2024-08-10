let clickCount = 0;
let saveTimeout = null;
let cursorChanged = false;
let saveCursor = "cursors/cursor0.png";

// Initialize or retrieve click count from storage
chrome.storage.sync.get(['clicks', 'cursor'], function(result) {
  if (!chrome.runtime.lastError) {
    if (result.clicks !== undefined) {
      clickCount = result.clicks;
    }
    if (result.cursor !== undefined) {
      saveCursor = result.cursor;
    }
  }
});

// Send current clickCount message to content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.getClickCount) {
    sendResponse({ clickCount: clickCount});
  }
});

// Listen for clicks and update click count
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'incrementClick') {
    incrementClickCount(sender.tab.id);
    sendResponse({ status: 'success' });
  }
});

function incrementClickCount(tabId) {
  clickCount++;
  debounceSaveClickCount();

  let newCursor = determineCursor(clickCount);
  if (newCursor !== saveCursor) {
    saveCursor = newCursor;
    chrome.storage.sync.set({ 'cursor': saveCursor}, function() {
      if (!chrome.runtime.lastError) {
        console.log(`Cursor changed to ${saveCursor} at ${clickCount} clicks`);
        changeCursor(tabId, saveCursor);
      }
    });
  }
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

// This function determines the right cursor based on the number of clicks
function determineCursor(clicks) {
  if (clicks >= 1000000) {
    return "cursors/cursor1000000.png"; 
  } else if (clicks >= 100000) {
    return "cursors/cursor100000.png"; 
  } else if (clicks >= 10000) {
    return "cursors/cursor10000.png"; 
  } else if (clicks >= 1000) {
    return "cursors/cursor1000.png"; 
  } else if (clicks >= 100) {
    return "cursors/cursor100.png"; 
  } else if (clicks >= 10) {
    return "cursors/cursor10.png"; 
  } else {
    return "cursors/cursor0.png"; 
  }
}

// This function will be called to change the cursor on a specific tab
function changeCursor(tabId, cursorUrl) {
  function trySendMessage(retries) {
    if (retries <= 0) {
      console.error('Failed to load cursor in this tab after multiple attempts');
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
    changeCursor(tabId, saveCursor);
  }
});

// Optionally, you can also listen for newly created tabs and apply the cursor
chrome.tabs.onCreated.addListener((tab) => {
  changeCursor(tab.id, saveCursor);
});