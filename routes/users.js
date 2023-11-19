const express = require("express");
const {
  registerUser,
  authenticateUser,
  searchUsers,
  getStudentsForCourse,
  addCourseToUser,
  getAllStudents,
  removeCourseFromUser,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// User Registration and Authentication
router.post("", registerUser);
router.post("/login", authenticateUser);

// Course Enrollment
router.put("/:userID/courses/add/:courseID", addCourseToUser);
router.put("/:userID/courses/remove/:courseID", removeCourseFromUser);

// User Information Retrieval
router.get("/students", getAllStudents);
router.get("/students/course/:courseID", getStudentsForCourse);
router.get("", protect, searchUsers);
/* FIX ON FRONTEND */
// router.route("/").post(registerUser).get(protect, searchUsers );
// router.route("/allStudents").get(getAllStudents);
// router.route("/courseStudentsGet").post(getStudentsForCourse);
// router.route("/addCourseToStudents").put(addCourseToUser);
// router.route("/removeCourseStudent").put(removeCourseFromUser);
// router.post("/login", authenticateUser);

module.exports = router;
