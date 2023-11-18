const asyncHandler = require("express-async-handler");
const { Submission } = require("../models/trackerModel");

// -----------------------------
// Submission Management Controllers
// -----------------------------

// Create a new submission
const createSubmission = asyncHandler(async (req, res) => {
  const {
    studentName,
    studentID,
    assignmentID,
    courseID,
    questionID,
    questionNum,
    questionInfo,
    languageName,
    testCases,
    answer,
  } = req.body;

  if (
    !studentName ||
    !studentID ||
    !assignmentID ||
    !courseID ||
    !questionID ||
    !questionNum ||
    !questionInfo ||
    !languageName ||
    !testCases ||
    !answer
  ) {
    res.status(400);
    throw new Error("Please enter all the fields!");
  }
  const submission = await Submission.create({
    studentName,
    studentID,
    assignmentID,
    courseID,
    questionID,
    questionNum,
    questionInfo,
    languageName,
    testCases,
    answer,
  });

  if (submission) {
    res.status(201).json({
      _id: submission._id,
      studentName: submission.studentName,
      studentID: submission.studentID,
      assignmentID: submission.assignmentID,
      courseID: submission.courseID,
      questionID: submission.questionID,
      questionNum: submission.questionNum,
      questionInfo: submission.questionInfo,
      languageName: submission.languageName,
      testCases: submission.testCases,
      answer: submission.answer,
    });
  }
});

// Compare a student's submission
const compareSubmission = asyncHandler(async (req, res) => {
  try {
    const { studentID, questionID } = req.body;
    const courses = await Submission.find({
      studentID: studentID,
      questionID: questionID,
    });

    res.status(200).send(courses);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Get all submissions for an assignment
const getAllSubmissions = asyncHandler(async (req, res) => {
  try {
    const { courseID, assignmentID } = req.body;
    const submissions = await Submission.find({
      courseID: courseID,
      assignmentID: assignmentID,
    });

    res.status(200).send(submissions);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Get custom submissions
const getCustomSubmissions = asyncHandler(async (req, res) => {
  try {
    const { courseID, assignmentID, questionID, languageName, studentID } =
      req.body;
    const submissions = await Submission.find({
      courseID: courseID,
      assignmentID: assignmentID,
      questionID: questionID,
      languageName: languageName,
    });

    const finalSubmissions = submissions.filter(
      (item) => item.studentID !== studentID
    );

    res.status(200).send(finalSubmissions);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Update a submission
const updateSubmission = asyncHandler(async (req, res) => {
  try {
    const {
      courseID,
      assignmentID,
      questionID,
      studentID,
      answer,
      languageName,
      testCases,
    } = req.body;
    const submissions = await Submission.updateOne(
      {
        courseID: courseID,
        assignmentID: assignmentID,
        questionID: questionID,
        studentID: studentID,
      },
      {
        answer: answer,
        languageName: languageName,
        testCases: testCases,
      }
    );

    res.status(200).send(submissions);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  createSubmission,
  compareSubmission,
  getAllSubmissions,
  getCustomSubmissions,
  updateSubmission,
};
