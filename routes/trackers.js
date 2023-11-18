const express = require("express");
const {
  courseCreate,
  getCourses,
  getSingleCourse,
  getStudentCourses,
} = require("../controllers/courseController");
const {
  AssignmentCreate,
  updateAssignment,
  getAssignments,
  getStudentAssignments,
  AssignmentDelete,
} = require("../controllers/assignmentController");

const {
  createSubmission,
  compareSubmission,
  getAllSubmissions,
  getCustomSubmissions,
  updateSubmission,
} = require("../controllers/submissionController");

const {
  plagiarismCreate,
  getAllPlagiarisms,
} = require("../controllers/plagiarismController");

const {
  createTest,
  updateTest,
  deleteTest,
  getTestsForCourse,
  getStudentTests,
  getAllTests,
  getSingleTest,
} = require("../controllers/testController");

const {
  createModule,
  updateModule,
  deleteModule,
  getSingleModule,
  getModulesForCourse,
  getAllModules,
} = require("../controllers/moduleController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Course Routes
router.post("/courses", courseCreate);
router.get("/courses", getCourses);
router.get("/courses/:courseID", getSingleCourse);
router.get("/studentCourses", getStudentCourses);

/* FIX ON FRONTEND */
// router.route("/course").post(courseCreate);
// router.route("/courseGet").post(getCourses);
// router.route("/allStudentCourses").post(getStudentCourses);
// router.route("/singleCourse").post(getSingleCourse);

// Submission Routes
router.post("/submission", createSubmission);
router.get("/submission/compare", compareSubmission);
router.get("/submission/custom", getCustomSubmissions);
router.get("/submissions", getAllSubmissions);
router.patch("/submission/update", updateSubmission);

/* FIX ON FRONTEND */
// router.route("/submission").post(createSubmission);
// router.route("/comparesubmission").post(compareSubmission);
// router.route("/updatesubmission").post(updateSubmission);
// router.route("/getAllSubmissions").post(getAllSubmissions);
// router.route("/getCustomSubmissions").post(getCustomSubmissions);

// Plagiarism Routes
router.get("/plagiarism", getAllPlagiarisms);
router.post("/createComparison", plagiarismCreate);

/* FIX ON FRONTEND */
// router.route("/getAllPlagiarism").post(getAllPlagiarisms);
// router.route("/createComparison").post(plagiarismCreate);

// Assignment Routes
router.post("/assignments", AssignmentCreate);
router.patch("/assignments/:assignmentID", updateAssignment);
router.delete("/assignments/:assignmentID", AssignmentDelete);
router.get("/assignments", getAssignments);
router.get("/studentAssignments", getStudentAssignments);

/* FIX ON FRONTEND */
// router.route("/assignmentGet").post(getAssignments);
// router.route("/assignment").post(AssignmentCreate);
// router.route("/assignmentDelete").post(AssignmentDelete);
// router.route("/updateAssignment").post(updateAssignment);
// router.route("/studentAssignmentsGet").post(getStudentAssignments);

// Test Routes
router.route("/createTest").post(createTest);
router.route("/updateTest").post(updateTest);
router.route("/deleteTest").post(deleteTest);
router.route("/getSingleTest").post(getSingleTest);
router.route("/getTestsForCourse").post(getTestsForCourse);
router.route("/getStudentTests").post(getStudentTests);
router.route("/getAllTests").post(getAllTests);

// Module Routes
router.route("/createModule").post(createModule);
router.route("/updateModule").post(updateModule);
router.route("/deleteModule").post(deleteModule);
router.route("/getSingleModule").post(getSingleModule);
router.route("/getModulesForCourse").post(getModulesForCourse);
router.route("/getAllModules").post(getAllModules);

module.exports = router;
