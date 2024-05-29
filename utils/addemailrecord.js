import emailRecordsFilePath from "./pathutils.js";
import fs from "fs";
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
  } catch (err) {}
};

const addRecord = async (donation, emailStatus) => {
  const { firstName, lastName, donationDate } = donation;
  try {
    const currentFileData = await getJsonFile();
    const recordId = generateDonationRecordID(
      firstName,
      lastName,
      donationDate
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

const updateRecord = async (name, donationDate, updateCategory, newStatus) => {
  try {
    const currentFileData = await getJsonFile();
    const recordId = generateDonationRecordID(name, donationDate);
  } catch (error) {
    console.error("Error updating file", error);
  }
};

// addRecord("John-Smith", "2024-01-01", "SENT");

export default addRecord;
