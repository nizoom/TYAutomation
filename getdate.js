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


       const tomorrowMilliseconds = date.setDate(date.getDate() + 1)

       const tomorrow = new Date(tomorrowMilliseconds - tzoffset); //converts to EST 

       return [currentTimeEST, yesterday, tomorrow]
    }
    

    return currentTimeAndYesterdaysDate

}


export default getDateandTime;