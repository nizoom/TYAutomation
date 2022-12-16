import { getAnswerFromFormQuestionSection } from "../neon/prep/stripdonorboxobj.js";
async function generateHonoreeObj(donations) {
  let donationsWithHonoreesObjects = [];

  donations.forEach((donation) => {
    if (donation.honorStatus) {
      const honoreeInfo = donation.honorStatus;

      //add an honoree object

      donationsWithHonoreesObjects.push({
        type: honoreeInfo.dedication_type,
        honoreeName: honoreeInfo.honoree_name,

        //honoree email address -> changed to TYToEmailAddress so that it can be consistent with the other donation object types
        TYToEmailAddress: honoreeInfo.recipient_email,

        messageFromHonorer: honoreeInfo.recipient_message,
        honorerFirstName: donation.firstName,
        honorerLastName: donation.lastName,

        //in case of an 'in memory of' donation -> the recipient will likely be different from the honoree name
        recipientName: honoreeInfo.recipient_name,
        honoreePhysicalAddress: honoreeInfo.recipient_address,

        //so that this object can be filtered properly in step 6 we need to provide the obj w an honorstatus property which, in this case, will always be false
        newDonorStatus: null,
        honorStatus: false,

        //add subject string for the email
        emailSubject: `${donation.firstName} ${donation.lastName} has dedicated a donation to you`,
        holidayCard: getAnswerFromFormQuestionSection(donation, "birthday")
          ? true
          : false,
      });
    }

    //add subject string for the email
    donation.emailSubject = `Thank you ${donation.firstName} for your donation to Common Threads Project`;

    //also be sure to keep/add all the initial objects no matter what
    donationsWithHonoreesObjects.push(donation);
  });

  return donationsWithHonoreesObjects;
}

export default generateHonoreeObj;
