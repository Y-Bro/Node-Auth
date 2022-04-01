import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.js";

export const isAuthenticated = catchAsyncErrors (async(req,res,next)=>{

    let {token} = req.cookies;

    if(!token){
        return res.send("Please login");
    }

        jwt.verify(token,process.env.JWT_SECRET, async (err,result)=>{
        if(err)
        {
            return res.send("Token Invalid");
        }

        const payload = result;
        req.user = await User.findById(payload.id);
        next();

    });
    

})