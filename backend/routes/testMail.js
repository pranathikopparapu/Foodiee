const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.get("/test-mail", async (req, res) => {
  try {
    await sendEmail(
      "YOUR_EMAIL@gmail.com",
      "Test Email 🚀",
      "If you got this, nodemailer works."
    );
    res.json("Mail sent");
  } catch (err) {
    console.log(err);
    res.status(500).json("Mail failed");
  }
});

module.exports = router;
