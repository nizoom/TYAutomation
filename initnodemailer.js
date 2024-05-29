import createNewEmail from "./emails/nodemailer.js";
import checkEmailRecords from "./utils/checkemailrecord.js";

async function initNodeMailer(donations, sendResponseFromNodeMailerToClient) {
  console.log(donations.length);
  //loop through donations and pass each obj to nodemailer

  // add function to check records for already sent emails
  const unacknowledgedDonation = [];
  for (const donation of donations) {
    console.log("CHECK FOR TIME PROPERTY");
    console.log(donation);
    const { firstName, lastName, donationDate } = donation;

    const emailStatus = await checkEmailRecords(
      firstName,
      lastName,
      donationDate
    );
    if (emailStatus === false) {
      unacknowledgedDonation.push(unacknowledgedDonation);
    } else {
      console.log(
        `Email has already been sent or is N/A for donation: ${donation}`
      );
    }
  }

  const mailResults = await Promise.all(
    unacknowledgedDonation.map(async (donation) => {
      //set timeout to avoid error with too many node mailer calls back to back

      const index = donations.indexOf(donation);

      return new Promise((resolve) => {
        setTimeout(async () => {
          const emailStatus = await createNewEmail(
            donation,
            sendResponseFromNodeMailerToClient
          ); //maybe add .thens to it

          resolve(emailStatus);
        }, 1000 * index);
      });
    })
  );

  //store results

  return mailResults;
}

export default initNodeMailer;
