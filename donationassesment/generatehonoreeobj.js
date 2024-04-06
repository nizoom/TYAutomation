import { getAnswerFromFormQuestionSection } from "../neon/prep/stripdonorboxobj.js";
async function generateHonoreeObj(donations) {
  let donationsWithHonoreesObjects = [];

  donations.forEach((donation) => {
    if (donation.honorStatus) {
      const honoreeInfo = donation.honorStatus;

      //add an honoree object
      // console.log("donorbox recipient name: ", honoreeInfo.recipient_name);
      // console.log(
      //   `${donation.firstName} ${donation.lastName} and their donation typeY is ${donation.honorStatus.dedication_type}`
      // );
      // console.log(
      //   `${donation.firstName} ${
      //     donation.lastName
      //   } and their donation typeX is ${JSON.stringify(donation, null, 2)}`
      // );
      const honoreeName =
        honoreeInfo.honoree_name === ""
          ? "recipient"
          : honoreeInfo.honoree_name;
      donationsWithHonoreesObjects.push({
        type: donation.honorStatus.dedication_type,
        honoreeName: honoreeName,

        //honoree email address -> changed to TYToEmailAddress so that it can be consistent with the other donation object types
        TYToEmailAddress: honoreeInfo.recipient_email,

        messageFromHonorer: honoreeInfo.recipient_message,
        honorerFirstName: donation.firstName,
        honorerLastName: donation.lastName,
        // return donation.type === "In honor of"
        //in case of an 'in memory of' donation -> the recipient will likely be different from the honoree name
        recipientName:
          honoreeInfo.recipient_name.length < 1
            ? "recipient"
            : honoreeInfo.recipient_name,
        honoreePhysicalAddress: honoreeInfo.recipient_address,

        //so that this object can be filtered properly in step 6 we need to provide the obj w an honorstatus property which, in this case, will always be false
        newDonorStatus: null,
        honorStatus: false,

        //add subject string for the email

        emailSubject:
          donation.honorStatus.dedication_type === "In memory of"
            ? `${donation.firstName} ${
                donation.lastName
              } has made a donation in the memory of ${
                honoreeName === "recipient" ? "a loved one" : honoreeName
              }`
            : `${donation.firstName} ${donation.lastName} has dedicated a donation to you`,
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
