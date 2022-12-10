import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import "nodemailer-express-handlebars";
import nodemailerExpressHandlebars from "nodemailer-express-handlebars";
import fs from "fs";
import handlebars from "handlebars";
import { rejects } from "assert";

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

      const htmlToSend = template(replacements);

      let mailOptions = {
        from: "cohen@commonthreadsproject.org", //
        to: donation.TYToEmailAddress, //['info@commonthreadsproject.org', donation.TYToEmailAddress],['cohen@commonthreadsproject.org']
        bcc: ["nissimram1812@gmail.com", "info@commonthreadsproject.org"], //
        subject: donation.emailSubject,
        text: "",
        html: htmlToSend,
      };

      return new Promise((resolve, reject) => {
        console.log({
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PW,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        });
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
            reject(err);
            // return `${donation} failed to send`
            sendResponseFromNodeMailerToClient(err);
          } else {
            console.log("Email sent successfully");
            // console.log(data.response)
            sendResponseFromNodeMailerToClient(data);
            resolve(data.response);

            // return `${donation} was successfully sent`
          }
        });
      });
    }
  );
}

export default createNewEmail;
