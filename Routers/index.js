// Packages
import express from "express";

// Controllers
import {
  forgortPassword,
  loginUser,
  logout,
  registerUser,
  resendOtp,
  resetPassword,
  verify,
} from "../controller/user.js";

// Middleware
import { isAuthenticated } from "../middleware/auth.js";
import {
  CreateProject,
  DeleteProject,
  GetAllProjects,
  GetProjectStatus,
  GetRecentChangesInProject,
  UpdateProject,
} from "../controller/projects.js";

// Define Router
const router = express.Router();

// Define User Routes
router.route("/signup").post(registerUser);
router.route("/verify").post(isAuthenticated, verify);
router.route("/logout").delete(isAuthenticated, logout);
router.route("/login").post(loginUser);
router.route("/resend/otp").post(isAuthenticated, resendOtp);
router.route("/forget/password").post(forgortPassword);
router.route("/reset/password").post(resetPassword);

// Define Project Routes
router.route("/add/projects").post(isAuthenticated, CreateProject);
router.route("/get/projects").get(isAuthenticated, GetAllProjects);
router.route("/delete/projects/:id").delete(isAuthenticated, DeleteProject);
router.route("/update/projects/:id").put(isAuthenticated, UpdateProject);
router.route("/project/status").get(isAuthenticated, GetProjectStatus);
router
  .route("/recent/projects")
  .get(isAuthenticated, GetRecentChangesInProject);

export default router;
