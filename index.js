// WELCOME TO TY AUTOMATION HQ 


//Imports 

import getDateandTime from './getdate.js';

import initDonationSearch from './querynewdonations.js';

import checkForNewDonations from './checkfornewdonations.js';

import collectDonationInfo from './donationassesment/collectdonationinfo.js'

import generateHonoreeObj from './donationassesment/generatehonoreeobj.js'

import labelDonations from './donationassesment/labeldonations.js'

import addCustomLanguage from './donationassesment/addcutomlanguage.js';

import initNodeMailer from './initnodemailer.js';


//so that it starts first time node index js is ran 

automateThankYous()

// setInterval sets up every subsequent running

// setInterval(function(){

//     automateThankYous()

// },1800000);


async function automateThankYous(){

       console.log('fired')
   
       //1. get current date 

       const [todaysDate, currentTime] = await getDateandTime();


       //2. query donorbox for todays donations
   
       const todaysDonations = await initDonationSearch('2021-12-29'); //today YYYY-MM-DD 2021-15-12
   
     
    
       //3. if any donations occured in the last 10 minutes (AKA since last check) then they are new 
   
       const newDonations = await checkForNewDonations(todaysDonations, currentTime);
   
      
       //3.5. if there are no new donations, then end the program 
   
       if(newDonations < 1){
   
           console.log('no new donations since 10 minutes ago')
   
           const ending = 'no new donations since 10 minutes ago'
   
           return ending;
   
       }
   
       //4. use donor ID from from each donation so that we can see what type of donor they are. This step also strips down the donation object to the important properties only.
   
       const donationInfo = await collectDonationInfo(newDonations);
   
       //console.log(donationInfo)    
       //5. scan for 'in honor of' donations. For every one of that type create a new object for the honoree because they will need to receive their own email. Then add that object to the donor obj array
   
       const donationsWithHonorees =  await generateHonoreeObj(donationInfo);
   
       // console.log(donationsWithHonorees[2], donationsWithHonorees[1] )
       //6. Add template HTML filename to each donation object so that nodemailer will know which template to use when the donations are passed to it
   
       const donationInfoWithTempPath = await labelDonations(donationsWithHonorees);


       
       // get a visual 

       donationInfoWithTempPath.forEach(( donation, index) => {
           console.log(index)
           console.log(donation)
       })

       //7. assess each donation for any custom language to be added to the template email based on the criteria of the donation. This copy language is sourced from the template Google Doc 
       

       
       let stillSend = []


       for(let i = 0 ; i < donationInfoWithTempPath.length ; i++){
           if(i!==2 && i!==8 && i!==9 && i!==11){
               console.log(i)
            stillSend.push(donationInfoWithTempPath[i])
           }
       }
       
    // console.log(stillSend)

       const donationsInfoWithTemplateLanguage = await addCustomLanguage(stillSend) //donationInfoWithTempPath
   
       
       //8. pass array of donaitonInfo objects to nodemailer file for sending 
   
       const sendResults = await initNodeMailer(donationsInfoWithTemplateLanguage)


}
 