const mysql = require("mysql2/promise");

const createStudentProfileTable = async (dbconnection) => {
    try {
        // Check if the 'users' table exists, and create it if it doesn't
        await dbconnection.execute(`
        CREATE TABLE IF NOT EXISTS profiles_student (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userid VARCHAR(100),
            first_name VARCHAR(50) DEFAULT '',
            last_name VARCHAR(50) DEFAULT '',
            college VARCHAR(100) DEFAULT '',
            course VARCHAR(50) DEFAULT '',
            branch VARCHAR(100) DEFAULT '',
            year INT DEFAULT NULL,
            cpi DECIMAL(4, 2) DEFAULT NULL,
            profile_picture VARCHAR(255) DEFAULT '',
            resume VARCHAR(255) DEFAULT '',
            project1_github_link VARCHAR(255) DEFAULT '',
            project1_project_link VARCHAR(255) DEFAULT '',
            project1_demo_link VARCHAR(255) DEFAULT '',
            project2_github_link VARCHAR(255) DEFAULT '',
            project2_project_link VARCHAR(255) DEFAULT '',
            project2_demo_link VARCHAR(255) DEFAULT '',
            github VARCHAR(255) DEFAULT '',
            linkedin VARCHAR(255) DEFAULT '',
            phoneNumber VARCHAR(15) DEFAULT '',
            address VARCHAR(100) DEFAULT '',
            city VARCHAR(50) DEFAULT '',
            country VARCHAR(50) DEFAULT '',
            postal_code VARCHAR(20) DEFAULT '',
            credit INT DEFAULT 10,
            FOREIGN KEY (userid) REFERENCES users_student(userid)
            )
        `);

        console.log("Student Profile table created or already exists.");
    } catch (error) {
        // throw new Error("Error creating users table: " + error.message);
        console.log("error in creating Profile table")
        return res.json({
            error: error.message
        })
    }
}


module.exports = { createStudentProfileTable }