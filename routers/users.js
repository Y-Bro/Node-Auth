import express from "express";
import { getAllUsers } from "../controller/users.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/",isAuthenticated,getAllUsers);

export default router;
