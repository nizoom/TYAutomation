import moment from "moment";

async function checkForNewDonations(donations, currentTime) {
  const previousTime = moment(currentTime).subtract(1, "days").toDate(); // this defines the window in which a donation is considered 'new'. Previous time is 5:30 yesterday

  let newDonations = [];
  //if donation time is later than previous time then it is a new donation and will need an email

  donations.forEach((donation) => {
    // donation.donation_date this needs to be converted from UTC to EST

    const timeOfDonation = moment(donation.donation_date).utcOffset("-0500");

    if (timeOfDonation.isAfter(moment(previousTime))) {
      console.log("noted");
      //then push to newDonations array
      donation.donation_date = moment(donation.donation_date)
        .utcOffset("-0500")
        .format("ll");
      newDonations.push(donation);
    } else {
      console.log(
        `this donation from ${donation.donor.name} occured before last check at ` +
          previousTime
      );
    }

    return;
  });

  return newDonations;
}

export default checkForNewDonations;
