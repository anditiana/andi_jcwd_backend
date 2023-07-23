const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth :{
    user : process.env.MAIL_TRANSPORT,
    pass : process.env.MAIL_TRANSPORT_CREDENTIAL,  
  },
  tls : {
    rejectUnauthorized : false
  }
});

module.exports = transporter;

