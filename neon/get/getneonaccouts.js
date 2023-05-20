import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";

async function queryNeonAccounts(donations) {
  dotenv.config({ path: "../.env" });

  const username = process.env.NEON_ORG_ID;
  // console.log(
  //   "🚀 ~ file: getneonaccouts.js:9 ~ queryNeonAccounts ~ username:",
  //   username
  // );

  const password = process.env.NEON_API_KEY;
  // console.log(
  //   "🚀 ~ file: getneonaccouts.js:12 ~ queryNeonAccounts ~ password:",
  //   password
  // );

  const base64encodedData = Buffer.from(username + ":" + password).toString(
    "base64"
  );

  const allEmails = donations.map((donation) => donation.email);

  const queryTerms = declareQueryTerm(allEmails);

  // gets account status for each email address

  const accountStatuses = await accountGetRequest(queryTerms);

  const donationsWithAccStatus = checkEachDonationForAssociatedNeonAcc();

  return donationsWithAccStatus;

  function checkEachDonationForAssociatedNeonAcc() {
    // create convert array of account statuses to 1 object that contains name : id, name : id, etc.

    const objOfNamesandIDs = accountStatuses.reduce(
      (accumulator, currentValue) => {
        const name =
          currentValue["First Name"] + " " + currentValue["Last Name"];
        return { ...accumulator, [name]: currentValue["Account ID"] };
      },
      {}
    );

    // go through all donations and compare them to that obj ^
    const donationsWithAccStatus = donations.map((donation) => {
      const fullName = donation.donorName;

      if (objOfNamesandIDs.hasOwnProperty(fullName)) {
        donation.neonAccountID = objOfNamesandIDs[fullName]; // this will be neon ID
      } else {
        donation.neonAccountID = `The donation from ${fullName} is not linked to a Neon account`;
      }
      return donation;
    });

    return donationsWithAccStatus;
  }

  function declareQueryTerm(email) {
    const queryTerms = {
      outputFields: ["Account ID", "First Name", "Last Name"],

      pagination: {
        currentPage: 0,
        pageSize: 20,
        sortColumn: "Account ID",
        sortDirection: "DESC",
      },
      searchFields: [
        {
          field: "Email",
          operator: "IN_RANGE",
          // "value" : email,
          valueList: allEmails,
        },
      ],
    };

    return queryTerms;
  }

  // let accountSearchResults = [];

  async function accountGetRequest(queryTerms) {
    const url = new URL("https://api.neoncrm.com/v2/accounts/search");

    const result = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + base64encodedData,
        "Content-Type": "application/json",
        // 'Accept' : '*/*'
      },

      body: JSON.stringify(queryTerms),
    })
      .then((data) => {
        return data.text();
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: getneonaccouts.js:111 ~ accountGetRequest ~ error.message:",
          error.message
        );
      });

    const parsedResultsFromFetch = JSON.parse(result);

    return parsedResultsFromFetch.searchResults;

    //TODO: this is going to change once we hear back from Neon about how to search for multiple emails in one query
  }
}

// queryNeonAccounts();

export default queryNeonAccounts;
