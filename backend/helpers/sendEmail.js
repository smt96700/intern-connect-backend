const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcryptjs = require('bcryptjs');
const { query } = require('../dbconfig/dbconfig');

const sendEmail= async ({email, userId, username, userType}) => {
    try {
        // console.log("send email pe", req.body)
        // const { email, userId, username, userType } = req.body;
        console.log("email", email)
        // Generate hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        // Attach token to the user
        const tableType = {
            'student': 'users_student',
            'admin': 'users_admin'
        };

        const updateTokenQuery = `
            UPDATE ${tableType[userType]} 
            SET verifytoken = ?
            WHERE username = ?
        `;

        // Execute the update query to update the verifytoken field
        await query({
            query: updateTokenQuery,
            values: [hashedToken, username]
        });

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
            subject: 'Reset your password',
            html: `<p>Click <a href="${process.env.DOMAIN}/reset-password?token=${hashedToken}&userType=${userType}">here</a> to reset your password or copy and paste the below link in your browser,
                <br>${process.env.DOMAIN}/reset-password?token=${hashedToken}&userType=${userType}</p> `
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

module.exports = {sendEmail};
