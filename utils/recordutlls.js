const generateDonationRecordID = (
  firstName,
  lastName,
  dateString,
  honoreeName
) => {
  const formattedName =
    honoreeName === undefined
      ? formatName(`${firstName}, ${lastName}`)
      : formatName(honoreeName);
  const timestamp = dateString.replace(",", "").replace(/ /g, "-");
  return `${formattedName}-${timestamp}`;
};

function formatName(name) {
  return name.replace(/ /g, "-");
}
export { generateDonationRecordID };
