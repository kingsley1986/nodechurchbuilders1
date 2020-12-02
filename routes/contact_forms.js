const express = require("express");
const router = express.Router();
const ContacForm = require("../models/contact_form");
const fs = require("fs");
const path = require("path");
const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
require("dotenv").config();
const axios = require("axios");

router.get("/new", (req, res) => {
  res.json(form);
});

router.post("/", async (req, res) => {
  if (!req.body.token) {
    return res.status(400).json({ error: "reCaptcha token is missing" });
  }

  try {
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}
    &response=${req.body.token}`;
    console.log("htis is the google url", googleVerifyUrl);

    // console.log(googleVerifyUrl);
    const response = await axios.post(googleVerifyUrl);
    const { success } = response.data;

    if (success) {
      const output = `
      <h1>You Have a New Prayer Request</h1>
      <h3>Contact Details </h3>
      <ul>
          <li><h1>Name: ${req.body.name}</h1></li>
          <li>Email: ${req.body.email}</li> 
      </ul>
      <h3>Prayer Request</h3>
      <p>Request: ${req.body.request}</p>`;

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: "chukwumakingsley1@gmail.com",
        from: "chukwumakingsley1@gmail.com",
        subject: "Prayer Request",
        text: output,
        html: output,
      };

      sgMail
        .send(msg)
        .then(() => {
          //Celebrate
          res.json(contactForm);
          console.log("Email Sent!");
        })
        .catch((error) => {
          //Log friendly error
          console.error(error.toString());
          console.log(output);

          //Extract error msg
          const { message, code, response } = error;

          //Extract response msg
          const { headers, body } = response;
        });
      return res.json({ success: true });
    } else {
      return res.status(400).json({ error: "Invalid Captcha. Try again." });
    }
  } catch (e) {
    return res.status(400).json({ error: "reCaptcha error." });
  }

  const output = `
        <h1>You Have a New Prayer Request</h1>
        <h3>Contact Details </h3>
        <ul>
            <li><h1>Name: ${req.body.name}</h1></li>
            <li>Email: ${req.body.email}</li> 
        </ul>
    <h3>Prayer Request</h3>
    <p>Request: ${req.body.request}</p>
    `;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "chukwumakingsley1@gmail.com",
    from: "chukwumakingsley1@gmail.com",
    subject: "Prayer Request",
    text: output,
    html: output,
  };

  sgMail
    .send(msg)
    .then(() => {
      //Celebrate
      res.json(contactForm);
      console.log("Email Sent!");
    })
    .catch((error) => {
      //Log friendly error
      console.error(error.toString());
      console.log(output);

      //Extract error msg
      const { message, code, response } = error;

      //Extract response msg
      const { headers, body } = response;
    });
});

module.exports = router;
