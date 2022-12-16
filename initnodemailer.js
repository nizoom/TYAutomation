import createNewEmail from "./emails/nodemailer.js";

async function initNodeMailer(donations, sendResponseFromNodeMailerToClient) {
  console.log(donations.length);
  console.log(donations);

  //loop through donations and pass each obj to nodemailer

  const mailResults = await Promise.all(
    donations.map(async (donation) => {
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
