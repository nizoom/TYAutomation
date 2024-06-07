import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import "nodemailer-express-handlebars";
// import nodemailerExpressHandlebars from "nodemailer-express-handlebars";
import fs from "fs";
import handlebars from "handlebars";
import { addRecord } from "../utils/addemailrecord.js";

async function createNewEmail(donation, sendResponseFromNodeMailerToClient) {
  console.log("inside nodemailer");
  dotenv.config({ path: "../.env" });

  //get corresponding email template

  const readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
        console.log(err);
        callback(err, null);
        throw err;
      } else {
        callback(null, html);
      }
    });
  };

  const __dirname = path.resolve();

  readHTMLFile(
    __dirname + `/emails/templates/${donation.templateName}.handlebars`,
    async function (err, html) {
      const template = handlebars.compile(html);

      //the properties of the obj are used to plug into the template
      const replacements = donation;
      // console.log(
      //   "🚀 ~ file: nodemailer.js:37 ~ recpientName:",
      //   donation.recipientName
      // );

      const htmlToSend = template(replacements);

      let mailOptions = {
        from: "cohen@commonthreadsproject.org", //
        to: ["nissimram1812@gmail.com"], // donation.TYToEmailAddress], //['cohen@commonthreadsproject.org']'nissimram1812@gmail.com
        bcc: ["nissimram1812@gmail.com"], //
        subject: donation.emailSubject,
        text: "",
        html: htmlToSend,
      };

      return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PW,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
          },
        });

        transporter.sendMail(mailOptions, function (err, data) {
          if (err) {
            console.log("Error " + err.message);
            addRecord(donation, false);
            sendResponseFromNodeMailerToClient(err);
            reject(err);
          } else {
            console.log("Email sent successfully");
            addRecord(donation, true);
            sendResponseFromNodeMailerToClient(data);
            resolve(data.response);
          }
        });
      });
    }
  );
}

export default createNewEmail;
