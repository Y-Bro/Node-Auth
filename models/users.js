import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
    },

    email: {
        type: String,
    },

    password: {
        type: String,
    },

    resetPasswordToken: String,
    resetTokenExpire: Date,

    lastFivePass: {
        type: Array,
        maxlength: 5
    }

}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);

    this.lastFivePass.length<5 ? this.lastFivePass.push(this.password) : ()=>{
        this.lastFivePass.shift(); 
        this.lastFivePass.push(this.password);}
})

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "2m" });
}

userSchema.methods.comparePass = async function (password) {
    return bcrypt.compare(password, this.password);
}


userSchema.methods.compareLastFive = async function (password) {
    let canChange = true;
   for(let i =0 ; i<this.lastFivePass.length; i++){
       const isSame = await bcrypt.compare(password,this.lastFivePass[i]);
       if(isSame){
           canChange = false;
       }

       
   } return canChange;

    
}

userSchema.methods.getResetToken = function () {

    let token = crypto.randomBytes(64).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    this.resetTokenExpire = Date.now() + 30 * 60 * 1000;

    return token;


}

export const User = mongoose.model("users", userSchema, "Users");
