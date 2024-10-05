import { name } from "ejs";
import mongoose from "mongoose";

// Schema for projects
const ProjectsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    length: 100,
  },
  description: {
    type: String,
    required: true,
    length: 500,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pending",
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  recent_changes: {
    type: String,
    default: null,
  },
});

export const Projects = mongoose.model("Projects", ProjectsSchema);
