async function getDateandTime(){
 
    let dateAndDate = getTodaysDate()
    
    // console.log(todaysDate)
    
    function getTodaysDate (){
   
  
        let tzoffset = (new Date()).getTimezoneOffset() * 60000;

        
        const date = new Date(Date.now() - tzoffset ).toISOString() //.split('T')[0]

    
        //go back and get date and current time from the same single query

       // const currentTime = new Date().toTimeString().split(" ")[0];

        const currentTime = new Date()

        return [date, currentTime]
    }
 
    return dateAndDate

}

// getDateandTime();

export default getDateandTime;