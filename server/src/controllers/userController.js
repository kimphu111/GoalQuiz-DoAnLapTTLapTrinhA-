const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

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
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    // generate access token
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
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

    const refreshToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
          vip: user.vip,
          role: user.role,
        },
      },
      process.env.REFRESH_SECRET_KEY,
      {
        expiresIn: "30d",
        // no need header because JWT default is HS256-JWT
        // header: {
        //     alg: "HS256",
        //     typ: "JWT"
        // }
      }
    );

    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "None",
      // path: "/"
    });

    res.status(200).json({
      accessToken,
    });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }

  //compare password with hashedpassword
  res.status(201).json({ message: "login successful" });
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

module.exports = { login, register, current, logout, refresh };
