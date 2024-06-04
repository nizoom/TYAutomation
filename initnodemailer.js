import createNewEmail from "./emails/nodemailer.js";
import checkEmailRecords from "./utils/checkemailrecord.js";

async function initNodeMailer(donations, sendResponseFromNodeMailerToClient) {
  console.log(donations.length);
  //loop through donations and pass each obj to nodemailer

  // add function to check records for already sent emails
  const unacknowledgedDonations = [];
  for (const donation of donations) {
    const { firstName, lastName, donationDate, honoreeName } = donation;

    const emailStatus = await checkEmailRecords(
      firstName,
      lastName,
      donationDate,
      honoreeName
    );

    if (emailStatus === undefined) {
      console.log("🚀 ~ initNodeMailer ~ emailStatus:", emailStatus);
      unacknowledgedDonations.push(donation);
    } else {
      console.log(
        `Email has already been sent or is N/A for donation: ${donation}`
      );
    }
  }

  // turn this into an function that gets called rather than a const that gets intialized immediately

  const mailResults = await Promise.all(
    unacknowledgedDonations.map(async (donation) => {
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
