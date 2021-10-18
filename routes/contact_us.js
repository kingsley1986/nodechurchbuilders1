var express = require("express");
var router = express.Router();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/", async (req, res) => {
  const output = `
      <h1>You Have a New Contact Email</h1>
         <h2>Subject: ${req.body.subject}</h2>
            <li>Message: ${req.body.message}</li> 
      <h3>Contact Details </h3>
        <ul>
            <li><h1>Name: ${req.body.name}</h1></li>
            <li>Email: ${req.body.email}</li> 
            <li>phone: ${req.body.phone}</li> 
         
        </ul>`;
  const msg = {
    to: "chukwumakingsley1@gmail.com", // Change to your recipient
    from: "chukwumakingsley1@gmail.com", // Change to your verified sender
    subject: "Contact Form",
    text: output,
    html: output,
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error);
    });
});

module.exports = router;
