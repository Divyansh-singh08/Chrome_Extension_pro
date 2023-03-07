

//all this run on the extension context

const btn = document.querySelector('.btn');


const colorGrids = document.querySelector('.colorGrid');

const colorValue = document.querySelector('.colorValue');


btn.addEventListener('click', async() =>{
    
    chrome.storage.sync.get('color',({color})=>{
        console.log('color: ',color); 
    }); 

    // console.log('click');//working fine  

    // chrome.tabs.query 
    //is a method provided by the Chrome extension API 
    //that allows developers to query information about the tabs currently 
    //open in the user's browser window.

    //A callback function that will be called with the resulting tabs array.


    //let [tab] 
    //is a destructuring assignment syntax in JavaScript 
    //that allows you to extract values from an array or an iterable object
    // and assign them to variables in a single line of code.



    let [tab] = await chrome.tabs.query({active : true, currentWindow : true});

    console.log(tab);


    //chrome.scripting.executeScript() 
    //is a method provided by the Chrome extension API 
    //that allows developers to inject and execute
    // JavaScript code in the context of a webpage.

    //This method takes an object as its parameter,
    // which can contain the following properties

    chrome.scripting.executeScript({
        //target: An object that specifies where to inject the script.
        // It can have one of the following properties:
        //tabId: The ID of the tab where the script should be injected.
        //allFrames: A boolean that indicates whether the script should 
        //be injected into all frames of the tab.

        target: {tabId : tab.id},

        //function: A string that contains the JavaScript
        // code to be executed in the context of the webpage.
        function: pickColor,
    }, async(injectionResult) => {
        // destructure array 
        const [data] =  injectionResult;

        if(data.result){
            const color = data.result.sRGBHex;

            colorGrids.style.backgroundColor = color;

            colorValue.innerText = color;

            try{
                await navigator.clipboard.writeText(color);
            }catch(err){
                console.error(err);
            }

            
        }
        // console.log(injectionResult);
    });
    
    

});


//this will run on the webpage context

async function pickColor(){
    // console.log('script');
    //picker activate
    // In the context of programming, "EyeDropper()" could refer 
    // to a function or method that retrieves the color of a 
    // specific pixel on the screen or within an image.
    const eyeDropper = new EyeDropper();

    // const selectColor = await eyeDropper.open();
    return await eyeDropper.open();

    console.log(selectColor);

    try{

    }catch(err){
        // console.log("this is the error choice");
        console.error(err);
    }
}