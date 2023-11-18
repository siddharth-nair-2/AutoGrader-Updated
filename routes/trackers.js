const express = require("express");
const {
  // course imports
  courseCreate,
  getCourses,
  getSingleCourse,
  getStudentCourses,
  // assignment imports
  AssignmentCreate,
  updateAssignment,
  getAssignments,
  getStudentAssignments,
  AssignmentDelete,
  // submission imports
  createSubmission,
  compareSubmission,
  getAllSubmissions,
  getCustomSubmissions,
  updateSubmission,
  // plagiarism imports
  plagiarismCreate,
  getAllPlagiarisms,
  // test imports
  createTest,
  updateTest,
  deleteTest,
  getTests,
  getStudentTests,
  getAllTests,
  // module imports
  createModule,
  updateModule,
} = require("../controllers/trackerControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Course Routes
router.route("/course").post(courseCreate);
router.route("/courseGet").post(getCourses);
router.route("/allStudentCourses").post(getStudentCourses);
router.route("/singleCourse").post(getSingleCourse);
router.route("/submission").post(createSubmission);

// Submission Routes
router.route("/comparesubmission").post(compareSubmission);
router.route("/updatesubmission").post(updateSubmission);
router.route("/getAllSubmissions").post(getAllSubmissions);
router.route("/getCustomSubmissions").post(getCustomSubmissions);

// Plagiarism Routes
router.route("/getAllPlagiarism").post(getAllPlagiarisms);
router.route("/createComparison").post(plagiarismCreate);

// Assignment Routes
router.route("/assignment").post(AssignmentCreate);
router.route("/assignmentDelete").post(AssignmentDelete);
router.route("/assignmentGet").post(getAssignments);
router.route("/updateAssignment").post(updateAssignment);
router.route("/studentAssignmentsGet").post(getStudentAssignments);

// Test Routes
router.route("/createTest").post(createTest);
router.route("/updateTest").post(updateTest);
router.route("/deleteTest").post(deleteTest);
router.route("/getTestsForCourse").post(getTests);
router.route("/getStudentTests").post(getStudentTests);
router.route("/getAllTests").post(getAllTests);

// Module Routes
router.route("/createModule").post(createModule);
router.route("/updateModule").post(updateModule);

module.exports = router;
