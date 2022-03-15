import nodemailer from "nodemailer"

export const sendEmail = async (options) =>{
    var transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
          user: "yerrumsetty.chandra.17cse@bml.edu.in",
          pass: process.env.MAIL_PASS
        }
      });

      const messagae = {
          from : "nodeAuth <noreply@noreplyauth.com>",
          to : options.email,
          subject : options.subject,
          text : options.message, 
      }

      await transport.sendMail(messagae);
}