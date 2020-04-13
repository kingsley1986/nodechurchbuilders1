const express = require('express')
const router = express.Router()
const ContacForm = require('../models/contact_form')
const fs = require('fs')
const path = require('path')
const sgMail = require('@sendgrid/mail');
const nodemailer = require("nodemailer");


router.get('/new', (req, res) => {
    res.render("contact_form/new") 
})

router.post('/', (req, res) => {
    const output = `
        <p>You have a new Request</p>
        <h3>Contact Details </h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li> 
        /ul>
    <h3>Message</h3>
    <li>Request: ${req.body.request}</li>
    `;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: 'chukwumakingsley1@gmail.com',
      from: 'chukwumakingsley1@gmail.com',
      subject: 'Hello world',
      text: output
    };
    
    sgMail
      .send(msg)
      .then(() => {
        //Celebrate
        res.render("contact_form/new")
        console.log('Email Sent!');
      })    
      .catch(error => {
    
        //Log friendly error
        console.error(error.toString());
        console.log(output)
    
        //Extract error msg
        const {message, code, response} = error;
    
        //Extract response msg
        const {headers, body} = response;
      });
});

module.exports = router;
