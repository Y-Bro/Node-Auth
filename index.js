import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routers/auth.js";
import userRoutes from "./routers/users.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.DBURI,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=>{
    console.log("DB Connected");

    app.listen(process.env.PORT,()=>{
        console.log("Server Started");
    })
})

app.get("/",(req,res)=>{
    res.send("hi");
})

//auth routes
app.use("/auth",authRoutes);

app.use("/users",userRoutes)