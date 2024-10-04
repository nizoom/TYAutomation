import emailRecordsFilePath from "./pathutils.js";
import fs from "fs/promises";
import { generateDonationRecordID } from "./recordutlls.js";

const checkEmailRecords = async (
  firstName,
  lastName,
  donationDate,
  honoreeName
) => {
  try {
    const data = await fs.readFile(emailRecordsFilePath, "utf-8");
    const donationRecords = JSON.parse(data);
    console.log("🚀 ~ donationRecords:", donationRecords);
    const donationID = generateDonationRecordID(
      firstName,
      lastName,
      donationDate,
      honoreeName
    );

    const result = donationRecords.find(
      (donationRecord) => donationRecord.id === donationID
    );

    return result;
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
