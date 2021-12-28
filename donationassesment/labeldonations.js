
async function labelDonations(donoationsToBeCategorized){

    //this function is to label the type of each donation through the name of its template file 

    //then add these pieces of data to the object in an accessible way 

    // there will be 4 option for template file names: 'newdonor', 'recurringdonor', 'honorer', 'honoree'
    

    // console.log(donoationsToBeCategorized.length)



    const labelledDonations = donoationsToBeCategorized.map(donation => {
        
        //newdonor donation would have have newDonorStatus = true and honorStatus = false
        if(donation.newDonorStatus === true && donation.honorStatus === false){

            donation.templateName = 'newdonor'

            return donation;

        }
        
        //recurringdonor donation would have newDonorStatus = false and honorStatus = false

        if(donation.newDonorStatus === false && donation.honorStatus === false){

            donation.templateName = 'recurringdonor'

            return donation;
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

      

      
    })

    return labelledDonations;
}


export default labelDonations




// categorizeDonations(donoationsToBeCategorized)