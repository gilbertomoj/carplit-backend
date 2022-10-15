const nodemailer = require('nodemailer');
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, "..", "..", '.env') })

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_PASSWORD
    }
});

module.exports = transporter;