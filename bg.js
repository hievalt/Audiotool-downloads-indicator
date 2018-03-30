chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.url != undefined && changeInfo.url.includes('https://www.audiotool.com/track/')) {
		console.log('Tab %d got new track URL: %s', tabId, changeInfo.url);
		chrome.tabs.sendMessage(tabId, {
			greeting: 'trackPage'
		});
	} else if (changeInfo.url != undefined && changeInfo.url.includes('https://www.audiotool.com/user/')) {
		console.log('Tab %d got new user URL: %s', tabId, changeInfo.url);
		chrome.tabs.sendMessage(tabId, {
			greeting: 'userPage'
		});
	}
});