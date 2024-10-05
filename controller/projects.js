// Models
import { Projects } from "../models/projects.js";

// Services
import {
  GetUpdatedBy,
  HaveValue,
  IsObjectHaveValue,
} from "../services/helper.js";

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

    const beforeUpdate = await Projects.findById(id);

    // Check if project exists and update the values
    let project = await Projects.findByIdAndUpdate(
      id,
      {
        name,
        description,
        status,
        updated_at: Date.now(),
        recent_changes: GetUpdatedBy(beforeUpdate, req?.body),
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

/**
 * Get Project Status based on month and year
 * @param {object} req
 * @param {object} res
 */
export const GetProjectStatus = async (req, res) => {
  try {
    // Define the range for the months you want to query
    const startYear = new Date().getFullYear(); // Change as necessary
    const endYear = new Date().getFullYear(); // Change as necessary

    // Generate all months in the defined range
    const months = [];
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        months.push({ year, month });
      }
    }
    const userId = req?.user?._id;

    // Fetch aggregated project data, filtered by user ID
    const projectData = await Projects.aggregate([
      {
        $match: {
          created_by: userId,
          status: { $in: ["Complete", "Pending", "In Progress", "Block"] },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$created_at" },
            year: { $year: "$created_at" },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.status": 1 },
      },
    ]);

    // Initialize a structure to hold the counts
    const result = {};
    months.forEach(({ year, month }) => {
      const monthKey = `${year}-${month}`;
      result[monthKey] = {
        Complete: 0,
        Pending: 0,
        "In Progress": 0,
        Block: 0,
      };
    });

    // Fill in the counts from the aggregated data
    projectData.forEach((data) => {
      const monthKey = `${data._id.year}-${data._id.month}`;
      result[monthKey][data._id.status] = data.count;
    });

    // Format the final response
    const formattedData = Object.keys(result).map((monthKey) => ({
      month: monthKey,
      ...result[monthKey], // Spread the counts for each status
    }));

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get recent changes in project
 * @param {object} req
 * @param {object} res
 */
export const GetRecentChangesInProject = async (req, res) => {
  try {
    const { limit = 6 } = req?.query;
    const userId = req?.user?._id;
    const project = await Projects.find({ created_by: userId })
      .sort({ updated_at: -1 })
      .limit(limit);
    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
