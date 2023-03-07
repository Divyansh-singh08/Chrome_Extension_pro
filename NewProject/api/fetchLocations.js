const LOCATION_ENDPOINT =
	"https://ttp.cbp.dhs.gov/schedulerapi/locations/?temporary=false&inviteOnly=false&operational=true&serviceName=Global+Entry";

export const fetchLocations = () => {
	fetch(LOCATION_ENDPOINT)
		.then((response) => response.json())
		// console.log(response);
		.then((data) => {
			//now filter the data what we only need we use that only
			const filteredLocation = data.map((loc) => ({
				id: loc.id,
				name: loc.name,
				shortName: loc.shortName,
				tzData: loc.tzData,
			}));
			//this is for follow alphabetical method in form
			filteredLocation.sort((a, b) => a.name.localeCompare(b.name));
			//now save the data
			chrome.storage.local.set({ locations: filteredLocation });
			// console.log(filteredLocation);
			// console.log(data);
		})
		.catch((error) => {
			console.log(error);
		});
};
