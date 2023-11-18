const asyncHandler = require("express-async-handler");
const { Test } = require("../models/trackerModel");

// -----------------------------
// Test Management Controllers
// -----------------------------

// Create a new test record
const createTest = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    notes,
    courseID,
    scheduledAt,
    duration,
    visibleToStudents,
    questions,
    files,
  } = req.body;

  if (
    !name ||
    !description ||
    !notes ||
    !courseID ||
    !scheduledAt ||
    !duration ||
    visibleToStudents === null ||
    !questions ||
    !files
  ) {
    res.status(400);
    throw new Error("Please enter all the fields!");
  }

  // Create and save the test
  const test = await Test.create({
    name,
    description,
    notes,
    courseID,
    scheduledAt,
    duration,
    visibleToStudents,
    questions,
    files,
  });

  if (test) {
    res.status(201).json({
      _id: test._id,
      name: test.name,
      description: test.description,
      notes: test.notes,
      courseID: test.courseID,
      scheduledAt: test.scheduledAt,
      duration: test.duration,
      files: test.files,
      visibleToStudents: test.visibleToStudents,
      questions: test.questions,
    });
  }
});

// Update an existing test
const updateTest = asyncHandler(async (req, res) => {
  try {
    const { testID, courseID, visibleToStudents } = req.body;
    const test = await Test.updateOne(
      {
        courseID: courseID,
        _id: testID,
      },
      {
        visibleToStudents,
      }
    );
    res.status(200).send(test);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Delete a test
const deleteTest = asyncHandler(async (req, res) => {
  const { testID } = req.body;

  if (!testID) {
    res.status(400);
    throw new Error("Please enter all the fields!");
  }

  try {
    await Test.deleteOne({ _id: testID });
    // Include any additional cleanup if necessary
    res.status(200).send("Test successfully deleted");
  } catch (error) {
    res.status(400);
    throw new Error("Test deletion failed");
  }
});

// Get tests for a course
const getTestsForCourse = asyncHandler(async (req, res) => {
  try {
    const { courseID } = req.body;

    if (!courseID) {
      res.status(400);
      throw new Error("Course ID is required!");
    }

    const tests = await Test.find({ courseID: courseID });

    if (!tests || tests.length === 0) {
      res.status(404);
      throw new Error("No tests found for this course!");
    }

    res.status(200).send(tests);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Get tests visible to students
const getStudentTests = asyncHandler(async (req, res) => {
  try {
    const { courseID } = req.body;
    const tests = await Test.find({
      courseID: courseID,
      visibleToStudents: true,
    });
    res.status(200).send(tests);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Get a single test by ID
const getSingleTest = asyncHandler(async (req, res) => {
  try {
    const { testID } = req.body;

    if (!testID) {
      res.status(400);
      throw new Error("Test ID is required!");
    }

    const tests = await Test.findById(testID);

    if (!tests) {
      res.status(404);
      throw new Error("Test not found!");
    }

    res.status(200).send(tests);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Get all tests
const getAllTests = asyncHandler(async (req, res) => {
  try {
    const tests = await Test.find({});
    res.status(200).send(tests);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  createTest,
  updateTest,
  deleteTest,
  getTestsForCourse,
  getStudentTests,
  getAllTests,
  getSingleTest,
};
