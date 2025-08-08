// require('dotenv').config({path:'./env'});
// import mongoose from "mongoose";
// import {DB_NAME} from "./constants";

import dotenv from "dotenv";
import connectDb from "./db/index.js";
import { app } from "./app.js";
// import express from "express";

// configure dotenv
dotenv.config({
    path:"./env"
})

connectDb()
.then(()=>{
    app.listen(process.env.PORT || 3002, ()=>{
        console.log(`=> Server is runnig at port :${process.env.PORT || 3002}`);
    });
})
.catch((err)=>{
    console.log("MONGODB CONNECTION ERROR FROM \"db/index.js\" \n",err);
})
















































/*  //First Approach
const app= express()

;(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

        app.on("error",(err)=>{
            console.log("Error: ",err);
            throw err
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listning on port ${process.env.PORT}`);
        })

    }catch(err){
        console.error("Error: ",err);
        throw err;
    }
})()
    */