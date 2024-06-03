const mysql = require("mysql2/promise");
const {createStudentUserTable} = require("../models/student/user");
const {createAdminUserTable} = require("../models/admin/user");
const {createMessageTable}= require("../models/messages/structure");
const { createStudentProfileTable } = require("../models/student/profile");
const { studentProfileViewTable } = require("../models/student/profileView");
const {createJobTable}= require('../models/job/job')
const {createApplicationTable}= require("../models/application/application")
const {createAdminProfileTable} = require("../models/admin/profile")
async function query({ query, values = [] }) {
    console.log("hello database")
    const dbconnection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,  
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
    });
    console.log("Helllooooo")
     
    try {
        if (query.toLowerCase().includes('users_student')) {
            console.log("Creating student user table");
            await createStudentUserTable(dbconnection);
        }
        if (query.toLowerCase().includes('users_admin')) {
            console.log("Creating admin user table");
            await createAdminUserTable(dbconnection);
        }
        if (query.toLowerCase().includes('messages')) {
            console.log("Creating message table");
            await createMessageTable(dbconnection);
        }
        if (query.toLowerCase().includes('jobs')) {
            console.log("Creating jobs table");
            await createJobTable(dbconnection);
        }

        if (query.toLowerCase().includes('applications')) {
            console.log("Creating applications table");
            await createApplicationTable(dbconnection);
        }
        if (query.toLowerCase().includes('profiles_student')) {
            console.log("Updating Profile")
            await createStudentProfileTable(dbconnection)
        }
        if (query.toLowerCase().includes('profiles_student_view')) {
            console.log("Seeing Profile View Table")
            await studentProfileViewTable(dbconnection)
        }
        if (query.toLowerCase().includes('profiles_admin')) {
            console.log("Creating admin Profile")
            await createAdminProfileTable(dbconnection)
        }

        // Execute the original query
        console.log("This is line 30 in dbconfig");
        const [results] = await dbconnection.execute(query, values);

        // Close the database connection
        dbconnection.end();

        return results;
    } catch (error) {
        console.log("Error in dbconfig line 38");
        throw new Error(error.message);
    }
}

module.exports = { query };
