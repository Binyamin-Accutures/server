const nodeMailer = require("nodemailer");

module.exports = async ({email,text,subject,html}) => {
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

    await transport.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: text,
        html: html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};
