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
      status: "Pending",
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
    let { name = "", page = 1, limit = 10 } = req?.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const query = { created_by: req?.user?._id };

    // Check if name is provided
    if (HaveValue(name)) {
      query.name = name;
    }
    // Calculate the number of projects to skip
    const skip = limit * (page - 1);

    // Retrieve projects
    const projects = await Projects.find(query).skip(skip).limit(limit);

    // Count total number of projects
    const count = await Projects.countDocuments(query);

    // Calculate the total number of pages
    const total_pages = Math.ceil(count / limit);

    // Send success response
    res.status(200).json({
      success: true,
      data: projects,
      pagination: { page, limit, total_pages },
    });
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

/**
 * Updates a project with the provided ID, name, and description.
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise<void>}
 */
export const UpdateProject = async (req, res) => {
  const { id } = req?.params;
  const { name = "", description = "", status = "" } = req?.body;
  try {
    if (!HaveValue(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Project ID is required" });
    }

    // Check if project exists and update the values
    let project = await Projects.findByIdAndUpdate(
      id,
      {
        name,
        description,
        status,
      },
      { new: true }
    );

    // Check if project not exists
    if (!IsObjectHaveValue(project)) {
      return res
        .status(400)
        .json({ success: false, message: "Project not found" });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
