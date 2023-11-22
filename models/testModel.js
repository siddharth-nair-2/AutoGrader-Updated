const mongoose = require("mongoose");

// Test Schema
const TestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Test name required"],
      minLength: [1, "Test name must be atleast 1 character long"],
      maxLength: [64, "Test name must be less than 65 characters long"],
    },
    description: {
      type: String,
      maxLength: [
        2000,
        "Test description must be less than 2001 characters long",
      ],
    },
    notes: {
      type: String,
      default: "No Notes",
      maxLength: [256, "Test notes must be less than 257 characters long"],
    },
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Course ID required"],
      ref: "Course",
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    visibleToStudents: {
      type: Boolean,
      required: true,
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
        options: [
          {
            value: {
              type: String,
              required: true,
            },
            isCorrect: {
              type: Boolean,
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for test name and course ID
TestSchema.index({ name: 1, courseID: 1 }, { unique: true });

const Test = mongoose.model("Test", TestSchema);
module.exports = {
  Test,
};
