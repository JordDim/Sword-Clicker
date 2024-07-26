let clickCount = 0;
let saveTimeout = null;

chrome.runtime.onStartup.addListener(onStartup);

function onStartup(){

  if(!chrome.runtime.lastError){
    console.log('onstartup loaded correctly');

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

    setTimeout(() => {
      console.log('This message is logged after a 5-second delay.');
    }, 5000); // 5000 milliseconds = 5 seconds
  }

  console.error('Error loading:', chrome.runtime.lastError.message);

}


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
  }, 2000); // Save every 5 seconds
}
