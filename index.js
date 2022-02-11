// WELCOME TO TY AUTOMATION HQ 


//Imports 

import getDateandTime from './getdate.js';

import initDonationSearch from './querynewdonations.js';

import checkForNewDonations from './checkfornewdonations.js';

import collectDonationInfo from './donationassesment/collectdonationinfo.js'

import checkForSubsequentMonthlies from './donationassesment/checkforsubsqntmonthlies.js';

import generateHonoreeObj from './donationassesment/generatehonoreeobj.js'

import labelDonations from './donationassesment/labeldonations.js'

import addCustomLanguage from './donationassesment/addcutomlanguage.js';

import initNodeMailer from './initnodemailer.js';


//so that it starts first time node index js is ran 

automateThankYous()

// setInterval sets up every subsequent running

setInterval(function(){

    automateThankYous()

},86400000); // 1 day 
  
// might have to make initdation search params a range of two days again in case it is run at 5pm every day. We would need yesterday 5 pm onward + until 5pm today 


async function automateThankYous(){

       console.log('fired')
   
       //1. get current date 

       const [currentTime, yesterday, tomrrow]= await getDateandTime();

       //2. query donorbox for todays donations
   
       const todaysDonations = await initDonationSearch(yesterday, tomrrow); //today YYYY-MM-DD 2021-15-12
   

    
       //3. if any donations occured in the last 10 minutes (AKA since last check) then they are new 
   
       const newDonations = await checkForNewDonations(todaysDonations, currentTime); // maybe get rid of this if RC only wants to run every once ever 24 hours



       //3.5. if there are no new donations, then end the program 

   
       if(newDonations < 1){

           console.log('no donations since last check')
   
           return;
   
       }
   
       //4. use donor ID from from each donation so that we can see what type of donor they are. This step also strips down the donation object to the important properties only.
   
       const donationInfo = await collectDonationInfo(newDonations);

        //4.5 filter our subsequent monthly donations after the first one 

                // here we also check if a donation is from a monthly donation plan which requires its own unique template
   
       const donotationsWithOutMonthlies = await checkForSubsequentMonthlies(donationInfo, currentTime);
       //5. scan for 'in honor of' donations. For every one of that type create a new object for the honoree because they will need to receive their own email. Then add that object to the donor obj array
       
        // console.log(donotationsWithOutMonthlies);

       const donationsWithHonorees =  await generateHonoreeObj(donotationsWithOutMonthlies);
   
       // console.log(donationsWithHonorees[2], donationsWithHonorees[1] )

       //6. Add template HTML filename to each donation object so that nodemailer will know which template to use when the donations are passed to it


       console.log('label donations');
       const donationInfoWithTempPath = await labelDonations(donationsWithHonorees);

       //7. assess each donation for any custom language to be added to the template email based on the criteria of the donation. This copy language is sourced from the template Google Doc 
       
       

       const donationsInfoWithTemplateLanguage = await addCustomLanguage(donationInfoWithTempPath) //donationInfoWithTempPath
   

         // get a visual 

        //  donationsInfoWithTemplateLanguage.forEach(( donation, index) => {
        //     console.log(index)
        //     console.log(donation)
        // })
       
        //   8. pass array of donaitonInfo objects to nodemailer file for sending 

   
        // const sendResults = await initNodeMailer(donationsInfoWithTemplateLanguage);


        
}


