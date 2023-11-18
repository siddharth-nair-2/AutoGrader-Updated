const asyncHandler = require("express-async-handler");
const { Mongoose } = require("mongoose");
const {
  Assignment,
  Course,
  Submission,
  Plagiarism,
} = require("../models/trackerModel");

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
    !visibleToStudents
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
  courseCreate,
  getCourses,
  AssignmentCreate,
  updateAssignment,
  getAssignments,
  getSingleCourse,
  getStudentCourses,
  getStudentAssignments,
  createSubmission,
  compareSubmission,
  plagiarismCreate,
  getAllSubmissions,
  getCustomSubmissions,
  updateSubmission,
  getAllPlagiarisms,
  AssignmentDelete,
};
