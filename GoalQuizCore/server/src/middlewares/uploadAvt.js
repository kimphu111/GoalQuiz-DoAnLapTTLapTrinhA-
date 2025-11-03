const multer = require('multer');
const path = require('path');

// Cấu hình nơi lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Thư mục lưu file
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Lấy đuôi file (ví dụ: .jpg)
    cb(null, `avatar-${uniqueSuffix}${ext}`); // Đặt tên file: avatar-123456789.jpg
  },
});

// Lọc file để chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpeg, png, gif)!'), false);
  }
};

// Tạo middleware upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file: 5MB
});

module.exports = upload;