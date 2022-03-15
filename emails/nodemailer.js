import nodemailer from 'nodemailer'

import dotenv from "dotenv";

import path from 'path';

import 'nodemailer-express-handlebars'

import nodemailerExpressHandlebars from 'nodemailer-express-handlebars';

import fs from 'fs'

import handlebars from 'handlebars'
import { rejects } from 'assert';




async function createNewEmail(donation){


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

  const emailResult = await readHTMLFile(__dirname + `/emails/templates/${donation.templateName}.handlebars`, async function(err, html){

    const template = handlebars.compile(html);

    //the properties of the obj are used to plug into the template 
    const replacements = donation;

    const htmlToSend = template(replacements);

    let mailOptions = {

      from: 'cohen@commonthreadsproject.org', //ThankYouFromCTP@outlook.com' ALL TESTING USE THIS EMAIL 
      to: donation.TYToEmailAddress,//['info@commonthreadsproject.org', donation.TYToEmailAddress],  //['cohen@commonthreadsproject.org'],//'cohen@commonthreadsproject.org'], 
      bcc : ['nissimram1812@gmail.com'],//, 'info@commonthreadsproject.org'],
      subject: donation.emailSubject,
      text: '',
      html: htmlToSend,

    };

    return await new Promise((resolve, reject) =>{
      
      transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
          console.log("Error " + err);
          reject(err)
          return `${donation} failed to send`

        } else {
          console.log("Email sent successfully");
          resolve(data)

          return `${donation} was successfully sent`
        }

      });

    })

  })

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

    return emailResult;

 }



export default createNewEmail