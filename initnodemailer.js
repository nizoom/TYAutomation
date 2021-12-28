import createNewEmail from './emails/nodemailer.js'

async function initNodeMailer(donations) {

    console.log(donations.length)

    //loop through donations and pass each obj to nodemailer

    // console.log('we made it to here ' + donations)

    const mailResults = await Promise.all(donations.map(async donation => {

       const emailStatus = await createNewEmail(donation)

       return emailStatus
        
    }))

    //store results 
}


export default initNodeMailer;


