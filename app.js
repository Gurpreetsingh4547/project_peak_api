// Packages
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import { config } from "dotenv";

// Configure env
config({ path: "./config/config.env" });

// Routers
import Routers from "./Routers/index.js";

// Configure expree app
export const app = express();

// Middleware
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// File Upload
app.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

// Cors Options
const corsOptions = {
  origin: process.env.APP_URL.split(" "),
  credentials: true,
  optionSuccessStatus: 200,
};

// Cors
app.use(cors(corsOptions));

// Routes
app.use("/api/v1", Routers);

// Home route or Defaut router
app.get("/", (req, res) => {
  res.send("Server is working!");
});
