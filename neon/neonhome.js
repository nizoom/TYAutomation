// import initDonationSearch from './getrequests/getdonorboxobj.js'

import loopThroughDonationsToUpdate from './post/postdonations.js'

import convertToDBObject from './prep/stripdonorboxobj.js'

import queryNeonAccounts from './get/getneonaccouts.js'

import createAccountsWhereNeeded from './prep/assessforaccountcreation.js'

async function updateDB(donations){

    console.log('beginning Neon process')
    // 1. get donation objs from donor box 

    // const donorboxObjs = await initDonationSearch();

    // 2. convert donorbox obj to neon obj
 
    const neonObjs = convertToDBObject(donations);

    // 3. pass all donations from the day to neon account checker to see if they have existing neon accounts

    const donationsWithAccStatus = await queryNeonAccounts(neonObjs); 

    // 4. If all already have accounts then add donation to account 

    const donationsWithAccID = await createAccountsWhereNeeded(donationsWithAccStatus);

    // now that all donors for this batch have neon accounts we can add their donation to their neon account

    loopThroughDonationsToUpdate(donationsWithAccID);

 

}

export default updateDB;