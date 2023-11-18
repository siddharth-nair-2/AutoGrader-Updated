const asyncHandler = require("express-async-handler");
const { Course } = require("../models/trackerModel");

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

module.exports = {
  courseCreate,
  getCourses,
  getSingleCourse,
  getStudentCourses,
};
