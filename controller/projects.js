// Models
import { Projects } from "../models/projects.js";

// Services
import { HaveValue, IsObjectHaveValue } from "../services/helper.js";

/**
 * Creates a new project.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} A promise that resolves to the created project.
 */
export const CreateProject = async (req, res) => {
  const { name = "", description = "" } = req.body;

  const user = req?.user || null;
  try {
    // Check if name and description are provided
    if (!HaveValue(name) || !HaveValue(description)) {
      return res.status(400).json({
        success: false,
        message: "Please provide name and description",
      });
    }

    // Check if project already exists with same name
    const existingProject = await Projects.findOne({ name });

    // Check if project already exists
    if (IsObjectHaveValue(existingProject)) {
      return res.status(400).json({
        success: false,
        message: "A project with this name already exists in the system.",
      });
    }

    // Create project
    const project = await Projects.create({
      name,
      description,
      created_by: user?._id,
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Retrieves all projects from the database and sends them as a JSON response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Object} The JSON response containing the projects.
 */
export const GetAllProjects = async (req, res) => {
  try {
    const { name = "", page = 1, limit = 10 } = req?.body;
    const query = {};

    // Check if name is provided
    if (HaveValue(name)) {
      query.name = name;
    }
    // Calculate the number of projects to skip
    const skip = limit * (page - 1);

    // Retrieve projects
    const projects = await Projects.find(query).skip(skip).limit(limit);

    // Send success response
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Deletes a project.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} A promise that resolves to the deleted project.
 */
export const DeleteProject = async (req, res) => {
  const { id } = req?.params;

  try {
    if (!HaveValue(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Project ID is required" });
    }
    const project = await Projects.findByIdAndDelete(id);

    // Check if project exists
    if (!IsObjectHaveValue(project)) {
      return res
        .status(400)
        .json({ success: false, message: "Project not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};