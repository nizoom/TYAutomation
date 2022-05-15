function generateNeonDonationList(untouchedDonationList, listAfterTYProcessing){

    // compare untouchedDonationList (the list of donations that arrives from donorbox) with listAfterTYProcessing (which has eliminated ones who do not get a TY)

    // for each untouched donation see if that donation exists (by name) in the listAfterTYProcessing array

    untouchedDonationList.forEach((untouchedDonation, index) => {
        // some iterating logic 
        // if TYProcessedDonation inlcudes email of untouchedDonation then that gift was acknowledged 
        // and that record of email should be saved in untouchedDonation object.

        const identifyingProperty = untouchedDonation.donor.email;

        const comparisonResult = listAfterTYProcessing.filter (processedDonationObj => comparisonFunction(identifyingProperty, processedDonationObj))

        if(comparisonResult.length > 0){
            untouchedDonationList[index].acknolwedgement = 'sent'
          } else {
            untouchedDonationList[index].acknolwedgement = 'N/A'
          }

        
    })

    function comparisonFunction(identifyingProperty, processedDonationObj){
        return identifyingProperty === processedDonationObj.TYToEmailAddress
      }

    console.log(untouchedDonationList)
}

export default generateNeonDonationList;