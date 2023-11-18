const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");

// -----------------------------
// User Authentication Controllers
// -----------------------------

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;

  if (!firstName || !lastName || !email || !password || !userType) {
    res.status(400);
    throw new Error("Please enter all the fields!");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send("InUse");
    throw new Error("This email is already in use!");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    userType,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new error("Unable to create user!");
  }
});

// Authenticate a user and return token
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (
    user &&
    (await user.matchPassword(password)) &&
    user.userType === "Student"
  ) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      courses: user.courses,
      userType: user.userType,
      token: generateToken(user._id),
    });
  } else if (
    user &&
    (await user.matchPassword(password)) &&
    user.userType === "Instructor"
  ) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).send("Invalid Credentials");
    throw new Error("Invalid Credentials");
  }
});


// -----------------------------
// Course Enrollment Controllers
// -----------------------------

// Add a course to a user's profile
const addCourses = asyncHandler(async (req, res) => {
  const { _id, courseID } = req.body;

  const userExists = await User.findById(_id);

  if (!userExists) {
    res.status(404);
    throw new Error("User does not exist!");
  }

  if (
    userExists.courses.findIndex((x) => {
      return x.courseID == courseID;
    }) != -1
  ) {
    res.status(404);
    throw new Error("Student already enrolled in the course!");
  }

  const updatedProfile = await User.findByIdAndUpdate(_id, {
    $push: {
      courses: {
        courseID: courseID,
      },
    },
  });

  if (!updatedProfile) {
    res.status(404);
    throw new Error("User does not exist!");
  } else {
    res.json(updatedProfile);
  }
});

// Remove a course from a user's profile
const removeCourses = asyncHandler(async (req, res) => {
  const { _id, courseID } = req.body;

  const userExists = await User.findById(_id);

  if (!userExists) {
    res.status(404);
    throw new Error("User does not exist!");
  }

  if (
    userExists.courses.findIndex((x) => {
      return x.courseID == courseID;
    }) == -1
  ) {
    res.status(404);
    throw new Error("Student isn't enrolled in this course!");
  }

  const updatedProfile = await User.findByIdAndUpdate(_id, {
    $pull: {
      courses: {
        courseID: courseID,
      },
    },
  });

  if (!updatedProfile) {
    res.status(404);
    throw new Error("User does not exist!");
  } else {
    res.json(updatedProfile);
  }
});


// -----------------------------
// User Information Retrieval Controllers
// -----------------------------

// Get all students
const getAllStudents = asyncHandler(async (req, res) => {
  try {
    const students = await User.find({ userType: "Student" });

    res.status(200).send(students);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Get students for a specific course
const getStudentsForCourse = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.body;
    const students = await User.find({ "courses.courseID": _id });

    res.status(200).send(students);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Retrieve all users based on a search query
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});


// Exporting all controllers
module.exports = {
  registerUser,
  authUser,
  allUsers,
  getStudentsForCourse,
  addCourses,
  getAllStudents,
  removeCourses,
};
