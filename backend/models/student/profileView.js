const mysql = require("mysql2/promise");

const studentProfileViewTable = async (dbconnection) => {
    try {
        await dbconnection.execute(`DROP VIEW IF EXISTS profiles_student_view;`);
        await dbconnection.execute(`
            CREATE VIEW profiles_student_view AS
            SELECT 
                u.userid,
                u.username,
                u.email,
                p.first_name,
                p.last_name,
                p.college,
                p.branch,
                p.year,
                p.cpi,
                p.profile_picture,
                p.resume,
                p.project1_github_link,
                p.project1_project_link,
                p.project1_demo_link,
                p.project2_github_link,
                p.project2_project_link,
                p.project2_demo_link,
                p.github,
                p.linkedin,
                p.phoneNumber,
                p.address,
                p.city,
                p.country,
                p.postal_code,
                p.credit,
                p.course
            FROM 
                users_student u
            JOIN 
                profiles_student p ON u.userid = p.userid;
        `)

        console.log("Student Profile View table created or already exists.");
    } catch (error) {
        console.log("error in creating Profile View table")
        return res.json({
            error: error.message
        })
    }
}

module.exports = { studentProfileViewTable }
