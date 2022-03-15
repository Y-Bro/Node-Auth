import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "PLEASE ENTER NAME"]
    },

    email: {
        type: String,
        required: [true, "Please enter email"]
    },

    password: {
        type: String,
        required: [true, "Please enter password"]
    },

    resetPasswordToken : String,
    resetTokenExpire : Date

}, { timestamps: true });

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }

   this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:"2m"});
}

userSchema.methods.comparePass = async function(password){
    return bcrypt.compare(password,this.password);
}

userSchema.methods.getResetToken = function(){

    let token = crypto.randomBytes(64).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    this.resetTokenExpire = Date.now() + 30 * 60 * 1000;

    return token;


}

export const User = mongoose.model("users",userSchema,"Users");
