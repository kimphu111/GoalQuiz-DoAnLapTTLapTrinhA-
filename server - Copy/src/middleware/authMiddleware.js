const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Không có token!' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token không hợp lệ!' });
    }
  };

// Middleware to check if user is ADMIN
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') { // Thêm kiểm tra req.user
      return res.status(403).json({ message: 'Chỉ admin mới có quyền truy cập!' });
    }
    next();
  };

module.exports = {
    authMiddleware,
    adminMiddleware,
};