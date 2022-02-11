import donorPlanStatus from '../querydonorplan.js'

import moment from 'moment'

async function checkForSubsequentMonthlies(donations, currentTime){
   

    //slows down api querying so that it doesn't get jammed / too many queries
    function timeout(ms){
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const result =  await asyncForEach(donations, determineMonthlyDonationStatus)
    
    
    async function asyncForEach(arrOfDonations, callback){

        let filteredDonations = [];

        for(let index = 0; index < arrOfDonations.length ; index++){

                const processedDonation = await callback(arrOfDonations[index])

                if(processedDonation !== undefined){ // undefined monthly donations are ones that came after the first -> so they are ignored 

                    filteredDonations.push(processedDonation)

                }

                timeout(1000 * index)
  
        }
    
        return filteredDonations;
    }


    
    async function determineMonthlyDonationStatus(donation){

        const planCheck = await donorPlanStatus(donation.donorID)
      
        
        if(planCheck.length > 0){ //comes from a monthly donor 

            // console.log(planCheck.length);

            const startDate = moment(planCheck[0].started_at).format("MMMM Do YYYY") //convert YYYY-MM-DD to reading format Month, Day Y

            // const scheduledDonationDay = parseInt(planCheck[0].started_at.substring(8), 10) // isolate the day of the month 

            const indexOfComma = donation.donationDate.indexOf(',')

            // const donationDateDay = parseInt(donation.donationDate.substring(4, indexOfComma), 10)    // day of this specific donation 

            const formattedCurrentTime = moment(currentTime).format("MMMM Do YYYY") // make startDate and formattedCurrentTime the same format so they can be compared below
           
    
            if(startDate === formattedCurrentTime){  // RC wants a monthly donation email only to send once (on the first day they start giving)
                
                console.log('monthly donation');

                donation.templateName = 'monthly' //this is the only scheduling frequency available from donor box at the moment 

                donation.startDate = startDate;

                return donation

            } else {
                // from a monthly donor but a subsequent donation from the first -> returns undefined
            }
        } else {
            // a one off donation - not from a monthly donation 
            return donation
         }
        
    }
  
   return result
}

export default checkForSubsequentMonthlies;