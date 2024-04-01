import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * Schema for user
 */
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  full_name: {
    type: String,
    reqruied: true,
    trim: true,
  },
  email: {
    type: String,
    reqruied: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    reqruied: true,
    minLength: [8, "Password should be at least 8 characters"],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: String,
  otp: Number,
  otp_expiry: Date,
  verified: {
    type: Boolean,
    default: false,
  },
  resetPasswordOtp: String,
  resetPasswordOtpExpire: Date,
});

/**
 * Hash the password before saving the user
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Generate a JWT token for the user
 * @returns {string} The JWT token
 */
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
  });
};

/**
 * Compare the entered password with the hashed password
 * @param {string} enteredPassword - The entered password
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Index for otp_expiry
 */
userSchema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });

export const User = mongoose.model("User", userSchema);
