// Define your Express middleware function
const {decodejwt} = require('../helpers/decodejwt')
const { query } = require("../dbconfig/dbconfig");

const requireAuth = async (req, res, next) => {
    const decodedToken = await decodejwt(req)

    if (!decodedToken) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    const userid = decodedToken.userid;  
    const userType = decodedToken.userType;
    const username= decodedToken.username;
    const tableType = {
        'student': 'users_student',
        'admin': 'users_admin'
    };
    try {
        const matchid = `
            SELECT * FROM ${tableType[userType]}
            WHERE userid = ?
        `

        const user = await query({
            query: matchid,
            values: [userid]
        })
        if (user.length == 0) {
            throw new Error("Request token is not authorized")
        }
        const currUser= {userid: userid, userType: userType, username: username};
        req.user= currUser;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request is not Authorized' });
    }
}

// Export the middleware function
module.exports = {requireAuth};
