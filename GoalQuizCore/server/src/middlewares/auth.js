const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const auth = permission => {
    return (req,res,next) => {
        const {role} = req.user;
        console.log(role);
        
        if(!role){
            res.status(400);
            throw new Error('you need sign in');
        }
        if(!permission.includes(role)){
            res.status(401);
            throw new Error("you don't have permission");
        }
        next();
    }
}

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findByPk(decoded.user.id); // Lấy dữ liệu mới nhất từ database
        if (!req.user) {
          res.status(401);
          throw new Error('Not authorized, user not found');
        }
        next();
      } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    } else {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  });

module.exports = {auth, protect};