const mysql = require("mysql2/promise");
const createAdminUserTable = async(dbconnection) => {
    try {
        await dbconnection.execute(`
           CREATE TABLE IF NOT EXISTS users_admin(
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(50) UNIQUE NOT NULL,
            resetpassword BOOLEAN DEFAULT FALSE,
            userid VARCHAR(100) PRIMARY KEY,
            verifytoken VARCHAR(100),
            profilecreated BOOLEAN DEFAULT FALSE
        )
           `);
    } catch (error) {
        return res.json({
            error: error.message
        })
    }
}

module.exports={createAdminUserTable}