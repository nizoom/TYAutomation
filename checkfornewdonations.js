import moment from 'moment'


async function checkForNewDonations(donations, currentTime){

    //get previous time 

    const previousTime = moment(currentTime).subtract(5, 'days').toDate(); // change days to minutes

    
    let newDonations = []
    //if donation time is later than previous time / previous check then it is a new donation and will need an email

    donations.forEach(donation => {
        //convert str to be compatible with moment js

        const timeOfDonation = moment(donation.donation_date)

        if(timeOfDonation.isAfter(moment(previousTime))) {

              //then push to newDonations array 

            newDonations.push(donation)
          
        }
    
        return 

    })


    return newDonations;
  
}


export default checkForNewDonations;