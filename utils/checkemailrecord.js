import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const filePath = path.join(__dirname, "../emails/records.json");

const checkEmailRecords = async (name, timestamp) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
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

const generateDonationRecordID = (name, timestamp) => {
  const formattedName = (name) => name.replace(/ /g, "-");
  return `${formattedName}-${timestamp}`;
};

export default checkEmailRecords;
