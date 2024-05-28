const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

const sendOTPByEmail = async (email, otp) => {
    const mailOptions = {
        from: "thanhquangnguyenhien@gmail.com",
        to: email, 
        subject: "Mã OTP khôi phục mật khẩu",
      text: `Mã OTP của bạn là: ${otp}`
    };
  
    await transporter.sendMail(mailOptions);
};

module.exports =   sendOTPByEmail ;