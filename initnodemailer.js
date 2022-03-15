import createNewEmail from './emails/nodemailer.js'

async function initNodeMailer(donations) {

    console.log(donations.length)

    //loop through donations and pass each obj to nodemailer


    const mailResults = await Promise.all(donations.map(async donation => {
        
        //set timeout to avoid error with too many node mailer calls back to back 

       const index = donations.indexOf(donation);

       setTimeout( async () => {

            const emailStatus = await createNewEmail(donation)

            return emailStatus
        

       }, 500 * index)  

    }))

    //store results 
    console.log(mailResults);
    
    return mailResults;
}


export default initNodeMailer;


