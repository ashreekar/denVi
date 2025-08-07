import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb= async ()=>{
    try{
        // it holds the respomse from mongoose
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

        console.log(`\n MongoDB connected !! DB : ${connectionInstance.connection.host}`);  // given by mongoose

    }catch(err){
        console.log("MONGODB connection FAILED ",err);
        process.exit(1);  // node functionality exits process with code 1
    }
}

export default connectDb