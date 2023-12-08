import fetch from "node-fetch";

import "dotenv/config.js";

async function getDonationsFromDonorBox(yesterday, tomorrow) {
  const key = process.env.DONORBOX_KEY;
  const username = process.env.DONORBOX_USERNAME;

  //${yesterday}&date_to=${today} remember date_to includes everything until thay day
  //to do a search from yesterday at 5pm to today at 5pm you need date_from = yeseterday & date_to = tomorrow
  //YYYY-mm-dd format for below

  async function getTodaysDonations(yesterday, tomorrow) {
    // const customStartDate = "2023-12-06";
    try {
      const result = await fetch(
        `https://donorbox.org/api/v1/donations?date_from=${yesterday}&date_to=${tomorrow}`,
        {
          //double check to see if this is actually picking up new donations from today
          headers: {
            Authorization:
              "Basic " + Buffer.from(`${username}:${key}`).toString("base64"),
            "X-Result-Count": 100000000,
          },
        }
      ).then((response) => response.json());

      return result;
    } catch (error) {
      console.log("ERROR");
      console.log(error.message);
    }
    return;
  }

  const todaysDonations = await getTodaysDonations(yesterday, tomorrow);

  return todaysDonations;
}

export default getDonationsFromDonorBox;
