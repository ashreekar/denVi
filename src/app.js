import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // to accease and crud cookines from user browser

const app=express();

// now configure cookie and cors
// app.use() for middlewares configuration

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials:true
    }
));

// limits the get file size by express by default
app.use(express.json({
    limit: "16kb"
}));

// this helps to parse url like spaces and all which is endcided as %20
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}));

// to store assest
app.use(express.static('public'));

app.use(cookieParser());

export { app };