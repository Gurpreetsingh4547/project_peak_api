// Packages
import express from "express";

// Controllers
import {
  loginUser,
  registerUser,
  resendOtp,
  verify,
} from "../controller/user.js";

// Middleware
import { isAuthenticated } from "../middleware/auth.js";
import {
  CreateProject,
  DeleteProject,
  GetAllProjects,
  UpdateProject,
} from "../controller/projects.js";

// Define Router
const router = express.Router();

// Define User Routes
router.route("/signup").post(registerUser);
router.route("/verify").post(isAuthenticated, verify);
router.route("/login").post(loginUser);
router.route("/resend/otp").post(isAuthenticated, resendOtp);

// Define Project Routes
router.route("/add/projects").post(isAuthenticated, CreateProject);
router.route("/get/projects").get(isAuthenticated, GetAllProjects);
router.route("/delete/projects/:id").delete(isAuthenticated, DeleteProject);
router.route("/update/projects/:id").put(isAuthenticated, UpdateProject);

export default router;
