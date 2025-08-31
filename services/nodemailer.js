const nodemailer = require("nodemailer");

const mailSender = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "mervalinteligente@gmail.com",
      pass: "cvppvggbugeylrrs",
    },
  });

  const mailOptions = {
    from: "mervalinteligente@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return { message: "Success!" };
  } catch (err) {
    console.error("Error en el envío:", err);
    throw new Error(`Error: ${err}`);
  }
};

module.exports = { mailSender };
