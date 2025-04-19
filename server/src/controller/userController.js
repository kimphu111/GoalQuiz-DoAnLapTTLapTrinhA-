const { User, UserInformation } = require('../models/User'); // Sửa import
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

//@desc Register User
//@route POST api/auth/register
//@access public
const register = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { username, email, password } = req.body;

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

//@desc Login User
//@route POST api/auth/login
//@access public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create JWT token including role in payload
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

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
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

//@desc Get information of this user
//@route GET api/auth/profile
//@access private
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Lấy thông tin từ userInformation
        const userInfo = await UserInformation.findOne({ where: { email: user.email } });

        res.status(200).json({
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
                firstName: userInfo?.firstName || '',
                lastName: userInfo?.lastName || '',
                phone: userInfo?.phone || '',
                address: userInfo?.address || '',
            },
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

//@desc Update User Profile
//@route POST api/auth/profile
//@access private
const updateUserProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address } = req.body;
        const userId = req.user.id;

        // Kiểm tra các trường bắt buộc
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ message: 'First Name, Last Name, và Email là bắt buộc.' });
        }

        // Kiểm tra email có khớp với người dùng hiện tại
        const user = await User.findByPk(userId);
        if (!user || user.email !== email) {
            return res.status(403).json({ message: 'Email không hợp lệ hoặc không có quyền.' });
        }

        // Cập nhật hoặc tạo mới trong UserInformation
        await UserInformation.upsert({
            firstName,
            lastName,
            email,
            phone: phone || null,
            address: address || null,
        });

        res.status(200).json({ message: 'Lưu thông tin thành công' });
    } catch (error) {
        console.error('Lỗi khi lưu thông tin:', error);
        res.status(500).json({ message: 'Lỗi server khi lưu thông tin.', error: error.message });
    }
};

//@desc Refresh Token
//@route POST api/auth/refresh-token
//@access public
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        } catch (error) {
            console.log('Error in refresh token', error);
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Find user
        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Create new access token
        const newAccessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Token refreshed successfully',
            accessToken: newAccessToken,
        });
    } catch (error) {
        console.log('Error in refresh token', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

//@desc Current User
//@route POST /api/users/current
//@access private
const current = (req, res) => {
    res.status(200).json(req.user);
};

//@desc Logout User
//@route POST /api/auth/logout
//@access public
const logout = async (req, res) => {
    res.status(200).json({ message: 'Logout successfully' });
};

//@desc Refresh User
//@route POST /api/users/refresh
//@access private
const refresh = asyncHandler((req, res) => {
    res.status(200).json({
        message: 'refresh successful',
    });
});

module.exports = { login, register, current, logout, refresh, getUserProfile, refreshToken, updateUserProfile };