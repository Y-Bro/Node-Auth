import express from "express";
import { forgotPassword, login, logout, resetPassword, signUp } from "../controller/auth.js";

const router = express.Router();

router.post("/signup",signUp);
router.post("/login",login);
router.get("/logout",logout);
router.post("/forgot",forgotPassword);
router.put("/reset/:token",resetPassword);

export default router;