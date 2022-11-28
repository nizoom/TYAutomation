import createNeonAccount from "../post/createacc.js";

async function createAccountsWhereNeeded(donations) {
  const nowAllDonorHaveAccounts = await wrapperForAsyncLoop();

  async function wrapperForAsyncLoop() {
    const donorsWithNeonAccounts = donations.map(async (donation) => {
      if (/^\d+$/.test(donation.neonAccountID)) {
        console.log("donor has an existing neon account");
        // console.log(donation)
        return donation;
      } else {
        // the string states they don't have an account
        console.log("creating account");
        const newlyCreatedAcc = await createNeonAccount(donation);
        return newlyCreatedAcc;
      }
    });

    const awaitDonorsWithNeonAccounts = await Promise.all(
      donorsWithNeonAccounts
    );

    return awaitDonorsWithNeonAccounts;
  }

  return nowAllDonorHaveAccounts;
}

export default createAccountsWhereNeeded;
