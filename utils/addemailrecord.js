import emailRecordsFilePath from "./pathutils.js";
import fs from "fs";
import { generateDonationRecordID } from "./recordutlls.js";

class Record {
  constructor(id, emailStatus) {
    this.id = id;
    tjos.emailStatus = emailStatus;
  }
}

const addRecord = async (name, timestamp, emailStatus) => {
  try {
    let currentFile = [];
    if (fs.existsSync(emailRecordsFilePath)) {
      const fileContent = await fs.promises.readFile(
        emailRecordsFilePath,
        "utf-8"
      );
      currentFile = JSON.parse(fileContent);
      const recordId = generateDonationRecordID(name, timestamp);
      const newRecord = new Record(recordId, emailStatus);
    }
  } catch (error) {}
};
