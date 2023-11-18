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
} = require("../controllers/trackerControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/course").post(courseCreate);
router.route("/submission").post(createSubmission);
router.route("/comparesubmission").post(compareSubmission);
router.route("/updatesubmission").post(updateSubmission);
router.route("/getAllSubmissions").post(getAllSubmissions);
router.route("/getAllPlagiarism").post(getAllPlagiarisms);
router.route("/getCustomSubmissions").post(getCustomSubmissions);
router.route("/courseGet").post(getCourses);
router.route("/allStudentCourses").post(getStudentCourses);
router.route("/singleCourse").post(getSingleCourse);
router.route("/assignment").post(AssignmentCreate);
router.route("/assignmentDelete").post(AssignmentDelete);
router.route("/assignmentGet").post(getAssignments);
router.route("/updateAssignment").post(updateAssignment);
router.route("/studentAssignmentsGet").post(getStudentAssignments);
router.route("/createComparison").post(plagiarismCreate);
router.route("/createTest").post(createTest);

module.exports = router;
