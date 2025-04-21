const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const util = require("util");

const verifyJwt = util.promisify(jwt.verify);

const validateAccessToken = asyncHandler(async (req, res, next) => {
  try {
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(400);
      throw new Error("Access Token not found");
    }

    let token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("User is not authorized or token is missing!");
    }

    const decoded = await verifyJwt(token, process.env.JWT_SECRET_KEY);
    const email = decoded.user.email;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    req.user = user.get();
    next();
  } catch (error) {
    res.status(401);
    next(error); 
  }
});

module.exports = { validateAccessToken };