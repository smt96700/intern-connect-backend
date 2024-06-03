const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const MailDeductInCredits = async({email, first_name, last_name, message}) => {
    try {
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
            subject: 'Deduction in SIP credits',
            html: `<p>Dear ${first_name} ${last_name}, your SIP credits have been dedicted because of the gollowing reason : ${message}</p> `
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
}

module.exports = {MailDeductInCredits};
