const User = require('../models/User');
const bcrypt =  require('bcryptjs');
const jwt =  require('jsonwebtoken');

// register
const register = async (req, res) => {
    try {
      console.log('Request body:', req.body); // Thêm log để kiểm tra dữ liệu gửi lên
      const { username, email, password } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide full username, email and password' });
      }

      // Check if user exists
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        return res.status(400).json({ message: 'email is already in use' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with default role 'user'
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: 'user',
      });

      res.status(200).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error('Error in register:', error);
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  };
const login = async(req, res) => {
        try{
            const { username,email, password} = req.body;
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
                { id: user.id, password:user.password},
                process.env.JWT_SECRET,
                { expiresIn: '10s'}
            );

            const refreshToken = jwt.sign(
                { id: user.id, password:user.password},
                process.env.JWT_SECRET,
                { expiresIn: '10s'}
            )
            res.status(200).json({
                message: 'Login successfully',
                accessToken: token,
                refreshToken,
                role: user.role,
                user: {
                    username: user.username,
                    email: user.email,
                },
            });
        } catch (error){
            res.status(500).json({ message: 'An error occurred', error: error.message });
        }
    };

const refreshToken = async (req, res) =>{
    try {
        const{ refreshToken } = req.body;

        if(!refreshToken){
            return res.status(401).json({ message: 'Refresh token not found'});
        }

        // verify refresh token
        let decode;
        try {
            decode = jwt.verify(refreshToken, process.env.JWT_SECRET);
        } catch(error){
            console.log("error in refresh token",error);
            return res.status(401).json({ message: 'Invalid refresh token'});
        }

        // depend on user to refresh token
        const user = await User.findOne({ where: { id: decode.id }});
        if(!user){
            return res.status(401).json({ message: 'User not found'});
        }

        // create a new access token
        const newAccessToken = jwt.sign(
            { id: user.id, password:user.password},
            process.env.JWT_SECRET,
            { expiresIn: '1h'}
        );
    } catch (error){
        console.log("error in refresh token",error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
}

const logout = async ( req, res) => {
    res.status(200).json({ message: 'Logout successfully'});
};

module.exports = {register,refreshToken, login,logout};