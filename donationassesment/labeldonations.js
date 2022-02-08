import donorPlanStatus from '../querydonorplan.js'

async function labelDonations(donoationsToBeCategorized, currentTime){

    //this function is to label the type of each donation through the name of its template file 

    //then add these pieces of data to the object in an accessible way 

    // there will be 4 option for template file names: 'newdonor', 'recurringdonor', 'honorer', 'honoree'
    

    // console.log(donoationsToBeCategorized.length)



    const labelledDonations = await Promise.all(donoationsToBeCategorized.map(async donation => {
        
        //newdonor donation would have have newDonorStatus = true and honorStatus = false
        if(donation.newDonorStatus === true && donation.honorStatus === false){

            donation.templateName = 'newdonor'

            return donation;

        }
        
        //recurringdonor donation would have newDonorStatus = false and honorStatus = false

        if(donation.newDonorStatus === false && donation.honorStatus === false){
            //query donation donation is from a scheduled plan then 

            const planCheck = await donorPlanStatus(donation.donorID)

            if(planCheck.length < 1){

                //not from a donation plan and is a regular donor than has donated more than once 
                donation.templateName = 'recurringdonor'

                return donation;
            } else {
                // if donation is from a scheduled plan then add then template name 

                //if scheduled day of the month is same as as todays day of the month then it is part of the monthly plan . Otherwise it is possible they donated on a different day and not through their monthly donation

                const scheduledDonationDay = parseInt(planCheck[0].started_at.substring(8), 10) // isolate the day of the month 

                if(scheduledDonationDay === currentTime.getDate()){ 

                    donation.templateName = 'monthly' //this is the only scheduling frequency available from donor box at the moment 

                    donation.startDate = planCheck[0].started_at

                    return donation

                } 

                // else it is just a coincidence and they are donating in addition to their scheduled donation 
                donation.templateName = 'recurringdonor'

                return donation;
           
            }
           
        }

          //honoree obj would have the property honoreeName 

          if(donation.hasOwnProperty('honoreeName')){
            
            donation.templateName = 'honoree'
            
            return donation
        }

        //honorer donation would have honorStatus = an obj and not false (which is a boolean value and not an obj)

        if(typeof(donation.honorStatus === 'object')){

            donation.templateName = 'honorer'

            return donation;

        }

      

      
    }))

    return labelledDonations;
}


export default labelDonations




// categorizeDonations(donoationsToBeCategorized)