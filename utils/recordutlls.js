const generateDonationRecordID = (firstName, lastName, dateString) => {
  const name = `${firstName} ${lastName}`;
  const formattedName = name.replace(/ /g, "-");
  const timestamp = dateString.replace(",", "").replace(/ /g, "-");
  return `${formattedName}-${timestamp}`;
};

export { generateDonationRecordID };
