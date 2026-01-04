const nodemailer = require("nodemailer");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS EXISTS:", !!process.env.EMAIL_PASS);


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Verify transporter ONCE (important for Render)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail transporter error:", error.message);
  } else {
    console.log("✅ Mail transporter ready");
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Foodiee 🍔" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};

module.exports = sendEmail;
