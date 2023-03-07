// this the file from where out metadata of our extension is picked by the browser and perform according to it.. 

let color = 'red';

chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.sync.set({color});
});