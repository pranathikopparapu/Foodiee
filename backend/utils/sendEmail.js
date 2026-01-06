const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📤 Sending mail to:", to);
    console.log("📤 Using sender:", process.env.BREVO_SENDER_EMAIL);

    const response = await tranEmailApi.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "Foodiee 🍔",
      },
      to: [{ email: to }],
      subject,
      textContent: text,
    });

    console.log("✅ BREVO RESPONSE:", response);
  } catch (err) {
    console.error("❌ BREVO ERROR FULL:", err);
    console.error("❌ BREVO ERROR BODY:", err?.response?.body);
  }
};

module.exports = sendEmail;
