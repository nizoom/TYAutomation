import emailRecordsFilePath from "./pathutils.js";
import fs from "fs";
import { generateDonationRecordID } from "./recordutlls.js";

class Record {
  constructor(id, emailStatus) {
    this.id = id;
    this.emailStatus = emailStatus;
  }
}

const addRecord = async (name, timestamp, emailStatus) => {
  try {
    if (fs.existsSync(emailRecordsFilePath)) {
      const fileContent = await fs.promises.readFile(
        emailRecordsFilePath,
        "utf-8"
      );
      const currentFileData = JSON.parse(fileContent);
      const recordId = generateDonationRecordID(name, timestamp);
      const newRecord = new Record(recordId, emailStatus);
      const updatedFileData = [...currentFileData, newRecord];

      await fs.promises.writeFile(
        emailRecordsFilePath,
        JSON.stringify(updatedFileData, null, 2),
        "utf-8"
      );
      console.log("record recorded successfully");
    }
  } catch (error) {
    console.error("Error writing to file", error);
  }
};

addRecord("John-Smith", "2024-01-01", "SENT");
