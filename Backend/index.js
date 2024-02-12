
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userroutes.js"
import authRouter from './routes/authroute.js'
import listingRouter from './routes/listingroutes.js'
import cookieParser from "cookie-parser";
dotenv.config();
const app=express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter)

//middleware to handle the error 
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || "Internal server error"
    return res.status(statusCode).json({success:false,statusCode,
        message});
})


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DataBase Connected")
}).catch((error)=>{
console.log(error)
})



app.listen(process.env.PORT,()=>{
    console.log("server strated")
})