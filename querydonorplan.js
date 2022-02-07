import fetch from 'node-fetch';

import "dotenv/config.js";

async function donorPlanStatus(){
    const key = process.env.DONORBOX_KEY;
    const username = process.env.DONORBOX_USERNAME;

    // Use donor_id filter to filter plans by Donorbox donor id. This is the Donorbox generated donor id.

    // e.g. {GET} /api/v1/plans?donor_id=XXXXXXX

    return await getDonorPlanStatus(1148128);
    
    async function getDonorPlanStatus(donorID){

        try {
            const result = await fetch (`https://donorbox.org/api/v1/plans?donor_id=${donorID}`, { 
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

    }
}

donorPlanStatus();

export default donorPlanStatus;