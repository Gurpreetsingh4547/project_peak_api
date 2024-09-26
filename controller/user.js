// Packages
import crypto from "crypto";
import ejs from "ejs";
import { readFileSync } from "fs";
import jwt from "jsonwebtoken";

// Models
import { User } from "../models/user.js";

// Services
import { sendMail } from "../utils/SendMail.js";
import { SendToken } from "../utils/SendToken.js";
import {
  HaveValue,
  IsEqual,
  IsObjectHaveValue,
  IsTrue,
} from "../services/helper.js";

/**
 * Register a new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const registerUser = async (req, res) => {
  try {
    // Destructure name, email, and password from request body
    const { first_name, last_name, full_name, email, password } = req?.body;

    // Check if user with the same email already exists
    let user = await User.findOne({ email });

    // If user already exists, return an error response
    if (IsObjectHaveValue(user)) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Genrate OTP
    const otp = crypto.randomInt(100000, 999999);

    // Create a new user
    user = await User.create({
      full_name,
      first_name,
      last_name,
      email,
      password,
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
      role: "Admin",
    });

    // Read the EJS template file
    const emailTemplate = readFileSync(
      "./htmlTemplates/emailTemplate.ejs",
      "utf-8"
    );

    const renderedTemplate = ejs.render(emailTemplate, {
      recipientName: full_name, // recipient's name
      service: "Project Peak", // service or product name
      otp: otp, // generated OTP
      timeFrame: "5 minutes", // time frame for using OTP
      action: "Sign up", // action for which OTP is used
      supportContact: "projectpeak12@gmail.com", // support contact information
      senderName: "Project Peak", // sender's name
      senderPosition: "Customer Support Representative", // sender's position
    });

    // Send Otp Mail
    await sendMail(
      email,
      "Your One-Time Password (OTP) for Project Peak",
      ``,
      renderedTemplate
    );

    // Send Token After Registeration
    SendToken(
      res,
      user,
      201,
      "OTP sent to your email, please verify your account"
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Verify user with OTP
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const verify = async (req, res) => {
  try {
    // Convert OTP to number
    const otp = Number(req?.body?.otp);

    // Find user by ID
    const user = await User.findById(req?.user?._id);

    // Check if OTP is valid and not expired
    if (!IsEqual(user?.otp, otp) || user?.otp_expiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or has been Expired" });
    }

    // Set user as verified and reset OTP data
    user.verified = true;
    user.otp = null;
    user.otp_expiry = null;

    // Save user changes
    await user.save();

    // Send success response
    SendToken(res, user, 200, "Account verified successfully");
  } catch (error) {
    // Return error response if an exception occurs
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Log in a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const loginUser = async (req, res) => {
  try {
    // Destructure email and password from request body
    const { email, password } = req.body;

    // If email or password is missing, return a 400 error response
    if (!HaveValue(email) || !HaveValue(password)) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    // Check if user with the provided email exists
    let user = await User.findOne({ email }).select("+password");

    // If user does not exist, return a 400 error response
    if (!IsObjectHaveValue(user)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    // Compare the provided password with the user's password
    const isMatch = await user.comparePassword(password);

    // If passwords do not match, return a 400 error response
    if (!IsTrue(isMatch)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    // Send token and return a 200 success response
    SendToken(res, user, 200, "Login successfully");
  } catch (error) {
    // Return a 500 error response if an exception occurs
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Resends the OTP (One-Time Password) to the user's email address.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} - A promise that resolves when the OTP is sent successfully.
 */
export const resendOtp = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req?.user?._id);

    if (!IsObjectHaveValue(user)) {
      return res.status(500).json({
        success: false,
        message: "User not found. Please register again.",
      });
    }

    // Genrate OTP
    const otp = crypto.randomInt(100000, 999999);
    user.otp = otp;
    user.otp_expiry = new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000);

    // Read the EJS template file
    const emailTemplate = readFileSync(
      "./htmlTemplates/emailTemplate.ejs",
      "utf-8"
    );

    const renderedTemplate = ejs.render(emailTemplate, {
      recipientName: user?.full_name, // recipient's name
      service: "Project Peak", // service or product name
      otp: otp, // generated OTP
      timeFrame: "5 minutes", // time frame for using OTP
      action: "Sign up", // action for which OTP is used
      supportContact: "projectpeak12@gmail.com", // support contact information
      senderName: "Project Peak", // sender's name
      senderPosition: "Customer Support Representative", // sender's position
    });

    // Send Otp Mail
    await sendMail(
      user?.email,
      "Your One-Time Password (OTP) for Project Peak",
      ``,
      renderedTemplate
    );

    // Save user changes
    await user.save();

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    // Return a 500 error response if an exception occurs
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Forgot password with email token link.
 * @param {object} req
 * @param {object} res
 * @returns JSON
 */
export const forgortPassword = async (req, res) => {
  try {
    const { email = "" } = req?.body;

    if (!HaveValue(email)) {
      return res
        .status(412)
        .json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!IsObjectHaveValue(user)) {
      return res.status(412).json({
        success: false,
        message: "Please provide valid email address.",
      });
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET, // Use a secure secret stored in env
      { expiresIn: "1d" }
    );

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const resetURL = `${
      process.env.APP_URL.split(" ")[0]
    }/verify/token/${resetToken}`;

    // Read the EJS template file
    const forgotPasswordTemplate = readFileSync(
      "./htmlTemplates/forgotPasswordTemplate.ejs",
      "utf-8"
    );

    const renderedTemplate = ejs.render(forgotPasswordTemplate, {
      recipientName: user?.full_name, // recipient's name
      service: "Project Peak", // service or product name
      resetLink: resetURL, // generated OTP
      supportContact: "projectpeak12@gmail.com", // support contact information
      senderName: "Project Peak", // sender's name
      senderPosition: "Customer Support Representative", // sender's position
    });

    // Send Otp Mail
    await sendMail(
      user?.email,
      "Your Project Peak Password Reset Link (Expires in 1 Day)",
      ``,
      renderedTemplate
    );

    res.status(200).json({
      success: true,
      message: "'Password reset link has been sent to your email.",
    });
  } catch (error) {
    // Return a 500 error response if an exception occurs
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Reset password by verifing token.
 * @param {Object} req
 * @param {Object} res
 * @returns JSON
 */
export const resetPassword = async (req, res) => {
  try {
    const { token = "", password = "" } = req?.body;

    if (!HaveValue(token) || !HaveValue(password)) {
      return res.status(401).json({
        success: false,
        message: "Please provide token or password.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with this reset token and check if it is still valid
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Passowrd forgot successfully.",
    });
  } catch (error) {
    // Return a 500 error response if an exception occurs
    res.status(500).json({ success: false, message: error.message });
  }
};
