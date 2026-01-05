const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (to, subject, text) => {
  await tranEmailApi.sendTransacEmail({
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: "Foodiee 🍔",
    },
    to: [{ email: to }],
    subject,
    textContent: text,
  });
};

module.exports = sendEmail;
