import express from "express"
import { dashboardPage, loginUser, logoutUser, registerUser } from "../controller/authController.js";
import { isAutheticated } from "../auth/authMiddleware.js";
const approuter = express.Router()

approuter.post("/register",registerUser);
approuter.post("/login",loginUser);
approuter.get("/logout",isAutheticated,logoutUser);
approuter.get("/dashboard",isAutheticated,dashboardPage);
export default approuter;