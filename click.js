// click.js

document.addEventListener('click', function() {
    // Send a message to the background script to increment the click count
    chrome.runtime.sendMessage({ type: 'incrementClick' });
  });
  