const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateRefreshToken = asyncHandler(async(req,res,next) =>{
    
    try {
        const cookie = req.cookies.refreshToken;
        let decodedData;
        decodedData = jwt.verify(cookie, process.env.REFRESH_SECRET_KEY);
        req.user = decodedData.user;
        next();
    } catch (err) {
        res.status(401);
        throw new Error("User is not authorized - invalid token");
    }
});

module.exports = {validateRefreshToken}