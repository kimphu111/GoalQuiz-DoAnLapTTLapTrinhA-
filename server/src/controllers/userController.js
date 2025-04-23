const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const UserInformation = require("../models/userInformationModel");
const { response } = require("../app/app");

//@desc Register User
//@route POST /api/users/register
//@access public
const register = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username);

    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }

    // Check user already exist
    const userExist = await User.findOne({ where: { email } });

    if (userExist) {
      res.status(400);
      throw new Error("Email is already in use!");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    if (user) {
      res
        .status(201)
        .json({ _id: user.id, email: user.email, username: user.username });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
  } catch (error) {
    res.status(500);
    throw new Error("An error occured: ", error);
  }
});

//@desc Login User
//@route POST /api/users/login
//@access private
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      { user: { username: user.username, email: user.email, id: user.id } },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "30d" }
    );

    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false, // Đặt false cho localhost
      sameSite: "None",
    });

    res.status(200).json({
      accessToken,
      refreshToken,
      user: { username: user.username, email: user.email },
      role: user.role,
      token: accessToken,
      message: "Login successful",
    });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

//@desc Current User
//@route POST /api/users/current
//@access private
const current = (req, res) => {
  res.status(200).json(req.user);
};

//@desc Logout User
//@route POST /api/users/logout
//@access public
const logout = asyncHandler(async (req, res) => {
  const { email, token } = req.body;
  res.clearCookie('refreshToken');
  res.status(200).json({ message: "Log out successful" });
});

//@desc Refresh User
//@route POST /api/users/refresh
//@access private
const refresh = asyncHandler((req, res) => {
  // generate access token
  const accessToken = jwt.sign(
    {
      user: {
        username: req.user.username,
        email: req.user.email,
        id: req.user.id,
        role: req.user.role,
      },
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15m",
      // no need header because JWT default is HS256-JWT
      // header: {
      //     alg: "HS256",
      //     typ: "JWT"
      // }
    }
  );

  res.status(200).json({
    accessToken,
  });
});

//@desc Get user information from UserInformation table
//@route GET /api/users/information
//@access private
const getUserInformation = async (req, res) => {
  try {
    console.log('req.user:', req.user); // Log để kiểm tra req.user

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Lấy thông tin từ UserInformation
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

//@desc Update user information in UserInformation table
//@route POST /api/users/userInformation
//@access private
const updateUserInformation = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id;

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

module.exports = { login, register, current, logout, refresh, updateUserInformation, getUserInformation };
