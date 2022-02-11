import "dotenv/config.js";

import fetch from 'node-fetch';

async function determineDonorFrequency(donation){
    //assess donation to determine if it is new donor, recurring donor, or in honor donor 

    const key = process.env.DONORBOX_KEY;
    const username = process.env.DONORBOX_USERNAME;


    const donorID = donation.donor.id;

    
    const donorInfo = await searchForDonorById(donorID)
  
    //drill down on donorInfo to get donations count from that donor
    const newDonorStatus = donorInfo.donations_count > 1 ? false : true; 

    async function searchForDonorById(id){
    
        try{
            const donorInfo = await fetch(`https://donorbox.org/api/v1/donors?id=${id}`, { 
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${username}:${key}`).toString('base64'),
                'X-Result-Count': 100000000
                }

            })
                .then(response => response.json())
                // .then(response => console.log(response))
                return donorInfo[0];
        }
        catch(error){
            JSON.parse("There was an error processing your request.")
            console.log(error.message)
        }
       
        return 
    }



    return newDonorStatus
}

export default determineDonorFrequency

// you probably can have new donor and honor donor so honor donor should trump new donor 

