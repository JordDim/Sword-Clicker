// Listens for clicks and sends to background 
document.addEventListener('click', function() {
  if (document && document.body) {
    chrome.runtime.sendMessage({ type: 'incrementClick' }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError.message);
      } else {
        console.log('Click sent successfully.');
      }
    });
  }
});

// Loads a cursor on all webpages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'changeCursor') {
    const cursorUrl = chrome.runtime.getURL(message.value);
    
    if (chrome.runtime.lastError) {
      console.error('Error getting cursor URL:', chrome.runtime.lastError.message);
      sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
      return;
    }

    document.body.style.cursor = `url('${cursorUrl}'), auto`;
    sendResponse({ status: 'success' });
  }
});