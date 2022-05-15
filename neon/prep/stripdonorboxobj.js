function convertToDBObject(donationsForDBProcessing){

    console.log(donationsForDBProcessing)

    // where the donation objs from donorbox are stored once they are stripped down to what is relavent to neon 

    const neonObjs = donationsForDBProcessing.map((donation => {
        
            function assignTributeStatus(){

                const checkForHonoree = donation.hasOwnProperty('honor');
                                  
                    neonObj.tribute = {
                        // capture tribute name and type 

                        honoreeName : checkForHonoree ? donation.honor.honoree_name : '',
                        recipientName : checkForHonoree ?  donation.honor.recipient_name : '',
                        type : checkForHonoree ?  donation.honor.dedication_type : '',
                        recipientEmail : checkForHonoree ?  donation.honor.recipient_email : '',
                        recipientAddress : checkForHonoree ?  donation.honor.recipient_address : '',
                        recipientMessage :checkForHonoree ?  donation.honor.recipiet_message : '',
                     }
              
            }

            function getAnswerFromFormQuestionSection (extraQuestion){
                if(donation.questions !== undefined){
                    const questionsSection = donation.questions;
                    let result = null
                    questionsSection.forEach(inputFromForm => {

                      if(inputFromForm.question.includes(extraQuestion)){
        
                        result = inputFromForm.answer
                      }

                    })
                    return result
                } else {
                   return false
                }
                
            }

            function assignTenderTypeProperties(typeStr){
                const stripeID = typeStr === 'stripe' ? donation.stripe_charge_id : ''
                const paypalID = typeStr === 'paypal' ? donation.  paypal_transaction_id : ''
                const tenderTypeID = getTenderTypeID();
                
                function getTenderTypeID(){
                    switch (typeStr) {
                        case 'stripe' : 
                            return '17'
                        case 'paypal': 
                            return '11'
                        case 'credit_card' :
                            return'19'
                        default:
                            return'1' //for physical check 
                    }
                }
                   
               
                neonObj.stripeID = stripeID;
                neonObj.paypalID = paypalID;
                neonObj.tenderTypeID = tenderTypeID
            }

            let neonObj = {
                // id : sampleObj.id.toString(),
                donorBoxAccountId : donation.donor.id.toString(),
                email : donation.donor.email,
                donorName : donation.donor.name,
                amount : donation.formatted_amount,
                date : donation.donation_date,
                campaign : {
                    id :  donation.campaign.id,
                    name : donation.campaign.name,
                     },
                phone : donation.donor.phone,
                address : donation.donor.address,
                city : donation.donor.city, 
                state : donation.donor.state,
                zip : donation.donor.zip_code,
                alpha2CountryCode : donation.donor.country,
                donationType : donation.donation_type,
                processingFee : donation.formatted_processing_fee,
                // donation obj does include plateform fee 
                source: 'DonorBox',
                donationType : donation.donation_type,
                campaign: donation.campaign.name,
                birthdayCard : getAnswerFromFormQuestionSection('birthday') ? 'yes' : 'no',
                hostEvent : getAnswerFromFormQuestionSection('hosting') ? 'yes' : 'no',
                currency: donation.currency.toUpperCase(),
                donorboBoxReceiptID : donation.id,
                donorBoxPlanID : donation.hasOwnProperty('plan_id') ? donation.plan_id : '',
                recurringDonation : donation.recurring
          
                // tender:  stripe, credit card, paypal majority from db are stripe or pay pal 

                // firstDonation
                
            }
    assignTenderTypeProperties(donation.donation_type)
    
    assignTributeStatus(donationsForDBProcessing)

    return neonObj;

    }))


    return neonObjs;

}

export default convertToDBObject

