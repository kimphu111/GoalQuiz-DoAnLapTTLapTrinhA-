const User = require('../models/User');
const bcrypt =  require('bcryptjs');
const jwt =  require('jsonwebtoken');

// register
const register = async(req, res) => {
    try{
        const{ username, email, password, role } = req.body;
        //check user exist
        const userExist = await user.findOne({ where: { email}});
        if(existingUser){
            return res.status(400).json({message: 'Email is already in used'});
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //create user with default is user
        const user = await User.create({
            username,
            email,
            passwword: hashedPassword,
            role: 'user',
        });

        res.status(200).json({ message: 'User created successfully' , user});
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};
const login = async(req, res) => {
        try{
            const { email, password} = req.body;

            // check user by email
            const user = await User.findOne({where: { email }});
            if(!user){
                return res.status(400).json({ message: 'User not found'});
            }

            // check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch){
                return res.status(400).json ({ message: ' Invalid password'});
            }

            // create token JWT include role in payload
            const token = jwt.sign(
                { id: user.id, role: user.role},
                process.env.JWT_SECRET,
                { expiresIn: '1h'}
            );

            res.status(200).json({
                meesage: 'login successfully',
                token,
                role: user.role,
            });
        } catch (error){
            res.status(500).json({ message: 'An error occurred', error: error.message });
        }
    };

const logout = async ( req, res) => {
    res.status(200).json({ message: 'Logout successfully'});
};

module.exports = {register,  login, logout};