const nodeMailer = require("nodemailer");
const path = require("path");

module.exports = async (emailOptions) => {
  try {
    const transport = nodeMailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      post: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS,
      },
    });

    transport.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("email sent: " + info.response);
        console.log("Email sent successfully");
      }
    });
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};
