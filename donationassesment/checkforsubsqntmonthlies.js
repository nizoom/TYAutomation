import donorPlanStatus from '../querydonorplan.js'

import moment from 'moment'

async function checkForSubsequentMonthlies(donations, currentTime){
    // console.log('BURP');
    // console.log(donations);

    let filteredDonations = [];


    await Promise.all(donations.map(async donation => {
        //query donation donation is from a scheduled plan then 
        // console.log(donation.donorID)
        const index = donations.indexOf(donation)
        setTimeout(async function(){
        
  
    
        const planCheck = await donorPlanStatus(donation.donorID)
        console.log('plan Checked ' + index)
       
        // console.log(planCheck)
        
        if(planCheck.length > 0){ //comes from a monthly donor 

            // console.log(planCheck.length);

            const startDate = moment(planCheck[0].started_at).format("MMMM Do YYYY") //convert YYYY-MM-DD to reading format Month, Day Y

            const scheduledDonationDay = parseInt(planCheck[0].started_at.substring(8), 10) // isolate the day of the month 

            const indexOfComma = donation.donationDate.indexOf(',')

            const donationDateDay = parseInt(donation.donationDate.substring(4, indexOfComma), 10)    // day of this specific donation 

            const formattedCurrentTime = moment(currentTime).format("MMMM Do YYYY") // make startDate and formattedCurrentTime the same format so they can be compared below
           
            // console.log(startDate);
            // console.log(formattedCurrentTime);
            
            // console.log('BREAK');
            if(startDate === formattedCurrentTime){  // RC wants a monthly donation email only to send once (on the first day they start giving)
                
                console.log('monthly donation');

                donation.templateName = 'monthly' //this is the only scheduling frequency available from donor box at the moment 

                donation.startDate = startDate;

                filteredDonations.push(donation)

            } else {
                // from a monthly donor but a subsequent donation from the first
            }
        } else {
            // a one off donation - not from a monthly donation 
            filteredDonations.push(donation)
         }
        }, 2000 * index)
    }))
  
    return filteredDonations
}

export default checkForSubsequentMonthlies;