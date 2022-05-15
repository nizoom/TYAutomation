import dotenv from 'dotenv';
import path from 'path'
dotenv.config({path: '../.env'})
import fetch from 'node-fetch';

import getNeonCountrCodes from '../get/countrycodes.js';




async function createNeonAccount (donation) {

    const username = process.env.NEON_USERNAME

    const password = process.env.NEON_API_KEY
  
    const base64encodedData = Buffer.from(username + ':' + password).toString('base64')

    const neonCountryCode = await getNeonCountrCodes(donation.alpha2CountryCode)

    const url = 'https://api.neoncrm.com/v2/accounts'

  

    const [firstName, lastName] = getFirstandLastName()

    function getFirstandLastName (){
      const fullName = donation.donorName;
      const indexOfSpace = fullName.indexOf(" ");
      const firstName = fullName.substring(0, indexOfSpace);
      const lastName = fullName.substring(indexOfSpace+1);
      return [firstName, lastName]
    }

    // const jsonBody = donations.map(donation => {
        
   
        const newAccountObj = {
        
            individualAccount : {
                primaryContact : {
                    email1: donation.email,
                    firstName:  firstName,
                    lastName : lastName,
                    addresses : [
                        
                        {
                        "isPrimaryAddress": true,
                        "addressLine1": donation.address,
                        "city":  donation.city,
                        "phone1" : donation.phone,
                        "zipCode" : donation.zip,
                        "country": {
                        "id": neonCountryCode
                        
                        },
            
                        },
                    ],
                
                },
            },
        }

//    console.log(newAccountObj)

 
  const createdAccountID = await fetch(url, {
        method : 'POST',
        headers : {
            'Authorization' : 'Basic ' + base64encodedData,
            'Content-Type': 'application/json'
        
        },

        body : JSON.stringify(newAccountObj)

    }).then(response => response.json())
    // .then(response => console.log(response))
    .then(data => {return data})
 

    donation.neonAccountID = createdAccountID; //should replicate structure of those already with ID 

    return donation
    

    // add some error handling logic
  
  

}



export default createNeonAccount

