import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
    try {
        // it holds the respomse from mongoose
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

        console.log(`🗄️  Database connected: ${connectionInstance.connection.host}`);  // given by mongoose

    } catch (err) {
        console.log("❌ Database connection failed:", err);
        process.exit(1);  // node functionality exits process with code 1
    }
}

export default connectDb