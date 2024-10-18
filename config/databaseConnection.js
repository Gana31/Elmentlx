import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/ElementalX`, {});
        console.log("DATABASE SUCCESSFULLY CONNECTED");
    } catch (error) {
        console.log("ERROR WHILE CONNECTING DATABASE", error);
        process.exit(1);
    }
};

export default connectDB;
