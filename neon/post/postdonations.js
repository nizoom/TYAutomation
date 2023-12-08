import fetch from "node-fetch";
import "dotenv/config";
import createNeonDonationObj from "../prep/createdonationobj.js";

async function loopThroughDonationsToUpdate(donations) {
  const username = process.env.NEON_ORG_ID;

  const password = process.env.NEON_API_KEY;

  const base64encodedData = Buffer.from(username + ":" + password).toString(
    "base64"
  );

  const postedDonations = [];
  for (const donation of donations) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Delayed for 1 second.");

    const donationForPosting = createNeonDonationObj(donation);

    const postedDonation = await postDonationToNeon(donationForPosting);
    console.log("next donation (local): " + donation);
    console.log(
      "🚀 ~ file: postdonations.js:33 ~ loopThroughDonationsToUpdate ~ allPostedDonations:",
      postedDonation
    );

    postedDonations.push(postedDonation);
  }

  const allPostedDonations = await Promise.all(postedDonations);

  async function postDonationToNeon(donationForPosting) {
    const url = "https://api.neoncrm.com/v2/donations";

    const result = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + base64encodedData,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(donationForPosting),
    })
      .then((response) => response.json())
      .then((data) => {
        //in case one fails the accountID will be saved so we can see which one failed
        data.accountID = donationForPosting.accountId;
        console.log(data);
        return data;
      });

    return result;
  }
}

export default loopThroughDonationsToUpdate;
