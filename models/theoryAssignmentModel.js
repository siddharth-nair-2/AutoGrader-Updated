const mongoose = require("mongoose");

// Theory Assignment Schema
const TheoryAssignmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Assignment name is required"],
      minLength: [1, "Assignment name must be at least 1 character long"],
      maxLength: [100, "Assignment name must be less than 100 characters long"],
    },
    description: {
      type: String,
      required: [true, "Assignment description is required"],
      maxLength: [
        2000,
        "Assignment description must be less than 2000 characters long",
      ],
    },
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Course ID is required"],
      ref: "Course",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    visibleToStudents: {
      type: Boolean,
      required: true,
      default: false,
    },
    instructorFiles: [
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
  },
  {
    timestamps: true,
  }
);
// Compound index for assignment name and course ID
TheoryAssignmentSchema.index({ name: 1, courseID: 1 }, { unique: true });

TheoryAssignmentSchema.pre("save", async function (next) {
  const theoryAssignment = this;

  // Check in TheoryAssignment collection
  const existingTheoryAssignment = await this.constructor.findOne({
    title: theoryAssignment.title,
    courseID: theoryAssignment.courseID,
  });

  if (
    existingTheoryAssignment &&
    existingTheoryAssignment._id.toString() !== theoryAssignment._id.toString()
  ) {
    throw new Error(
      "A theory assignment with this title already exists in this course."
    );
  }

  // Check in Assignment collection
  const existingAssignment = await mongoose.model("Assignment").findOne({
    name: theoryAssignment.title,
    courseID: theoryAssignment.courseID,
  });

  if (existingAssignment) {
    throw new Error(
      "An assignment with this name already exists in this course."
    );
  }

  next();
});

const TheoryAssignment = mongoose.model(
  "TheoryAssignment",
  TheoryAssignmentSchema
);

module.exports = {
  TheoryAssignment,
};
