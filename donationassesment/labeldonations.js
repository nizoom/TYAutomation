async function labelDonations(donoationsToBeCategorized) {
  //this function is to label the type of each donation with the name of its template file

  //then add these pieces of data to the object in an accessible way

  // there will be 5 option for template file names: 'newdonor', 'recurringdonor', 'honorer', 'honoree', monthly (this option has already been assigned if applicable)

  const labelledDonations = await Promise.all(
    donoationsToBeCategorized.map(async (donation) => {
      // the only donations who have this property at THIS stage in the program are the valid monthly donations because those are the ones who have been assigned no step 4.5

      if (donation.hasOwnProperty("templateName")) {
        // no action is needed
        return donation;
      }

      //newdonor donation would have have newDonorStatus = true and honorStatus = false
      if (donation.newDonorStatus === true && donation.honorStatus === false) {
        donation.templateName = "newdonor";
        return donation;
      }

      //honoree obj would have the property honoreeName

      if (donation.hasOwnProperty("honoreeName")) {
        if (donation.holidayCard) {
          donation.templateName = "ecard";
        } else {
          donation.type === "In honor of"
            ? (donation.templateName = "honoree")
            : (donation.templateName = "memory_honoree");
        }
        // console.log("inside label donations");
        // console.log(donation);
        return donation;
      }

      if (donation.newDonorStatus === false && donation.honorStatus === false) {
        donation.templateName = "recurringdonor";

        return donation;
      }

      //honorer donation would have honorStatus = an obj and not false (which is a boolean value and not an obj)
      if (typeof (donation.honorStatus === "object")) {
        donation.templateName = "honorer";
        return donation;
      }
    })
  );

  return labelledDonations;
}

export default labelDonations;
