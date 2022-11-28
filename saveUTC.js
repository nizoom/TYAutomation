import moment from "moment";

function saveUTCTime(donations) {
  // saves UTC time to the donor obj so that the program can use that time stamp to post accurately to Neon
  const UTCdDonations = donations.map((donation) => {
    // offset for time difference

    donation.UTCTime = moment(donation.donation_date).utcOffset("-0500");

    return donation;
  });

  return UTCdDonations;
}

export default saveUTCTime;
