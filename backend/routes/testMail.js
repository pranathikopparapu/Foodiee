const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.get("/test-mail", async (req, res) => {
  await sendEmail(
    "yourgmail@gmail.com",
    "Foodiee Test Mail 🚀",
    "Mail system working correctly!"
  );

  res.json("Mail sent");
});

module.exports = router;
