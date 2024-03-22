import express from "express";

// Controllers
import {
  loginUser,
  registerUser,
  resendOtp,
  verify,
} from "../controller/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Define Routes
router.route("/signup").post(registerUser);
router.route("/verify").post(isAuthenticated, verify);
router.route("/login").post(loginUser);
router.route("/resend/otp").post(isAuthenticated, resendOtp);

export default router;
