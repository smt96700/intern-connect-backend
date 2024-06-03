const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { query } = require('../dbconfig/dbconfig');

const sendMailtoStudent= async ({email, username}) => {
    try {
        // console.log("send email pe", req.body)
        // const { email, userId, username, userType } = req.body;
        console.log("email", email)
        // Generate hashed token

        const myEmail = process.env.MY_EMAIL;
        const myPassword = process.env.MY_PASSWORD;

        // Create a transporter object for nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: myEmail,
                pass: myPassword
            }
        });

        const mailOptions = {
            from: myEmail, 
            to: email,
            subject: 'New Password',
            html: `<p>Dear Student ${username}, your new Password is Test@123, use this password to reset your password.</p> `
        };

        // Send email
        const mailResponse = await transporter.sendMail(mailOptions);

        console.log("Mail has been sent");
        return mailResponse;

    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({
            status: 500,
            error: "Internal Server Error"
        }));
    }
};

module.exports = {sendMailtoStudent};
