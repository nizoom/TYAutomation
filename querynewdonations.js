

import fetch from 'node-fetch';

import "dotenv/config.js";





async function initDonationSearch(todaysDate){

    //this function fetches donations for today 

    const key = process.env.DONORBOX_KEY;
    const username = process.env.DONORBOX_USERNAME;



    //${yesterday}&date_to=${today} remember date_to includes everything until thay day 
    //2021-12-07&date_to=
    //2021-12-24&date_to=
    async function getTodaysDonations(today){

       
        try {
            const result = await fetch (`https://donorbox.org/api/v1/donations?date_from=2021-12-24&date_to=${today}`, { 
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${username}:${key}`).toString('base64'),
                    'X-Result-Count': 100000000
                }


            }).then( response => response.json())
            //.then(formattedresult => console.log('line 53' + formattedresult))
            //.then(formattedresult => {return formattedresult})
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



 