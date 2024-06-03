const mysql = require("mysql2/promise");

const createStudentUserTable = async(dbconnection) => {
    try {
        // Check if the 'users' table exists, and create it if it doesn't
        await dbconnection.execute(`
            CREATE TABLE IF NOT EXISTS users_student (
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                resetpassword BOOLEAN DEFAULT FALSE,
                profilecreated BOOLEAN DEFAULT FALSE,
                userid VARCHAR(100) PRIMARY KEY,
                verifytoken VARCHAR(100)
            )
        `);

        console.log("Users table created or already exists.");
    } catch (error) {
        // throw new Error("Error creating users table: " + error.message);
        console.log("error in creating createStudent table")
        return res.json({
            error: error.message
        })
    }
}


module.exports= {createStudentUserTable}