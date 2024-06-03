const mysql = require("mysql2/promise");

const createJobTable = async (dbconnection) => {
    try {
        await dbconnection.execute(`
            CREATE TABLE IF NOT EXISTS jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(30) NOT NULL,
                description VARCHAR(500) NOT NULL,
                category VARCHAR(255) NOT NULL,
                country VARCHAR(255) NOT NULL,
                state VARCHAR(255) NOT NULL,
                city VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                fixedSalary DECIMAL(15, 2),
                salaryFrom DECIMAL(15, 2),
                salaryTo DECIMAL(15, 2),
                expired BOOLEAN DEFAULT FALSE,
                jobPostedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
                companyName VARCHAR(100) NOT NULL,
                postedBy VARCHAR(100) NOT NULL,
                CONSTRAINT fk_companyName FOREIGN KEY (companyName) REFERENCES company_list(name) ON DELETE CASCADE,
                CONSTRAINT fk_postedBy FOREIGN KEY (postedBy) REFERENCES users_admin(userid),
                CONSTRAINT title_min_length CHECK (CHAR_LENGTH(title) >= 3),
                CONSTRAINT description_min_length CHECK (CHAR_LENGTH(description) >= 30),
                CONSTRAINT location_min_length CHECK (CHAR_LENGTH(location) >= 20),
                CONSTRAINT fixedSalary_min_digits CHECK (fixedSalary >= 1000),
                CONSTRAINT fixedSalary_max_digits CHECK (fixedSalary <= 999999999),
                CONSTRAINT salaryFrom_min_digits CHECK (salaryFrom >= 1000),
                CONSTRAINT salaryFrom_max_digits CHECK (salaryFrom <= 999999999),
                CONSTRAINT salaryTo_min_digits CHECK (salaryTo >= 1000),
                CONSTRAINT salaryTo_max_digits CHECK (salaryTo <= 999999999)
            )
        `);
    } catch (error) {
        return {
            error: error.message
        };
    }
};

module.exports = { createJobTable };
