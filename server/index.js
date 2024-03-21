const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { recipientEmail, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password'
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: recipientEmail,
    subject: 'Email Subject',
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});