const asyncHandler = require("express-async-handler");

//@desc Login User
//@route GET /api/users/testAuthRole
//@access private
const authRoleTest = asyncHandler(async (req,res,next) => {
    const {role} = req.user;
    if(role==="user"){
        res.status(201).json({role:role,message:"this is user!"});
    }else if(role==="admin"){
        res.status(201).json({role:role,message:"this is admin!"});
    }else{
        res.status(403);
        throw new Error("Method Not Allowed For You!");
    }
})

module.exports = {
    authRoleTest
};