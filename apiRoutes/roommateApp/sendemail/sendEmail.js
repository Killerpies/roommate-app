let express = require("express");
const nodeMailer = require('nodemailer');
const router = express.Router()
// bodyParser = require('body-parser');

// let app = express();

// app.use(express.static('src'));

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

router.post('/', function (req, res) {
    let recipient = req.body.recipient
    let subject = req.body.subject
    let body = req.body.body

  let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          // should be replaced with real sender's account
          user: `${process.env.EMAIL_ACCOUNT}`,
          pass: `${process.env.EMAIL_PASSWORD}`
      }
  });
  let mailOptions = {
      // should be replaced with real recipient's account
      to: `${recipient}`,
      subject: `${subject}`,
      text: `${body}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
  res.writeHead(301, { Location: 'index.html' });
  res.end();
});

module.exports = router