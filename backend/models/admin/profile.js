const mysql = require("mysql2/promise");
const createAdminProfileTable = async(dbconnection) => {
    try {
        await dbconnection.execute(`
           CREATE TABLE IF NOT EXISTS profiles_admin(
            id INT AUTO_INCREMENT PRIMARY KEY,
            userid VARCHAR(100),
            first_name VARCHAR(50) DEFAULT '',
            last_name VARCHAR(50) DEFAULT '',
            designation VARCHAR(100) DEFAULT '',
            profile_picture_path VARCHAR(255) DEFAULT '',
            linkedin VARCHAR(255) DEFAULT '',
            phone_number VARCHAR(15) DEFAULT '',
            FOREIGN KEY (userid) REFERENCES users_admin(userid)
        )
           `);
    } catch (error) {
        console.log("Error in creating Admin Profile Table")
        return res.json({
            error: error.message
        })
    }
}

module.exports={createAdminProfileTable}