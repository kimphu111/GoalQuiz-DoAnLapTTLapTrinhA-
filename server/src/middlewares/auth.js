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

module.exports = {auth}