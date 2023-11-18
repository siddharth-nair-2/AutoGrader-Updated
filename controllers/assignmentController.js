const asyncHandler = require("express-async-handler");
const {
  Assignment,
  Submission,
  Plagiarism,
} = require("../models/trackerModel");

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
    const assignmentID = req.params.assignmentID;
    const { visibleToStudents } = req.body;

    const assignment = await Assignment.updateOne(
      { _id: assignmentID },
      { visibleToStudents },
      { new: true }
    );

    if (!assignment) {
      res.status(404).send("Assignment not found");
    } else {
      res.status(200).json(assignment);
    }
  } catch (error) {
    res.status(400).json({ message: error.message || "Server Error" });
  }
});

// Delete an assignment
const AssignmentDelete = asyncHandler(async (req, res) => {
  const assignmentID = req.params.assignmentID; // Get assignmentID from URL params

  try {
    await Assignment.deleteOne({ _id: assignmentID });
    await Submission.deleteMany({ assignmentID });
    await Plagiarism.deleteMany({ assignmentID });

    res
      .status(200)
      .send(
        "The assignment and related submissions and plagiarism checks were deleted!"
      );
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

// Get assignments for a course
const getAssignments = asyncHandler(async (req, res) => {
  const courseID = req.query.courseID; // Get courseID from query parameters

  try {
    const assignments = await Assignment.find({ courseID: courseID });

    if (assignments.length === 0) {
      return res
        .status(200)
        .json({ message: "No assignments found for this course." });
    }

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

// Get assignments visible to students
const getStudentAssignments = asyncHandler(async (req, res) => {
  const courseID = req.query.courseID; // Get courseID from query parameters

  try {
    const assignments = await Assignment.find({
      courseID,
      visibleToStudents: true,
    });

    if (assignments.length === 0) {
      // No assignments found for the given courseID
      return res
        .status(200)
        .json({ message: "No assignments found for this course, that are avaiable for the students." });
    }

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

module.exports = {
  AssignmentCreate,
  updateAssignment,
  getAssignments,
  getStudentAssignments,
  AssignmentDelete,
};
