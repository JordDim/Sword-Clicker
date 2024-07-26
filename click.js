document.addEventListener('click', function() {
    chrome.runtime.sendMessage({ type: 'incrementClick' });
});
