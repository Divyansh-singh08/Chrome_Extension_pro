//now import the api file
import { fetchLocations } from "./api/fetchLocations.js";
import { fetchOpenSlots } from "./api/fetchOpenSlots.js";
import { createNotification } from "./lib/createNotification.js";

//creating the interval job that run in the background
const ALARM_JOB_NAME = "DROP_ALARM";

//do it in more optimize
let cachedPrefs = {}; //create a object to pass
let firstApptTimestamp = null;

// Fired when the extension is first installed,
// when the extension is updated to a new version,
// and when Chrome is updated to a new version
chrome.runtime.onInstalled.addListener((details) => {
	handleOnStop();
	// console.log("onInstalled reason: ", details.reason);
	fetchLocations();
});

//create a message listener
//this is done by chrome API

// let data = {
//     "event" : "onStop/onStart",
//     "prefs": {
//         "locationId": '123',
//         "startDate": "2023-02-02",
//         "endDate": "2023-03-03",

//     }
// }

chrome.runtime.onMessage.addListener((data) => {
	//we send from popup.js file to background.js file
	// switch(data.event){
	//     case 'onStop':
	//         console.log("On stop in background");
	//         break;
	//     case 'onStart':
	//         console.log("On start in background");
	//         console.log("prefs is Received: ",data.prefs);

	//         break;
	//     default:
	//         break;
	// }
	//to make clear code writ e like this
	const { event, prefs } = data;
	switch (event) {
		case "onStop":
			handleOnStop();
			break;
		case "onStart":
			handleOnStart(prefs);
			break;
		default:
			break;
	}
});

//this is listing to the API
chrome.notifications.onClicked.addListener(() => {
	//send the user to the url with differ tab
	//so we use chrome API
	chrome.tabs.create({
		url: "https://ttp.cbp.dhs.gov/schedulerui/schedule-interview/location?lang=en&vo=true&returnUrl=ttp-external&service=up",
	});
});

//chrome API that call alarm by chrome API method....
chrome.alarms.onAlarm.addListener(() => {
	console.log("onAlarm scheduled code is running....");
	openSlotsJob();
});

//handling the onStop/onStart event
const handleOnStop = () => {
	console.log("On stop in background");
	setRunningStatus(false); //this will show Running status not working
	stopAlarm();
	cachedPrefs = {}; //this will clear when our alarm over
	firstApptTimestamp = null;
};

const handleOnStart = (prefs) => {
	// console.log("On start in background");
	console.log("prefs is Received: ", prefs);
	cachedPrefs = prefs; //save this in local
	//now storing the prefs that we received in the background file through the popup.js
	//for that use another Chrome API call storage in local data
	chrome.storage.local.set(prefs); //we can pull the data when we need it from the local storage
	setRunningStatus(true); //this will show Running status working
	createAlarm();
};

const setRunningStatus = (isRunning) => {
	chrome.storage.local.set({ isRunning });
};

//creating the interval job that run in the background
// const ALARM_JOB_NAME = "DROP_ALARM"
//alarm start in background here when the user hit the handleOnStart button
const createAlarm = () => {
	//first we check is alarm is exit's or not
	//for checking here also we use chrome api method
	chrome.alarms.get(ALARM_JOB_NAME, (existingAlarm) => {
		if (!existingAlarm) {
			//run immediately the job
			openSlotsJob();
			chrome.alarms.create(ALARM_JOB_NAME, { periodInMinutes: 1.0 });
		}
	});
};

//to stop the  alarm now we need to handle for this case to
const stopAlarm = () => {
	chrome.alarms.clearAll();
};

const openSlotsJob = () => {
	fetchOpenSlots(cachedPrefs).then((data) => handleOpenSlots(data));
};

const handleOpenSlots = (openSlots) => {
	if (
		openSlots &&
		openSlots.length > 0 &&
		openSlots[0].timestamp != firstApptTimestamp
	) {
		firstApptTimestamp = openSlots[0].timestamp;
		//create a notifications
		createNotification(openSlots[0], openSlots.length, cachedPrefs);
	}
};
