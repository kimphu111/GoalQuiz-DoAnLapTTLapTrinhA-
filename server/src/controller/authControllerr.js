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
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ username, email và password' });
      }
  
      // Check if user exists
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        return res.status(400).json({ message: 'Email is already in use' });
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
      console.error('Error in register:', error); // Thêm log lỗi chi tiết
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  };
const login = async(req, res) => {
        try{
            const { username, password} = req.body;
            // check user by email
            const user = await User.findOne({where: { username }});
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