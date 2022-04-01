import express from "express";
import { changePassword, forgotPassword, login, logout, resetPassword, signUp, xyz } from "../controller/auth.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot", forgotPassword);
router.put("/reset/:token", resetPassword);

router.post("/change", changePassword);


router.get("/xyz", xyz);

export default router;