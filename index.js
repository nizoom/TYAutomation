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



setInterval(function(){

    automateThankYous()

},86400000); // runs once a day after initial start 
  

async function automateThankYous(){

       console.log('fired')
   
       //1. get current date 

       const [currentTime, yesterday, tomorrow]= await getDateandTime();


       //2. query donorbox for all donations since yesterday at 5:30 PM 
   
       const todaysDonations = await initDonationSearch(yesterday, tomorrow); 
    
       //3. if any donations occured yesterday before 5:30 then they will not be counted (since they were accounted for yesterday) 
   
       const newDonations = await checkForNewDonations(todaysDonations, currentTime); 


       //3.5. if there are no new donations, then end the program 
   
       if(newDonations < 1){

           console.log('no donations since last check')
   
           return;
   
       }
   
       //4. use donor ID from from each donation so that we can see what type of donor they are. This step also strips down the donation object to the important properties only.
   
       const donationInfo = await collectDonationInfo(newDonations);


       //4.5 filter our subsequent monthly donations after the first one. If it is the first, then it gets a unique template 
   
       const donotationsWithOutMonthlies = await checkForSubsequentMonthlies(donationInfo, currentTime);

   

       if(donotationsWithOutMonthlies.length < 1){

        console.log('All new donations were recurring monthlies which do not require an email')

       }

       //5. scan for 'in honor of' donations. For every one of that type create a new object for the honoree because they will need to receive their own email. Then add that object to the donor obj array

       const donationsWithHonorees =  await generateHonoreeObj(donotationsWithOutMonthlies);


       //6. Add template HTML filename to each donation object so that nodemailer will know which template to use when the donations are passed to it


       const donationInfoWithTempPath = await labelDonations(donationsWithHonorees);

       //7. assess each donation for any custom language to be added to the template email based on the criteria of the donation. This copy language is sourced from the template Google Doc 
       
       

       const donationsInfoWithTemplateLanguage = await addCustomLanguage(donationInfoWithTempPath)
   

         // get a visual 

         donationsInfoWithTemplateLanguage.forEach(( donation, index) => {
            console.log(index)
            console.log(donation)
        })
       
        //   8. pass array of donaitonInfo objects to nodemailer file for sending 

        console.log('TEST');
        // const sendResults = await initNodeMailer(donationsInfoWithTemplateLanguage);


        
}


