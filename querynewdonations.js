

import fetch from 'node-fetch';

import "dotenv/config.js";





async function initDonationSearch(todaysDate){

    //this function fetches donations for today 

    const key = process.env.DONORBOX_KEY;
    const username = process.env.DONORBOX_USERNAME;



    //${yesterday}&date_to=${today} remember date_to includes everything until thay day 
    //2021-12-07&date_to=
    //2021-12-24&date_to=
    async function getTodaysDonations(yesterday){

        
       //having today be the day BEFORE current day gives donations from current day
        try {
            const result = await fetch (`https://donorbox.org/api/v1/donations?date_from=${yesterday}`, { //double check to see if this is actually picking up new donations from today
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${username}:${key}`).toString('base64'),
                    'X-Result-Count': 100000000
                }


            }).then( response => response.json())
            // console.log(result)
            return result;
        
        } catch (error) {
            console.log('ERROR')
            console.log(error)
        }
        return
        

        
    }

    const todaysDonations = await getTodaysDonations(todaysDate)

  
    return todaysDonations

     
    
}

export default initDonationSearch;



 