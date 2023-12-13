import donorPlanStatus from "../querydonorplan.js";

import moment from "moment";

async function checkForSubsequentMonthlies(donations, currentTime) {
  //slows down api querying so that it doesn't get jammed / too many queries
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const result = await asyncForEach(donations, determineMonthlyDonationStatus);

  async function asyncForEach(arrOfDonations, callback) {
    let filteredDonations = [];

    for (let index = 0; index < arrOfDonations.length; index++) {
      const processedDonation = await callback(arrOfDonations[index]);

      if (processedDonation !== undefined) {
        // undefined monthly donations are ones that came after the first instance of monthly giving -> so they are ignored

        filteredDonations.push(processedDonation);
      }

      await timeout(1500);
    }

    return filteredDonations;
  }

  async function determineMonthlyDonationStatus(donation) {
    const planCheck = await donorPlanStatus(donation.donorID);

    // console.log(planCheck)

    if (planCheck.length > 0 && planCheck[0].status !== "cancelled") {
      //comes from an ACTIVE monthly donor

      // It is possible that donors could cancel there monthly plan but still donate in one offs afterwards. These one offs should count as valid

      // date of when monthly plan began

      const startDate = moment(planCheck[0].started_at).format("MMMM Do YYYY"); //convert YYYY-MM-DD to reading format Month, Day Y

      const indexOfComma = donation.donationDate.indexOf(",");

      const formattedCurrentTime = moment(currentTime).format("MMMM Do YYYY"); // make startDate and formattedCurrentTime the same format so they can be compared below

      if (startDate === formattedCurrentTime) {
        // RC wants a monthly donation email only to send once (on the first day they start giving)

        console.log("monthly donation");

        donation.templateName = "monthly"; //this is the only scheduling frequency available from donor box at the moment

        donation.startDate = startDate;

        return donation;
      } // if donationDay !== scheduledDonationDay && donationAmount !== scheduledDonationAmount then they should get a recurring donor email
      else {
        return undefined;
        // from a monthly donor but a subsequent donation from the first -> returns undefined
      }
    } else {
      // a one off donation - not from a monthly donation
      return donation;
    }
  }

  return result;
}

export default checkForSubsequentMonthlies;
