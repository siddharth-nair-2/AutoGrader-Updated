const asyncHandler = require("express-async-handler");
const { Module } = require("../models/moduleModel");

// -----------------------------
// Module Management Controllers
// -----------------------------

// Create a new module
const createModule = asyncHandler(async (req, res) => {
  const { title, courseID, content, assignments, tests, files } =
    req.body;

  if (
    !title ||
    !courseID ||
    !content ||
    !assignments ||
    !tests ||
    !files
  ) {
    res.status(400);
    throw new Error("Please enter all the fields!");
  }

  // Create and save the module
  const module = await Module.create({
    title,
    courseID,
    content,
    assignments,
    tests,
    files,
  });

  if (module) {
    res.status(201).json({
      _id: module._id,
      title: module.title,
      courseID: module.courseID,
      content: module.content,
      assignments: module.assignments,
      tests: module.tests,
      files: module.files,
    });
  }
});

// Update an existing module
const updateModule = asyncHandler(async (req, res) => {
  try {
    const moduleID = req.params.moduleID;
    const { title, content, newAssignments, newTests, newFiles } = req.body;

    const module = await Module.findById(moduleID);

    if (!module) {
      res.status(404).json({ message: "Module not found!" });
      return;
    }

    if (title) {
      module.title = title;
    }
    if (content) {
      module.content = content;
    }
    if (newAssignments && newAssignments.length > 0) {
      module.assignments.push(...newAssignments);
    }
    if (newTests && newTests.length > 0) {
      module.tests.push(...newTests);
    }
    if (newFiles && newFiles.length > 0) {
      module.files.push(...newFiles);
    }

    const updatedModule = await module.save();

    res.status(200).json(updatedModule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a module
const deleteModule = asyncHandler(async (req, res) => {
  const moduleID = req.params.moduleID;

  const module = await Module.findById(moduleID);

  if (!module) {
    return res.status(404).json({ message: "Module not found!" });
  }

  await module.remove();
  res.status(200).json({ message: "Module successfully deleted" });
});

// Get all modules for a course
const getModulesForCourse = asyncHandler(async (req, res) => {
  const courseID = req.params.courseID;

  const modules = await Module.find({ courseID: courseID });

  if (!modules || modules.length === 0) {
    return res
      .status(404)
      .json({ message: "No modules found for this course!" });
  }

  res.status(200).json(modules);
});

// Get a single module by ID
const getSingleModule = asyncHandler(async (req, res) => {
  const moduleID = req.params.moduleID;

  try {
    const module = await Module.findById(moduleID);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

// Get all modules
const getAllModules = asyncHandler(async (req, res) => {
  try {
    const modules = await Module.find({});

    if (!modules || modules.length === 0) {
      return res.status(404).json({ message: "Modules not found" });
    }

    res.status(200).send(modules);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  createModule,
  updateModule,
  deleteModule,
  getSingleModule,
  getModulesForCourse,
  getAllModules,
};
