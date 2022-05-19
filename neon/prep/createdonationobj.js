function createNeonDonationObj(donation){
    // format donation obj so that neon can post it 

    function removeCurrencySymbols(amount){
  
      //   delete all white space 
        const trimmedAmount = amount.trim();
        
        if(isNaN(trimmedAmount[0])){
           //eithre remove first character because it is a currency symbol and not a number 
           const formattedAmount = trimmedAmount.substring(1)
           return formattedAmount;
        } else { 
          //or remove the last character for the same reason
          const formattedAmount = trimmedAmount.substring(0, trimmedAmount.length - 1 )
          return formattedAmount
        }
      }
      
      

    const donationForPosting = {
     
        'date' : donation.UTCTime,
        'accountId' : donation.neonAccountID,
        "amount" : removeCurrencySymbols(donation.amount),
  

        "payments": [
          
            {
              "id": "12345",
              "amount" : removeCurrencySymbols(donation.amount),
              "tenderType": donation.tenderTypeID,
          
            },
          
        ],

        "donationCustomFields" : [
          {
            "id" : "115",
            "name" : "Donation Type", 
            "status": "ACTIVE",
            "value": donation.donationType
          
          },
          {
            "id" : "124",
            "name" : "Dedication Type", 
            "status": "ACTIVE",
            "value": donation.tribute.type
          
          },
          {
            "id" : "127",
            "name" : "Recipient Email", 
            "status": "ACTIVE",
            "value": donation.tribute.recipientEmail
          },
          {
            "id" : "128",
            "name" : "Recipient Address", 
            "status": "ACTIVE",
            "value": donation.tribute.recipientAddress
          },
          {
            "id" : "129",
            "name" : "Recipient Message", 
            "status": "ACTIVE",
            "value": donation.tribute.recipientMessage
          },
          {
            "id" : "126",
            "name" : "Recipient Name", 
            "status": "ACTIVE",
            "value": donation.tribute.recipientName
          },

          {
            "id" : "140",
            "name" : "Recurring Donation", 
            "status": "ACTIVE",
            "value": donation.recurringDonation
          },
          {
            "id" : "114",
            "name" : "Donor Box Receipt ID", 
            "status": "ACTIVE",
            "value": donation.donorboBoxReceiptID
          
          },
          {
            "id" : "118",
            "name" : "Stripe Charge Id",
            "status": "ACTIVE",
            "value": donation.stripeID
          },
          {
            "id" : "120",
            "name" : "Paypal Transaction Id",
            "status": "ACTIVE",
            "value": donation.paypalID
          },
          {
            "id" : "125",
            "name" : "Honoree Name",
            "status": "ACTIVE",
            "value": donation.tribute.name
          },
  
          {
            "id" : "136",
            "name" : "Processing Fee",
            "status": "ACTIVE",
            "value": donation.processingFee
          },
          {
            "id" : "141",
            "name" : "Source",
            "status": "ACTIVE",
            "value": "DonorBox"
          },
          {
            "id" : "135",
            "name" : "Birthday card rather than a thank you card",
            "status": "ACTIVE",
            "value": donation.birthdayCard
          },
          {
            "id" : "131",
            "name" : "Hosting CTP event",
            "status": "ACTIVE",
            "value": donation.hostEvent
          },
          {
            "id" : "105",
            "name" : "Currency",
            "status": "ACTIVE",
            "value": donation.currency
          },
          {
            "id" : "121",
            "name" : "Recurring Plan Id",
            "status": "ACTIVE",
            "value": donation.donorBoxPlanID
          },


        ]
        
    }

    return donationForPosting;

}

export default createNeonDonationObj;