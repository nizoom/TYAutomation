import emailRecordsFilePath from "./pathutils.js";
import fs from "fs";
import { generateDonationRecordID } from "./recordutlls.js";

const checkEmailRecords = async (name, timestamp) => {
  try {
    const data = await fs.readFile(emailRecordsFilePath, "utf-8");
    const donationRecords = JSON.parse(data);
    const dontationID = generateDonationRecordID(name, timestamp);
    const result = donationRecords.find(
      (donationRecord) => donationRecord.donationID === dontationID
    );
    const returnResult = result ? "SEND" : "DO NOT SEND";
    // if result is undefined return action item SEND
    // else action item is to NOT SEND
    return returnResult;
  } catch (error) {
    if (error.code === "ENOENT") {
      // File does not exist
      return "File does not exist";
    } else {
      throw error;
    }
  }
};

// add timestamp to flow since it is needed as an argument

export default checkEmailRecords;
