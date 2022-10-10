// TY AUTOMATION AND UI SERVER MAIN FILE
import getDateandTime from "./getdate.js";

import initDonationSearch from "./querynewdonations.js";

import saveUTCTime from "./saveUTC.js";

import checkForNewDonations from "./checkfornewdonations.js";

import collectDonationInfo from "./donationassesment/collectdonationinfo.js";

import checkForSubsequentMonthlies from "./donationassesment/checkforsubsqntmonthlies.js";

import generateHonoreeObj from "./donationassesment/generatehonoreeobj.js";

import labelDonations from "./donationassesment/labeldonations.js";

import addCustomLanguage from "./donationassesment/addcutomlanguage.js";

import initNodeMailer from "./initnodemailer.js";

import assessLoginAttempt from "./templatebuilderfuncs/assesslogin.js";

import updateDB from "./neon/neonhome.js";

import generateNeonDonationList from "./neon/genneondonationlist.js";

import "dotenv/config.js";

import cors from "cors";

import bodyParser from "body-parser";

import express from "express";

// const app = express();

// app.use(cors());

// // use the express-static middleware
// app.use(express.static("public"));

// // // define the first route
// app.get("/", function (req, res) {
//   res.send("<h1>Welcome</h1>");
// });

// // start the server listening for requests
// // app.listen(process.env.PORT || 3000,
// // 	() => console.log("Server is running..."));

// // LOGIN ENDPOINT + FUNC FOR TEMPLATE BUILDER UI

// const urlencodedParser = bodyParser.urlencoded({ extended: false });

// app.use("/login", bodyParser.json(), urlencodedParser, function (req, res) {
//   console.log("attempting login");
//   const pwAttempt = req.body.pwAttempt;
//   const loginResult = assessLoginAttempt(pwAttempt);
//   if (loginResult) {
//     res.send({ result: true });
//   } else {
//     res.send({ result: false });
//   }
// });

// // SUBMIT ENDPOINT AND FUNCTION FOR TEMPLATE BUILDER UI

// app.use(
//   "/submitemail",
//   bodyParser.json(),
//   urlencodedParser,
//   async function (req, res) {
//     console.log("attempting to send email");
//     console.log(req.body.emailObj);

//     const arrOfEmailObjs = req.body.emailObj;

//     initNodeMailer(arrOfEmailObjs, sendResponseFromNodeMailerToClient);

//     let nodeMailerResultsTracker = [];

//     function sendResponseFromNodeMailerToClient(dataForResponse) {
//       console.log("fired");

//       console.log(dataForResponse);

//       // when there is an honoree email there will be TWO outgoing emails -> so TWO responses from nodemailer should be expected

//       // therefore we have to wait to res until both responses can be checked

//       nodeMailerResultsTracker.push(dataForResponse);

//       if (nodeMailerResultsTracker.length === arrOfEmailObjs.length) {
//         const results = nodeMailerResultsTracker.find((obj) =>
//           checkForResponseObjValidity(obj)
//         );

//         // arr.find returns undefined if nothing meets the condition

//         console.log(results);

//         if (results !== undefined) {
//           res.send({ results: false });
//         } else {
//           res.send({ results: true });
//         }
//       }

//       function checkForResponseObjValidity(obj) {
//         if (!obj.response.includes("250")) {
//           // valid response should include this str
//           return true;
//         }
//         if (obj.rejected.length > 0) {
//           // valid response should not have rejections
//           return true;
//         }
//       }
//     }
//   }
// );

// // CODE FOR AUTOMATION PROCESS BELOW

// const requiredHeader = process.env.REQUIRED_HEADER;

// app.use("/index", async function (req, res) {
//   try {
//     if (req.headers.requester === requiredHeader) {
//       const status = await automateThankYous();
//       res.json({
//         status: 200,
//         message:
//           "Connection succesful. Checking for new donations. If there is a valid donation you will be CCd in the TY email.",
//       });
//     } else {
//       res.status(403).send("Access denied. Requested from invalid source");
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Connection unsuccessful. Server error");
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));

automateThankYous();

async function automateThankYous() {
  console.log("Beginning automation process");

  //1. get current date

  const [currentTime, yesterday, tomorrow] = await getDateandTime();

  //2. query donorbox for all donations since yesterday at 5:30 PM

  const todaysDonations = await initDonationSearch(yesterday, tomorrow);

  //2.5 save UTC time for posting to Neon accurately at the end of the program

  const todaysDonationsWithUTCTime = saveUTCTime(todaysDonations);

  //3. if any donations occured yesterday before 5:30 then they will not be counted (since they were accounted for yesterday)

  const newDonations = await checkForNewDonations(
    todaysDonationsWithUTCTime,
    currentTime
  );

  //3.5. if there are no new donations, then end the program

  if (newDonations < 1) {
    console.log("no donations since last check yesterday at 5:30");

    return;
  }

  //4. use donor ID from from each donation so that we can see what type of donor they are. This step also strips down the donation object to the important properties only.

  const donationInfo = await collectDonationInfo(newDonations);

  //4.5 filter our subsequent monthly donations after the first one. If it is the first, then it gets a unique template

  const donotationsWithOutMonthlies = await checkForSubsequentMonthlies(
    donationInfo,
    currentTime
  );

  //  console.log(donotationsWithOutMonthlies)
  if (donotationsWithOutMonthlies.length < 1) {
    console.log(
      "All new donations were recurring monthlies which do not require an email"
    );
    console.log("These donations include :");
    console.log(donationInfo);
  }

  //5. scan for 'in honor of' donations. For every one of that type create a new object for the honoree because they will need to receive their own email. Then add that object to the donor obj array

  const donationsWithHonorees = await generateHonoreeObj(
    donotationsWithOutMonthlies
  );

  //6. Add template HTML filename to each donation object so that nodemailer will know which template to use when the donations are passed to it

  const donationInfoWithTempPath = await labelDonations(donationsWithHonorees);

  //7. assess each donation for any custom language to be added to the template email based on the criteria of the donation. This copy language is sourced from the template Google Doc

  const donationsInfoWithTemplateLanguage = await addCustomLanguage(
    donationInfoWithTempPath
  );

  // get a visual

  donationsInfoWithTemplateLanguage.forEach((emailObj) => {
    console.log("Here is a visual");
    console.log(donationsInfoWithTemplateLanguage.indexOf(emailObj));
    console.log(emailObj);
  });

  //   8. pass array of donaitonInfo objects to nodemailer file for sending

  initNodeMailer(donationsInfoWithTemplateLanguage);

  // 9 or 7 potentially

  const donationListForNeonProcess = generateNeonDonationList(
    todaysDonationsWithUTCTime,
    donationsInfoWithTemplateLanguage
  );

  // 10. Begin Neon CRM updating process

  updateDB(donationListForNeonProcess);
}
