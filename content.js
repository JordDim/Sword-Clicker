
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'changeCursor') {
    let selectedValue = message.value;
    if (selectedValue.includes('.png')) {
      let cursorUrl = chrome.runtime.getURL(selectedValue);
      document.body.style.cursor = `url('${cursorUrl}'), auto`;
    } else {
      document.body.style.cursor = selectedValue;
    }
    sendResponse({ status: 'success' });
  }
});


  

