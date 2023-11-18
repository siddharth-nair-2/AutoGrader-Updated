const asyncHandler = require("express-async-handler");
const { Mongoose } = require("mongoose");
const {
  Assignment,
  Course,
  Submission,
  Plagiarism,
  Test,
} = require("../models/trackerModel");

// -----------------------------
// Course Management Controllers
// -----------------------------

// Create a new course
const courseCreate = asyncHandler(async (req, res) => {
  const { name, description, semester, instructor, courseID, section } =
    req.body;

  if (
    !courseID ||
    !name ||
    !description ||
    !semester ||
    !instructor ||
    !section
  ) {
    res.status(400);
    throw new Error("Please enter all the fields!");
  }
  const courseExists = await Course.findOne({
    courseID,
    semester,
    instructor,
    section,
  });
  if (courseExists) {
    res.status(400);
    throw new Error("This course already exists!");
  }
  const course = await Course.create({
    courseID,
    name,
    description,
    semester,
    instructor,
    section,
  });

  if (course) {
    res.status(201).json({
      _id: course._id,
      courseID: course.courseID,
      name: course.name,
      description: course.description,
      semester: course.semester,
      section: course.section,
      instructor: course.instructor,
    });
  }
});

// Get all courses for an instructor
const getCourses = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.body;
    const courses = await Course.find({ instructor: _id });

    res.status(200).send(courses);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Get a single course by ID
const getSingleCourse = asyncHandler(async (req, res) => {
  try {
    const { courseID } = req.body;
    const courses = await Course.find({ _id: courseID });

    res.status(200).send(courses);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Get courses for a student
const getStudentCourses = asyncHandler(async (req, res) => {
  try {
    const { courses } = req.body;

    const promises = courses.map((course) => {
      return Course.find({ _id: course.courseID });
    });

    const courseInformation = await Promise.all(promises);
    res.status(200).send(courseInformation);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

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

// -----------------------------
// Plagiarism Management Controllers
// -----------------------------

// Create or update a plagiarism record
const plagiarismCreate = asyncHandler(async (req, res) => {
  const {
    courseID,
    assignmentID,
    questionID,
    questionNum,
    languageName,
    student1Name,
    student_1_ID,
    student2Name,
    student_2_ID,
    similarity,
  } = req.body;

  if (
    !courseID ||
    !assignmentID ||
    !questionID ||
    !questionNum ||
    !languageName ||
    !student1Name ||
    !student_1_ID ||
    !student2Name ||
    !student_2_ID ||
    !similarity
  ) {
    res.status(400);
    throw new Error("Please enter all the fields!");
  }
  const comparisonExists = await Plagiarism.findOne({
    courseID,
    assignmentID,
    questionID,
    languageName,
    student_1_ID,
    student_2_ID,
  });
  let finalSimilarity = similarity;
  if (finalSimilarity > 100) finalSimilarity = 100;

  if (comparisonExists) {
    const submissions = await Plagiarism.updateOne(
      {
        courseID,
        assignmentID,
        questionID,
        languageName,
        student_1_ID,
        student_2_ID,
      },
      {
        similarity: finalSimilarity,
      }
    );
    if (submissions) {
      res.status(201).json({
        courseID,
        assignmentID,
        questionID,
        questionNum,
        languageName,
        student1Name,
        student_1_ID,
        student2Name,
        student_2_ID,
        similarity: finalSimilarity,
      });
    }
  } else {
    const plagiarism = await Plagiarism.create({
      courseID,
      assignmentID,
      questionID,
      questionNum,
      languageName,
      student1Name,
      student_1_ID,
      student2Name,
      student_2_ID,
      similarity: finalSimilarity,
    });

    if (plagiarism) {
      res.status(201).json({
        courseID,
        assignmentID,
        questionID,
        questionNum,
        languageName,
        student1Name,
        student_1_ID,
        student2Name,
        student_2_ID,
        similarity: finalSimilarity,
      });
    }
  }
});

// Get all plagiarism records for an assignment
const getAllPlagiarisms = asyncHandler(async (req, res) => {
  try {
    const { courseID, assignmentID } = req.body;
    const plagiarism = await Plagiarism.find({
      courseID: courseID,
      assignmentID: assignmentID,
    });

    res.status(200).send(plagiarism);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

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
  } = req.body;

  if (
    !name ||
    !description ||
    !notes ||
    !courseID ||
    !scheduledAt ||
    !duration ||
    visibleToStudents === null ||
    !questions
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
const getTests = asyncHandler(async (req, res) => {
  try {
    const { courseID } = req.body;
    const tests = await Test.find({ courseID: courseID });
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

// Exporting all controllers
module.exports = {
  // course exports
  courseCreate,
  getCourses,
  getSingleCourse,
  getStudentCourses,
  // assignment exports
  AssignmentCreate,
  updateAssignment,
  getAssignments,
  getStudentAssignments,
  AssignmentDelete,
  // submission exports
  createSubmission,
  compareSubmission,
  getAllSubmissions,
  getCustomSubmissions,
  updateSubmission,
  // plagiarism exports
  plagiarismCreate,
  getAllPlagiarisms,
  // test exports
  createTest,
  updateTest,
  deleteTest,
  getTests,
  getStudentTests,
  getAllTests,
};
