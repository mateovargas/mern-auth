import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//API Routes
app.use('/api/users', userRoutes);

//production set up or test
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'frontend/dist')));
    app.get(/.*/, (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')));
} else {
    app.get('/', (req, res) => res.send('Server is ready'));
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server started on PORT: ${port}`);
});

// POST /api/users - Register User
// POST /api/users/auth - Authenticate a user and get a token
// POST /api/users/logout - Logout user and clear cookie
// GET /api/users/profile - Get user profile
// PUT /api/users/profile - Update profile
