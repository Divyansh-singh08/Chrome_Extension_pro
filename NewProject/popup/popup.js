//Element
const locationIdElement = document.getElementById("locationId");
const startDateElement = document.getElementById("startDate");
const endDateElement = document.getElementById("endDate");

//Button Element
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

//span Listeners
const runningSpan = document.getElementById("runningSpan");
const stoppedSpan = document.getElementById("stoppedSpan");

//Error message
const locationIdError = document.getElementById("locationIdError");
const startDateError = document.getElementById("startDateError");
const endDateError = document.getElementById("endDateError");

//********************* helper method ***********************

//status hide
const hideElement = (elem) => {
	elem.style.display = "none";
};
//status showing
const showElement = (elem) => {
	elem.style.display = "";
};

//button disable/not click-able now
const disableElement = (elem) => {
	elem.disabled = true;
};
//button active/click-able now
const enableElement = (elem) => {
	elem.disabled = false;
};

const showDateError = (dateErrorElem, errorMessage) => {
	dateErrorElem.innerHTML = errorMessage;
	showElement(dateErrorElem);
};

const validateStartDate = (today, startDate) => {
	const isAfterToday = !startDate.isBefore(today, "date");

	if (!startDateElement.value) {
		// showElement(startDateError);//show date error
		showDateError(startDateError, "please enter a valid start date");
	} else if (!isAfterToday) {
		showDateError(startDateError, "start date must not be before today");
	} else {
		hideElement(startDateError); //no date error
	}

	return startDateElement.value && isAfterToday;
};

const validateEndDate = (today, startDate, endDate) => {
	const isAfterStartDate = endDate.isAfter(startDate, "date");
	const isAfterToday = endDate.isAfter(today, "date");

	if (!endDateElement.value) {
		// showElement(endDateError);
		showDateError(endDateError, "please enter a valid endDate");
	} else if (!isAfterStartDate) {
		showDateError(endDateError, "end date must be after the start date");
	} else if (!isAfterToday) {
		showDateError(endDateError, "End date must be after today");
	} else {
		hideElement(endDateError);
	}
	return endDateElement.value && isAfterStartDate && isAfterToday;
};

//validation dates
const validateDates = () => {
	//today <= start date <  end date
	const today = spacetime.now().startOf("day");
	const startDate = spacetime(startDateElement.value).startOf("day");
	const endDate = spacetime(endDateElement.value).startOf("day");

	const isStartDateValid = validateStartDate(today, startDate);
	const isEndDateValid = validateEndDate(today, startDate, endDate);

	//finally return
	return isStartDateValid && isEndDateValid;
};

//when we hit the button then it should change for that we use method
const handleOnStartState = () => {
	//span
	showElement(runningSpan); //show running
	hideElement(stoppedSpan); //hide stop
	//button
	disableElement(startButton); //not-click able button
	enableElement(stopButton); //click able button
	//input
	disableElement(locationIdElement);
	disableElement(startDateElement);
	disableElement(endDateElement);
};

const handleOnStopState = () => {
	//span
	showElement(stoppedSpan); //show stop
	hideElement(runningSpan); //hide running
	//button
	disableElement(stopButton); //not-able to click stop button
	enableElement(startButton); //click able start button
	//input
	enableElement(locationIdElement);
	enableElement(startDateElement);
	enableElement(endDateElement);
};

//before call first check it so another method
const performOnStartValidations = () => {
	const isDateValid = validateDates();

	if (!locationIdElement.value) {
		showElement(locationIdError); //show error in location
	} else {
		hideElement(locationIdError); //no location
	}

	// if(!startDateElement.value){
	//     showElement(startDateError);//show date error
	// }else{
	//     hideElement(startDateError);//no date error
	// }

	// if(!endDateElement.value){
	//     showElement(endDateError);
	// }else{
	//     hideElement(endDateError);
	// }

	//if all became true then....
	// return locationIdElement.value && startDateElement.value && endDateElement.value;//this will  return boolean
	return locationIdElement.value && isDateValid;
};

//onclick event handler
startButton.onclick = () => {
	const allFieldsValid = performOnStartValidations(); //it will give boolean value to it
	if (allFieldsValid) {
		handleOnStartState(); //this will hit....

		//we need to fetch the data from the input and send to the background.js to handle it
		const prefs = {
			locationId: locationIdElement.value,
			startDate: startDateElement.value,
			endDate: endDateElement.value,
			"tz-Data":
				locationIdElement.options[locationIdElement.selectedIndex].getAttribute(
					"data-tz"
				),
		};
		//using chrome API to send our data to the background.js file
		chrome.runtime.sendMessage({ event: "onStart", prefs });
		// if(startDateElement.value){
		//     console.log("start Date Element : ",startDateElement.value);

		// }else{
		//     console.log("OOPS start Date is invalid!!!..");
		// }

		// console.log("you clicked the start button");
		// console.log("start Data: ",startDateElement.value);
		// console.log("LocationId : ",locationIdElement.value);
	}
};

//onclick event handler
stopButton.onclick = () => {
	handleOnStopState(); //this will work first when we hit event

	//chrome API send the data message to the background.js file
	chrome.runtime.sendMessage({ event: "onStop" });

	// console.log("you clicked the stop button");
	// console.log("End Data: ",endDateElement.value);
};

//now storing the prefs that we received in the background file
//so that when we need for that use
//another Chrome API call storage in local data . get() function
//we need array of value
//bcz background.js file is already set the value so,
//we can get it when we need it...
//************************ Save  all Data ************************** */
chrome.storage.local.get(
	["locationId", "startDate", "endDate", "locations", "isRunning"],
	(result) => {
		const { locationId, startDate, endDate, locations, isRunning } = result; //Destructuring array.....

		//call this function
		// console.log(locations);
		setLocations(locations);
		//now set the value of the inputs to the store value
		//when we popup the chrome extension our information will be saved and not vanish
		//for that we use this logic

		if (locationId) {
			locationIdElement.value = locationId;
		}
		if (startDate) {
			startDateElement.value = startDate;
		}
		if (endDate) {
			endDateElement.value = endDate;
		}

		//fetch all the data to the popup.js file
		// console.log(locations);
		// console.log("Running status : ",isRunning);

		if (isRunning) {
			// showElement(runningSpan);
			// hideElement(stoppedSpan);
			handleOnStartState();
		} else {
			// showElement(stoppedSpan);
			// hideElement(runningSpan);
			handleOnStopState();
		}
	}
);

// all location must show in the dropdown box

// {
//     "id":4004,
//     "name":"mumbai",
//     "shortName":"nothing",
//     "tzData":"hell"
// }
//dropdown menu done by this function only
const setLocations = (locations) => {
	locations.forEach((location) => {
		//dynamically create the option for dropdown using this API
		let optionElement = document.createElement("option");
		//this all are the data information are saving
		optionElement.value = location.id;
		optionElement.innerHTML = location.name;
		optionElement.setAttribute("data-tz", location.tzData);
		//now append the data to the location option by doing this
		locationIdElement.appendChild(optionElement);
	});
};

const today = spacetime.now().startOf("day").format();
startDateElement.setAttribute("min", today);
endDateElement.setAttribute("min", today);
