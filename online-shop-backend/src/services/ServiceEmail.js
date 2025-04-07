// services/EmailService.js
const AWS = require('aws-sdk');
require('dotenv').config();

// Configurarea AWS SDK cu variabilele de mediu
AWS.config.update({
  region: process.env.AWS_REGION, // ex: 'eu-west-1'
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Creăm un client SES
const ses = new AWS.SES();

/**
 * Trimite un email folosind Amazon SES.
 * @param {string} to - Adresa de destinație.
 * @param {string} subject - Subiectul emailului.
 * @param {string} bodyText - Conținutul emailului în format text.
 * @param {string} [bodyHtml] - (Opțional) Conținutul emailului în format HTML.
 * @returns {Promise} - Returnează promisiunea cu rezultatul trimiterii emailului.
 */
const sendEmail = async (to, subject, bodyText, bodyHtml) => {
  // Parametrii pentru SES
  const params = {
    Source: 'mail@aat.digital', // Adresa sursă trebuie să fie verificată în Amazon SES
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: { Data: subject },
      Body: {},
    },
  };

  // Dacă se furnizează conținut HTML, folosim HTML; altfel, folosim text simplu
  if (bodyHtml) {
    params.Message.Body.Html = { Data: bodyHtml };
  } else {
    params.Message.Body.Text = { Data: bodyText };
  }

  try {
    const data = await ses.sendEmail(params).promise();
    console.log('Email trimis cu succes:', data);
    return data;
  } catch (error) {
    console.error('Eroare la trimiterea emailului:', error);
    throw error;
  }
};

module.exports = { sendEmail };
