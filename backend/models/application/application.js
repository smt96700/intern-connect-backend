const mysql = require("mysql2/promise");

const createApplicationTable = async (dbconnection) => {
  try {
    await dbconnection.execute(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        email VARCHAR(255) NOT NULL,
        coverLetter TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        address TEXT NOT NULL,
        resume_public_id VARCHAR(255) NOT NULL,
        resume_url VARCHAR(255) NOT NULL,
        applicantID VARCHAR(100) NOT NULL,
        employerID VARCHAR(100) NOT NULL,
        jobID INT NOT NULL,
        postedBy VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT name_min_length CHECK (CHAR_LENGTH(name) >= 3),
        CONSTRAINT name_max_length CHECK (CHAR_LENGTH(name) <= 30),
        CONSTRAINT chk_emp_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
        CONSTRAINT fk_applicantID FOREIGN KEY (applicantID) REFERENCES users_student(userid),
        CONSTRAINT fk_employerID FOREIGN KEY (employerID) REFERENCES company_list(cid) ON DELETE CASCADE,
        CONSTRAINT fk_postedBy_application FOREIGN KEY (postedBy) REFERENCES users_admin(userid),
        CONSTRAINT fk_jobID FOREIGN KEY (jobID) REFERENCES jobs(id) ON DELETE CASCADE
      )
    `);
  } catch (error) {
    console.log("Error at creating application table", error.message);
    return {
      error: error.message
    };
  }
};

module.exports = { createApplicationTable };
