const mysql = require("mysql2/promise");

const createMessageTable = async (dbconnection) => {
    try {
        // Check if the 'users' table exists, and create it if it doesn't
        await dbconnection.execute(`
        CREATE TABLE IF NOT EXISTS messages (
            messageid INT AUTO_INCREMENT PRIMARY KEY,
            to_username VARCHAR(50) NOT NULL,
            from_username VARCHAR(50) NOT NULL,
            message VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_to_user FOREIGN KEY (from_username) REFERENCES users_student(username) ON DELETE CASCADE,
            CONSTRAINT fk_from_user FOREIGN KEY (to_username) REFERENCES users_admin(username) ON DELETE CASCADE
        );
        `);

        console.log("Message table created or already exists.");
    } catch (error) {
        // throw new Error("Error creating users table: " + error.message);
        console.log("hello Message table error")
        return res.json({
            error: error.message
        })
    }
}


module.exports = { createMessageTable }