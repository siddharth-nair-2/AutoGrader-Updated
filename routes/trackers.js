const express = require("express");
const {
  courseCreate,
  getCourses,
  AssignmentCreate,
  getAssignments,
  getSingleCourse,
  getStudentCourses,
  getStudentAssignments,
  createSubmission,
  compareSubmission,
  getAllSubmissions,
  plagiarismCreate,
  getCustomSubmissions,
  updateSubmission,
  getAllPlagiarisms,
  AssignmentDelete,
  updateAssignment,
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

module.exports = router;
