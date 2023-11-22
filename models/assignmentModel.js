const mongoose = require("mongoose");

// Assignment Schema
const AssignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Assignment name required"],
    minLength: [1, "Assignment name must be atleast 1 character long"],
    maxLength: [64, "Assignment name must be less than 65 characters long"],
  },
  description: {
    type: String,
    maxLength: [
      2000,
      "Assignment description must be less than 2001 characters long",
    ],
  },
  notes: {
    type: String,
    default: "No Notes",
    maxLength: [256, "Assignment notes must be less than 257 characters long"],
  },
  courseID: {
    type: String,
    require: [true, "Course ID required"],
  },
  due_date: {
    type: mongoose.Schema.Types.Date,
  },
  visibleToStudents: {
    type: Boolean,
    require: true,
  },
  questions: [
    {
      questionNum: {
        type: Number,
        required: true,
      },
      questionInfo: {
        type: String,
        required: true,
        maxLength: [
          2000,
          "Question information must be less than 2000 characters.",
        ],
      },
      files: [
        {
          fileName: {
            type: String,
            required: true,
          },
          filePath: {
            type: String,
            required: true,
          },
        },
      ],
      testCases: [
        {
          inputCase: {
            type: String,
            required: true,
          },
          expectedOutput: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

AssignmentSchema.pre("save", async function (next) {
  const assignment = this;

  // Check in Assignment collection
  const existingAssignment = await this.constructor.findOne({
    name: assignment.name,
    courseID: assignment.courseID,
  });

  if (
    existingAssignment &&
    existingAssignment._id.toString() !== assignment._id.toString()
  ) {
    throw new Error(
      "An assignment with this name already exists in this course."
    );
  }

  // Check in TheoryAssignment collection
  const existingTheoryAssignment = await mongoose
    .model("TheoryAssignment")
    .findOne({
      title: assignment.name,
      courseID: assignment.courseID,
    });

  if (existingTheoryAssignment) {
    throw new Error(
      "A theory assignment with this name already exists in this course."
    );
  }

  next();
});

const Assignment = mongoose.model("Assignment", AssignmentSchema);

module.exports = {
  Assignment,
};
