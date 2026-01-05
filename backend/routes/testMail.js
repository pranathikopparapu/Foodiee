const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.get("/test-mail", async (req, res) => {
  try {
    await sendEmail(
      "2200031156cseh@gmail.com",
      "Test Email 🚀",
      "Brevo HTTP API is working successfully!"
    );
    res.json("Mail sent");
  } catch (err) {
    console.error(err);
    res.status(500).json("Mail failed");
  }
});

module.exports = router;   // ✅ THIS IS CRITICAL
