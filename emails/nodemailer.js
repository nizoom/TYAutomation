import nodemailer from 'nodemailer'

import dotenv from "dotenv";

import path from 'path';

import 'nodemailer-express-handlebars'

import nodemailerExpressHandlebars from 'nodemailer-express-handlebars';

import fs from 'fs'

import handlebars from 'handlebars'



async function createNewEmail(donation){



  // console.log(donation)

  dotenv.config({path: "../.env"});


  //get corresponding email template

  const readHTMLFile = function(path, callback){
    fs.readFile(path, {encoding: 'utf-8'}, function(err, html) {
      if(err){
        console.log(err)
        callback(err, null)
        throw err;
      }
      else {
        callback(null, html);
      }
    })
  }


  const __dirname = path.resolve();

  readHTMLFile(__dirname + `/emails/templates/${donation.templateName}.handlebars`, function(err, html){

    const template = handlebars.compile(html);

    //the properties of the obj are used to plug into the template 
    const replacements = donation;

    const htmlToSend = template(replacements);

    let mailOptions = {

      from: 'info@commonthreadsproject.org', //ThankYouFromCTP@outlook.com'
      to:   'cohen@commonthreadsproject.org',  //['cohen@commonthreadsproject.org'],//'cohen@commonthreadsproject.org'], //donation.TYToEmailAddress
      subject: donation.emailSubject,
      text: '',
      html: htmlToSend,

    };

    transporter.sendMail(mailOptions, function(err, data) {
      if (err) {
        console.log("Error " + err);

        return `${donation} failed to send`

      } else {
        console.log("Email sent successfully");

        return `${donation} was successfully sent`
      }
    });

  })


  
    // console.log(process.env.DONORBOX_KEY)
 

    // const hbs = nodemailerExpressHandlebars

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME, 
        pass: process.env.MAIL_PASSWORD, 
        clientId: process.env.OAUTH_CLIENTID, 
        clientSecret: process.env.OAUTH_CLIENT_SECRET, 
        refreshToken: process.env.OAUTH_REFRESH_TOKEN  
      }
    });



 }



export default createNewEmail