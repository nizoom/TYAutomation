const generateDonationRecordID = (name, timestamp) => {
  const formattedName = name.replace(/ /g, "-");
  return `${formattedName}-${timestamp}`;
};

export { generateDonationRecordID };
