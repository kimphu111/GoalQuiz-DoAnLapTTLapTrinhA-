const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes');
const { connectDB } = require('./src/database/database');

const app = express();
dotenv.config(); // Load file .env
// console.log('DB_USER:', process.env.DB_USER); // Kiểm tra giá trị DB_USER
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

app.use(cors({
    origin: 'http://localhost:4200', // Thay đổi thành địa chỉ frontend của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/register', authRoutes);
app.use('/api/login', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});