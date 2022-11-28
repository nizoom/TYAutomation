import getDonationsFromDonorBox from "../getDonationsFrmDonorbox.js";
import convertToDBObject from "../neon/prep/stripdonorboxobj.js";
import queryNeonAccounts from "../neon/get/getneonaccouts.js";
import loopThroughDonationsToUpdate from "../neon/post/postdonations";
import createAccountsWhereNeeded from "../neon/prep/assessforaccountcreation.js";
import saveUTCTime from "../saveUTC.js";

async function initForceNeon(startDate, endDate) {
  // YYYY-mm-dd
  const rawDonationData = await getDonationsFromDonorBox(startDate, endDate);

  const rawWithTimeStamp = saveUTCTime(rawDonationData);

  const arrOfNeonObjs = convertToDBObject(rawWithTimeStamp);

  const arrOfNeonObjsWithAccStatus = await queryNeonAccounts(arrOfNeonObjs);

  const donationsWithAccID = await createAccountsWhereNeeded(
    arrOfNeonObjsWithAccStatus
  );

  // loopThroughDonationsToUpdate(donationsWithAccID)
  // console.log(donationsWithAccID);
}

function setTYEmailStatusToNA(arrOfDonations) {
  const setDonations = arrOfDonations.map((el, index) => {
    el.acknolwedgementEmail = "N/A";
    return el;
  });
  return setDonations;
}

initForceNeon("2022-01-07", "2022-05-08");
