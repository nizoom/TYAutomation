import determineDonorFrequency from "./getdonorstatus.js";

// import moment from 'moment'

async function collectDonationInfo(donations) {
  //we need an array of objects where each object holds the info needed for an email

  //donor box api does not support fetching  multuple ids in one request so we need to loop / map through all the donations and await the async functions
  //that give us the new donor status and honor status

  const arrOfDonationObjForEmail = await Promise.all(
    donations.map(async (donation) => {
      const newDonorStatus = await determineDonorFrequency(donation);

      const honorStatus = donation.hasOwnProperty("honor")
        ? donation.honor
        : false; // if there is no honor property then honor status is false

      //convert date to a more email readable format

      //contains a decimal where it may not need one such as 100.0
      const unformattedDonation = donation.amount;

      //if decimal amount is 0 then delete .0 from string
      const decimalIndex = unformattedDonation.indexOf(".");

      const decimalAmount = unformattedDonation.substring(decimalIndex);

      //else (if has cents then keep it)

      //save a trimmed version of donation amount when need (when there is no cents)
      const formattedAmount =
        decimalAmount !== ".0"
          ? unformattedDonation
          : unformattedDonation.substring(0, decimalIndex);

      const emailDataObj = {
        newDonorStatus: newDonorStatus,
        honorStatus: honorStatus,
        firstName: donation.donor.first_name,
        lastName: donation.donor.last_name,
        TYToEmailAddress: donation.donor.email,
        donationAmount: formattedAmount,
        donationDate: donation.donation_date,
        donorID: donation.donor.id,
        taxParagaph: `Please let this note serve as your receipt for a fully tax-deductible contribution of $${formattedAmount} 
                to Common Threads Project on ${donation.donation_date}.   No goods or services were provided in exchange for this contribution. Common Threads Project is an 
                exempt organization as described in Section 501(c)(3) of the Internal Revenue Code; EIN: 81-4212971.`,
      };

      return emailDataObj;
    })
  );

  return arrOfDonationObjForEmail;
}

export default collectDonationInfo;
