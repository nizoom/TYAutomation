import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
async function getCustomFields() {
  dotenv.config({ path: "../../.env" });
  const username = process.env.NEON_ORG_ID;
  const password = process.env.NEON_API_KEY;

  const url = new URL("https://api.neoncrm.com/v2/customFields");
  const query = "?category=Donation";

  const base64encodedData = Buffer.from(username + ":" + password).toString(
    "base64"
  );

  const result = await fetch(url + query, {
    method: "GET",
    headers: {
      Authorization: "Basic " + base64encodedData,
      "Content-Type": "application/json",
      // 'Accept' : '*/*'
    },
  })
    .then((data) => {
      console.log(data);
      return data.text();
    })
    .catch((error) => {
      console.log(error.message);
    });
  const parsedResultsFromFetch = JSON.parse(result);
}

getCustomFields();
