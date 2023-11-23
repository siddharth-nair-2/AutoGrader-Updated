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
  createTheoryAssignment,
  updateTheoryAssignment,
  deleteTheoryAssignment,
  getTheoryAssignments,
  getStudentTheoryAssignments,
} = require("../controllers/theoryAssignmentController");

const {
  getCombinedAssignments,
  getStudentVisibleAssignments,
  searchAssignmentsByName,
  filterAssignmentsByDate,
} = require("../controllers/combinedAssignmentController");

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
router.post("/plagiarism", plagiarismCreate);

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

// Theory Assignment Routes
router.post("/theoryAssignments", createTheoryAssignment);
router.patch("/theoryAssignments/:assignmentID", updateTheoryAssignment);
router.delete("/theoryAssignments/:assignmentID", deleteTheoryAssignment);
router.get("/theoryAssignments", getTheoryAssignments);
router.get("/studentTheoryAssignments", getStudentTheoryAssignments);

// Combined Assignment Routes
router.get("/allAssignments", getCombinedAssignments);
router.get("/allAssignments/visible", getStudentVisibleAssignments);
router.get("/allAssignments/filterByDate", filterAssignmentsByDate);
router.get("/allAssignments/searchByName", searchAssignmentsByName);

// Test Routes
router.post("/test", createTest);
router.patch("/test/:testID", updateTest);
router.delete("/test/:testID", deleteTest);
router.get("/tests/course/:courseID", getTestsForCourse);
router.get("/tests/student/:courseID", getStudentTests);
router.get("/test/:testID", getSingleTest);
router.get("/tests", getAllTests);

// Module Routes
router.post("/module", createModule);
router.patch("/module/:moduleID", updateModule);
router.delete("/module/:moduleID", deleteModule);
router.get("/modules/course/:courseID", getModulesForCourse);
router.get("/module/:moduleID", getSingleModule);
router.get("/modules", getAllModules);

module.exports = router;
