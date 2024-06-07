import emailRecordsFilePath from "./pathutils.js";
import fs from "fs";
import checkEmailRecords from "./checkemailrecord.js";
import { stringify } from "querystring";
import { generateDonationRecordID } from "./recordutlls.js";
class Record {
  constructor(id, emailStatus, neonStatus) {
    this.id = id;
    this.emailStatus = emailStatus;
  }
}

const getJsonFile = async () => {
  try {
    if (fs.existsSync(emailRecordsFilePath)) {
      const fileContent = await fs.promises.readFile(
        emailRecordsFilePath,
        "utf-8"
      );
      const currentFileData = JSON.parse(fileContent);
      return currentFileData;
    }
  } catch (err) {
    console.error(err);
  }
};

export const addRecord = async (donation, emailStatus) => {
  const { firstName, lastName, donationDate, honoreeName } = donation;
  try {
    const currentFileData = await getJsonFile();
    const recordId = generateDonationRecordID(
      firstName,
      lastName,
      donationDate,
      honoreeName
    );
    const newRecord = new Record(recordId, emailStatus);
    const updatedFileData = [...currentFileData, newRecord];
    await fs.promises.writeFile(
      emailRecordsFilePath,
      JSON.stringify(updatedFileData, null, 2),
      "utf-8"
    );
    console.log("record recorded successfully");
  } catch (error) {
    console.error("Error writing to file", error);
  }
};

export const updateRecord = async (
  firstName,
  lastName,
  donationDate,
  newStatus,
  honoreeName
) => {
  try {
    const currentFileData = await getJsonFile();
    const recordSearchResult = await checkEmailRecords(
      firstName,
      lastName,
      donationDate,
      honoreeName
    );
    if (recordSearchResult === undefined) {
      console.log(
        "🚀 ~ updateRecord ~ record not found - update failed:",
        recordSearchResult
      );
      return false;
    } else {
      const updatedRecord = (recordSearchResult.emailStatus = newStatus);
      const updatedFileData = currentFileData.with(
        currentFileData.indexOf(recordSearchResult),
        updatedRecord
      );
      await fs.promises.writeFile(
        emailRecordsFilePath,
        JSON.stringify(updatedFileData, null, 2),
        "utf-8"
      );
    }
  } catch (error) {
    console.error("Error updating file", error);
  }
};

// addRecord("John-Smith", "2024-01-01", "SENT");
