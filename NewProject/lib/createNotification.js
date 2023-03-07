
// export const handleNotification = (activeAppointments)=>{
//     if(activeAppointments.length > 0){
//         createNotification(activeAppointments[0])
//     }
    
// }

export const createNotification = (openSlot,numberOfSlots,prefs)=>{
    const {tzData} = prefs;

    let message =`Found an open interview at  ${openSlot.timestamp} (${tzData} timezone)`;
    if( numberOfSlots > 1){
        message =`${message} and ${numberOfSlots - 1} additional open interview`;
    }
    // console.log("notification",activeAppointments);
    chrome.notifications.create({
        //pass the notification 
        title:"form filler Job",
        message,
        iconUrl:"./image/doc.png",
        type:"basic"
    })
}
// //this is listing to the API
// chrome.notifications.onClicked.addListener(()=>{
//     //send the user to the url with differ tab
//     //so we use chrome API
//     chrome.tabs.create({url:"https://ttp.cbp.dhs.gov/schedulerui/schedule-interview/location?lang=en&vo=true&returnUrl=ttp-external&service=up"})
// })