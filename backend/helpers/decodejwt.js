const jwt = require('jsonwebtoken');

const decodejwt = (req, res, next) => {
    try {

        let token = req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')) : null;
        console.log("token in decode jwt: ",token)
        if (!token) {
            return null;
        }
        token = token.split('=')[1]
        
        // console.log("token" ,token)

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("decoded token : ", decodedToken);
        
        // Attach the decoded token to the request object for further processing
        return decodedToken
    } catch (error) {
        console.error("Error decoding token:", error);
        // return res.status(500).json({
        //     error: error.message,
        //     status: 500
        // });
    }
};

module.exports = {decodejwt};