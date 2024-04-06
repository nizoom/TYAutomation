async function addCustomLanguage(donations) {
  //there are instances in the email templates where default/static language gives way to dynamic language based on the properties of each donation

  //here we will go through each donation and add properties that will plug into the dynamic parts of the template

  //'in honor of' and 'honoree templates are the only ones with variable language and so they are require their own steps

  let donationsWithCustomLanguage = [];

  donations.forEach((donation) => {
    //if block criteria will be determined by templateName

    //newDonor template does not need any extra language outside of what is already provided by the donation obj. Variable language is irstName, donationAmount, and donationDate

    //recurringDonor template does not need any extra language outside of what is already provided by the donation obj. Variable language is firstName, donationAmount, and donationDate

    if (donation.templateName === "honorer") {
      //honorer template needs firstName, honoree_name, donationAmount, donationDate

      const honorInfo = donation.honorStatus;

      const newDonorIntroSentence =
        "Welcome to the Common Threads family! We are delighted that you have chosen to join our mission.";

      const recurringDonorIntroSentence =
        "Thank you for continuing to be such a devoted supporter of Common Threads Project";

      //donorbox says email field must be filled out even if they also fill out physical address

      // const recipientDestinaiton = (honorInfo.recipient_email === '') ? honorInfo.recipient_address: honorInfo.recipient_email;

      const inMemoryOfSentence = `Because you have chosen to donate in memory of ${honorInfo.honoree_name}, we will send an acknowledgement to ${honorInfo.recipient_email}. What a meaningful tribute.`;

      const honorSentence = `Because you have chosen to honor ${honorInfo.honoree_name} with your contribution, we will send your message in an acknowledgement to them.  What a lovely tribute!`;

      //decide which sentences are applicable

      const introSentence = donation.newDonorStatus
        ? newDonorIntroSentence
        : recurringDonorIntroSentence;

      const actionSentence =
        honorInfo.dedication_type === "In honor of"
          ? honorSentence
          : inMemoryOfSentence;

      donation.introSentence = introSentence;
      donation.actionSentence = actionSentence;
      donationsWithCustomLanguage.push(donation);
      return;
    }

    if (donation.templateName === "honoree") {
      // is the recipient and honoree the same person?
      if (donation.type !== "In honor of") {
        // in memory of needs no custom language so it is ready to push now
        donationsWithCustomLanguage.push(donation);
        return;
      }

      const honoreeSameAsRecipient =
        donation.honoreeName === donation.recipientName ? true : false;

      const inHonorOrInMemoryStr = honoreeSameAsRecipient
        ? "in your honor"
        : "in honor of " + donation.honoreeName;

      //

      //honoree template needs honoree name, messageFromHonorer, honorerFirstName, honorerLastName

      const gratefulTheyChoseToStr = honoreeSameAsRecipient
        ? "honor you"
        : "honor them";

      // Edit down

      // const customMessageFromDonor = (donation.messageFromHonorer !== '' ) ? `They write: ${donation.messageFromHonorer}` : '' ;

      donation.gratefulTheyChoseToStr = gratefulTheyChoseToStr;

      donation.inHonorOrInMemoryStr = inHonorOrInMemoryStr;

      //below property may be unnecessary

      // donation.customMessageFromDonor = customMessageFromDonor;

      donationsWithCustomLanguage.push(donation);

      return;
    }

    // add all others donations to the arr as well

    donationsWithCustomLanguage.push(donation);

    return;
  });

  return donationsWithCustomLanguage;
}

export default addCustomLanguage;
