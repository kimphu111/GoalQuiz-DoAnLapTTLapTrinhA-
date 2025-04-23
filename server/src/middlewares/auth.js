const jwt = require('jsonwebtoken');

const auth = permission => {
  return (req, res, next) => {
    const { role } = req.user;
    console.log(role);

    if (!role) {
      res.status(400);
      throw new Error('you need sign in');
    }
    if (!permission.includes(role)) {
      res.status(401);
      throw new Error("you don't have permission");
    }
    next();
  };
};

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader); // Log header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided or invalid format' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token); // Log token

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Decoded token:', decoded); // Log payload

    // Payload có cấu trúc { user: { username, email, id } }
    if (!decoded.user) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = decoded.user; // Gán req.user từ decoded.user
    console.log('req.user:', req.user); // Log req.user
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { auth, authMiddleware };