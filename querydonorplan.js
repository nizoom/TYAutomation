import fetch from "node-fetch";

import "dotenv/config.js";

async function donorPlanStatus(donorID) {
  console.log("looking for monthly DONOR");

  const key = process.env.DONORBOX_KEY;
  const username = process.env.DONORBOX_USERNAME;

  // Use donor_id filter to filter plans by Donorbox donor id. This is the Donorbox generated donor id.

  // e.g. {GET} /api/v1/plans?donor_id=XXXXXXX

  return await getDonorPlanStatus(donorID);

  async function getDonorPlanStatus(donorID) {
    try {
      const response = await fetch(
        `http://donorbox.org/api/v1/plans?donor_id=${donorID}`,
        {
          headers: {
            Authorization:
              "Basic " + Buffer.from(`${username}:${key}`).toString("base64"),
            "X-Result-Count": 100000000,
          },
        }
      );
      const result = await response.json();
      console.log("API Response:", result); // Add this line to log the API response
      return result;
    } catch (error) {
      console.log("ERRORZ");
      console.dir(error.message);
      return null;
    }
  }
}

export default donorPlanStatus;
