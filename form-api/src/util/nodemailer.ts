import nodemailer from "nodemailer"
import { BaseError } from "./errorHandler";

const {
  MAILER_USER,
  MAILER_PASS,
  MAILER_PORT
} = process.env

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: Number(MAILER_PORT),
  secure: false,
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASS,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMailCode(verificationCode: number):Promise<any> {
  // send mail with defined transport object
  let result = null;
  try {
   
  const info = await transporter.sendMail({
    from: '"Form Builder", postmaster@sandboxe5f9315fd77541aabc4a754872b50224.mailgun.org', // sender address
    to: "ahmdabozed88@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello", // plain text body
    html: `<b>The Code is ${verificationCode}</b>`, // html body
  });
  /* (err, info) => {
    console.log("inside nodemailer config: "+ verificationCode)
    if (err) {
      console.log(err)
    } else {
      console.log(info)
      result = info

    }
  }*/
  console.log("info is ")
  console.log(info)
  return info 
  } catch (error) {
    console.log(error)
    return
  }
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

export default sendMailCode;