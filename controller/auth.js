import { User } from "../models/users.js";
import { sendToken } from "../utils/jwtToken.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto"

export const signUp = catchAsyncErrors(async (req, res, next) => {
    let { name, email, password } = req.body;
    let user;

    //email doesnt exist
    user = await User.findOne({ email })

    if (user) {
        return res.status(403).send({
            message: "User already exists, please login"
        })
    }

    user = new User({
        name,
        email,
        password
    });


    await user.save();
    sendToken(user, 200, res);
})

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send({
            Message: "Please enter valid email/password"
        })
    }
    let user = await User.findOne({ email });

    if (!user) {
        return res.send("User Does not exist");
    }

    const isPassword = await user.comparePass(password);

    if (!isPassword) {
        return res.send("Invalid Details");
    }

    sendToken(user, 200, res);
})

export const logout = (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.send("User logged out");
}

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
        return res.send("User Does not exist");
    }

    const resetToken = user.getResetToken();


    await user.save({ validateBeforeSave: false });


    const resetUrl = `${req.protocol}://${req.get("host")}/auth/reset/${resetToken}`;

    const message = `This is your password reset link valid for the next 30 mins:\n\n ${resetUrl}`

    try {
        await sendEmail({
            email: user.email,
            subject: "Reset Password",
            message
        })

        res.send({
            Message: `Email sent to ${user.email}`
        })

    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetTokenExpire = undefined;

        await user.save({ validateBeforeSave: true });

        res.send(error.message);
    }
})

export const resetPassword = catchAsyncErrors(async(req,res,next)=>{
    const token = req.params.token;

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    console.log(resetPasswordToken);

    let user = await User.findOne({resetPasswordToken,
        resetTokenExpire : {$gt : Date.now()}
    })
    if(!user){
        return res.send("Token Expired/Invalid reset token");
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    sendToken(user,200,res);
})