import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import approuter from './routes/userRoutes.js'; 
import connectDB from './config/databaseConnection.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8082;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.Domain || 'http://localhost:5173',
    credentials: true,
  }));
app.use("/api/v1", approuter);

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: 'Your server is up and running....'
    });
});

connectDB();
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
