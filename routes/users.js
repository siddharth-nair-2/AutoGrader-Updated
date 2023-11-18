const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  getStudentsForCourse,
  addCourses,
  getAllStudents,
  removeCourses,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.route("/allStudents").get(getAllStudents);
router.route("/courseStudentsGet").post(getStudentsForCourse);
router.route("/addCourseToStudents").put(addCourses);
router.route("/removeCourseStudent").put(removeCourses);
router.post("/login", authUser);

module.exports = router;
