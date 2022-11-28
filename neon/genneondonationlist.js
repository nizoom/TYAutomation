function generateNeonDonationList(
  untouchedDonationList,
  listAfterTYProcessing
) {
  // compare untouchedDonationList (the list of donations that arrives from donorbox) with listAfterTYProcessing (which has eliminated ones who do not get a TY)

  // for each untouched donation see if that donation exists (by email) in the listAfterTYProcessing array

  untouchedDonationList.forEach((untouchedDonation, index) => {
    // if TYProcessedDonation inlcudes email of untouchedDonation then that gift was acknowledged

    const identifyingProperty = untouchedDonation.donor.email;

    //if not then is was already filtered out of the automation process (like a 2nd + monthly donation)

    // filter checks to see if that email exists in any of the objects listed in the listAfterTYProcessing array

    const comparisonResult = listAfterTYProcessing.filter(
      (processedDonationObj) =>
        comparisonFunction(identifyingProperty, processedDonationObj)
    );

    // record if TY email was sent or if TY was not needed

    comparisonResult.length > 0
      ? (untouchedDonationList[index].acknolwedgementEmail = "sent")
      : (untouchedDonationList[index].acknolwedgementEmail = "N/A");
  });

  function comparisonFunction(identifyingProperty, processedDonationObj) {
    return identifyingProperty === processedDonationObj.TYToEmailAddress;
  }

  return untouchedDonationList; //now it has record saved
}

export default generateNeonDonationList;
