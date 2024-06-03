const express = require('express');
const { query } = require("../dbconfig/dbconfig");
const { v4: uuidv4 } = require('uuid');
const { decodejwt } = require("../helpers/decodejwt")
const { MailDeductInCredits } = require('../helpers/MailDeductInCredits')

const dashboard = async(req, res) => {
    try {
        const userid = req.query.userid;


        const getAdmin = `
            SELECT u.username, u.email, p.*
            FROM users_admin u
            INNER JOIN profiles_admin p 
            ON u.userid = p.userid
            WHERE u.userid = ?
        `

        const admin = await query({
            query : getAdmin,
            values : [userid]
        })

        console.log("Admin Profile : ", admin[0])

        return res.status(200).json({
            message : admin[0]
        })

    } catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({
            error: error.message,
        });
    }
}
const addStudent = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        console.log("dataaaaaa", username, password, email)
        // Search for the student in the database
        const searchUser = `
            SELECT * FROM users_student
            WHERE username= ?`;
        console.log("line13 pe hai");
        const user = await query({
            query: searchUser,
            values: [username]
        });
        console.log("line 18 pe hai");
        if (user && user.length > 0) {
            console.log("Student exist already");
            return res.status(400).json({
                message: "Student already exists",
                status: '400'
            });
        }
        const userid = uuidv4();
        // Create student record in the table
        const insertStudentQuery = `
            INSERT INTO users_student
            (username, password, email, userid)
            VALUES(?, ?, ?, ?)
        `;
        console.log("line34 pe hai");
        const newUser = await query({
            query: insertStudentQuery,
            values: [username, password, email, userid]
        });
        let message = "";
        if (newUser.affectedRows) {
            message = "success";
        } else {
            message = "error";
        }
        console.log("new User added", newUser);
        return res.json({
            user: { username, email, userid }
        });

    } catch (error) {
        console.error("Error adding student to the database:", error);
        return res.status(500).json({
            status: 500,
            error: "Internal Server Error"
        });
    }
};

const deductCredit = async (req, res) => {
    try {
        const { first_name, last_name, email, userid, credit, message } = req.body;
        console.log(userid, ':', credit, ":", message)
        const deduct_credit = `
            UPDATE profiles_student
            SET credit = ?
            WHERE userid = ?
        `

        const updatedUser = await query({
            query: deduct_credit,
            values: [credit, userid]
        })
        if (updatedUser.affectedRows == 1) {
            //send mail to student
            await MailDeductInCredits({ email: email, first_name: first_name, last_name: last_name, message: message })
        }

        console.log("User whose credit is deducted: ", updatedUser)
        return res.status(200).json({
            message: "Credits deducted successfully"
        })
    } catch (error) {
        console.error("Error deducting credits:", error);
        return res.status(500).json({
            status: 500,
            error: "Internal Server Error"
        });
    }
}

const createProfile = async (req, res) => {
    try {
      const { userid } = req.body;
      console.log("UserId in creating Profile: ", userid)
      const query1 = `
      INSERT INTO profiles_admin (userid)
      VALUES (?)
      `
  
      const user = await query({
        query: query1,
        values: [userid]
      })
  
      const query2 = `
        UPDATE users_admin
        SET profilecreated = 1
        WHERE userid = ?
      `
  
      const updatedUser = await query({
        query: query2,
        values: [userid]
      })
  
      res.status(200).json({
        user: user[0]
      })
    } catch (error) {
      console.log("Error in creating Profile", error);
      res.status(500).json({
        message: error.message,
      })
    }
  }
const updateProfile = async (req, res) => {
    console.log("Inside update Profile")
    try {
        const {
            userid,
            first_name,
            last_name,
            designation,
            phone_number,
            linkedin,
            profile_picture_path,
        } = req.body;

        // Initialize query parts
        const queryParts = [];
        const values = [];

        // Helper function to add a field to the query and values if it's not an empty string
        const addFieldToUpdate = (field, value) => {
            if (value !== undefined && value !== '') {
                queryParts.push(`${field} = ?`);
                values.push(value);
            }
        };

        // Add fields to the query if they are not empty
        addFieldToUpdate('first_name', first_name);
        addFieldToUpdate('last_name', last_name);
        addFieldToUpdate('designation', designation);
        addFieldToUpdate('phone_number', phone_number);
        addFieldToUpdate('linkedin', linkedin);
        addFieldToUpdate('profile_picture_path', profile_picture_path);

        // If there are no fields to update, return an error
        if (queryParts.length === 0) {
            return res.status(200).json({ message: 'No fields to update' });
        }

        // Add the userid to the values array for the WHERE clause
        values.push(userid);

        // Construct the final query
        const updateProfileQuery = `
      UPDATE profiles_admin
      SET ${queryParts.join(', ')}
      WHERE userid = ?
    `;

        // Execute the query
        await query({
            query: updateProfileQuery,
            values: values
        });

        const getQuery = `
            SELECT u.username, u.email, p.*
            FROM users_admin u
            INNER JOIN profiles_admin p
            ON u.userid = p.userid
            WHERE u.userid = ?
        `

        const user = await query({
            query : getQuery,
            values : [userid]
        })

        res.status(200).json({ message: 'Profile Updated Successfully', info : user[0] });
    } catch (error) {
        console.error('Error in updating profile', error);
        res.status(500).json({
            error: error.message,
            status: 500
        });
    }
}



module.exports = { dashboard, addStudent, deductCredit, updateProfile, createProfile }
