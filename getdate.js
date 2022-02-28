async function getDateandTime(){
 
    let currentTimeAndYesterdaysDate = getCurrentTimeAndYesterdaysDate()
    
    function getCurrentTimeAndYesterdaysDate (){
   
       let tzoffset = (new Date()).getTimezoneOffset() * 60000;

       const date = new Date();



       const yesterdayMilliseconds = date.setDate(date.getDate() - 1)

       const yesterday = new Date(yesterdayMilliseconds - tzoffset); //converts to EST 



       const currentTimeGMT = new Date();

       const offset = -300

       const currentTimeEST = new Date(currentTimeGMT.getTime() + offset*60*1000)

       const tomorrow = getTomorrowsDate(tzoffset);
    

       
       return [currentTimeEST, yesterday, tomorrow]
    }
    

    return currentTimeAndYesterdaysDate

}

function getTomorrowsDate(offset){
    const tomorrowsDate = new Date((new Date().getTime() - offset) + 24 * 60 * 60 * 1000);
    return tomorrowsDate
}


export default getDateandTime;

// getDateandTime();