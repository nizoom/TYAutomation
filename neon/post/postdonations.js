import fetch from 'node-fetch';
import 'dotenv/config';
import createNeonDonationObj from '../prep/createdonationobj.js'

async function loopThroughDonationsToUpdate(donations){

    const username = process.env.NEON_USERNAME

    const password = process.env.NEON_API_KEY

    const base64encodedData = Buffer.from(username + ':' + password).toString('base64')

    // console.log(typeof donations)



    const postedDonations = donations.map(async (donation) => {
        setTimeout(() => {
          console.log("Delayed for 1 second.");
          }, 1000)
        
        console.log(donation)
        
        const donationForPosting = createNeonDonationObj(donation)

        const postedDonation = await postDonationToNeon(donationForPosting)
        
        return postedDonation;

      
    })

  
    const allPostedDonations = await Promise.all(postedDonations)

    console.log(allPostedDonations)

  async function postDonationToNeon(donationForPosting){

    const url = 'https://api.neoncrm.com/v2/donations'


     const result = await fetch(url, {
        method : 'POST',
        headers : {
            'Authorization' : 'Basic ' + base64encodedData,
            'Content-Type': 'application/json'
          
        },

        body : JSON.stringify(donationForPosting)

      }).then(response => response.json())
      .then(data => {
        //in case one fails the accountID will be saved so we can see which one failed
        data.accountID = donationForPosting.accountId;
        return data
      })
      
      return result;

    }
}


export default loopThroughDonationsToUpdate;


 //  if(donations.indexOf(donation) === 0 || donations.indexOf(donation) === 1){
      //    console.log(donation)
      //  }