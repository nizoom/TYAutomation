import determineDonorFrequency from './getdonorstatus.js'

// import moment from 'moment'

async function collectDonationInfo(donations){


        

        //we need an array of objects where each object holds the info needed for an email 

        //donor box api does not support fetching  multuple ids in one request so we need to loop / map through all the donations and await the async functions
        //that give us the new donor status and honor status

        const arrOfDonationObjForEmail = await Promise.all(donations.map(async donation => {
     
            const newDonorStatus = await determineDonorFrequency(donation);

            const honorStatus =   donation.hasOwnProperty('honor') ? donation.honor: false;// if there is no honor property then honor status is false

            //convert date to a more email readable format


            //contains a decimal where it may not need one such as 100.0
            const unformattedDonation = donation.amount

            
            //if decimal amount is 0 then delete .0 from string 
            const decimalIndex = unformattedDonation.indexOf('.')

            const decimalAmount = unformattedDonation.substring(decimalIndex)

          
            //else (if has cents then keep it)

            //save a trimmed version of donation amount when need (when there is no cents)
            const donationStr = (decimalAmount !== '.0' )? unformattedDonation : unformattedDonation.substring(0, decimalIndex)

            // console.log(donation.donation_date)

            const emailDataObj = {
                newDonorStatus : newDonorStatus,
                honorStatus : honorStatus,
                firstName : donation.donor.first_name, 
                lastName : donation.donor.last_name,
                TYToEmailAddress: donation.donor.email,
                donationAmount : donationStr,
                donationDate : donation.donation_date,
                donorID : donation.donor.id,
                taxParagaph : `Please let this note serve as your receipt for a fully tax-deductible contribution of  ${donationStr} 
                to Common Threads Project on ${donation.donation_date}   No goods or services were provided in exchange for this contribution. Common Threads Project is an 
                exempt organization as described in Section 501(c)(3) of the Internal Revenue Code; EIN: 81-4212971.` 

            }

            return emailDataObj
        }))


     return arrOfDonationObjForEmail
}





function formatDate(utcTime, name){
    console.log(name)
    console.log(utcTime)
  
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October', 'November', 'December']
    

    //isolate month number between the two dashes in utcTime

    let dashIndexes = []
    
    for(let i = 0; i < utcTime.length; i++){
      if(utcTime[i] === '-'){
        dashIndexes.push(i)
      }
    }
   
    //use dash positions to isolate month and day numbers
  
    const monthNum = parseInt(utcTime.substring(dashIndexes[0] + 1,dashIndexes[1]))
    
    const dayNum = parseInt(utcTime.substring(dashIndexes[1] + 1, dashIndexes[1] + 3))
    
    const year = parseInt(utcTime.substring(0,4))
    

    //combine into finalStr 
    
    //indexes start at 0 and months start at 1 so you have to subtract 1 from the index
    
    const finalStr = `${months[monthNum - 1]} ${dayNum}, ${year}`
    
    console.log(finalStr)
    
    return finalStr
  
}



export default collectDonationInfo