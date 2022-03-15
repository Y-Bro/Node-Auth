import { User } from "../models/users.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const getAllUsers = catchAsyncErrors(async(req,res)=>{
    let users = await User.find();

    res.send(users);
})