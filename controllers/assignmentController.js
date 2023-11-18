const asyncHandler = require("express-async-handler");
const { Assignment } = require("../models/trackerModel");

// -----------------------------
// Assignment Management Controllers
// -----------------------------

// Create a new assignment
const AssignmentCreate = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    notes,
    due_date,
    courseID,
    questions,
    visibleToStudents,
  } = req.body;

  if (
    !courseID ||
    !name ||
    !description ||
    !due_date ||
    !questions ||
    visibleToStudents === null
  ) {
    res.status(400);
    throw new Error("Please enter all the fields!");
  }
  const assignmentExists = await Assignment.findOne({ courseID, name });
  if (assignmentExists) {
    res.status(400).send("Exists");
    throw new Error("This assignment name already exists!");
  }
  let finalDue = new Date(due_date);
  const assignment = await Assignment.create({
    courseID,
    name,
    description,
    notes,
    due_date: finalDue,
    visibleToStudents,
    questions,
  });

  if (assignment) {
    res.status(201).json({
      _id: assignment._id,
      courseID: assignment.courseID,
      name: assignment.name,
      description: assignment.description,
      notes: assignment.notes,
      due_date: finalDue,
      questions: assignment.questions,
    });
  }
});

// Update an existing assignment
const updateAssignment = asyncHandler(async (req, res) => {
  try {
    const { assignmentID, courseID, visibleToStudents } = req.body;
    const assignment = await Assignment.updateOne(
      {
        courseID: courseID,
        _id: assignmentID,
      },
      {
        visibleToStudents,
      }
    );
    res.status(200).send(assignment);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Delete an assignment
const AssignmentDelete = asyncHandler(async (req, res) => {
  const { assignmentID } = req.body;

  if (!assignmentID) {
    res.status(400);
    throw new Error("Please enter all the fields!");
  }
  try {
    const assignmentExists = await Assignment.deleteOne({ _id: assignmentID });
  } catch (error) {
    res.status(400);
    throw new Error("Assignment deletion failed");
  }
  try {
    const submissionExists = await Submission.deleteMany({ assignmentID });
  } catch (error) {
    res.status(400);
    throw new Error("Submission deletion failed");
  }
  try {
    const plagiarismExists = await Plagiarism.deleteMany({ assignmentID });
  } catch (error) {
    res.status(400);
    throw new Error("Plagiarism deletion failed");
  }

  res
    .status(200)
    .send(
      "The assignment and related submissions and plagiarism checks were deleted!"
    );
});

// Get assignments for a course
const getAssignments = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.body;
    const courses = await Assignment.find({ courseID: _id });

    res.status(200).send(courses);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Get assignments visible to students
const getStudentAssignments = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.body;
    const courses = await Assignment.find({
      courseID: _id,
      visibleToStudents: true,
    });

    res.status(200).send(courses);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  AssignmentCreate,
  updateAssignment,
  getAssignments,
  getStudentAssignments,
  AssignmentDelete,
};
