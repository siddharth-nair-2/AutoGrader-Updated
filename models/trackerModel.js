const mongoose = require("mongoose");

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

const SubmissionsSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      require: [true, "Student name required"],
      minLength: [1, "Student name must be atleast 1 character long"],
      maxLength: [64, "Student name must be less than 65 characters long"],
    },
    studentID: {
      type: String,
      require: [true, "Student ID required"],
    },
    assignmentID: {
      type: String,
      require: [true, "Assignment ID required"],
    },
    courseID: {
      type: String,
      require: [true, "Course ID required"],
    },
    questionID: {
      type: String,
      require: [true, "Question ID required"],
    },
    questionNum: {
      type: String,
      require: [true, "Question Number required"],
    },
    questionInfo: {
      type: String,
      require: [true, "Question Information required"],
    },
    languageName: {
      type: String,
      require: [true, "Language Information required"],
    },
    testCases: {
      type: String,
      require: [true, "Test Cases Information required"],
    },
    answer: {
      type: String,
      require: [true, "Answer Required"],
    },
  },
  {
    timestamps: true,
  }
);

const CourseSchema = new mongoose.Schema({
  courseID: {
    type: String,
    require: true,
    minLength: [1, "Course name must be atleast 1 character long"],
    maxLength: [10, "Course name must be less than 11 characters long"],
  },
  section: {
    type: String,
    require: true,
    minLength: [1, "Course section must be atleast 1 character long"],
    maxLength: [1, "Course section must be less than 2 characters long"],
  },
  name: {
    type: String,
    require: [true, "Course name required"],
    minLength: [1, "Course name must be atleast 1 character long"],
    maxLength: [64, "Course name must be less than 65 characters long"],
  },
  description: {
    type: String,
    maxLength: [
      2000,
      "Course description must be less than 2001 characters long",
    ],
  },
  semester: {
    type: String,
    require: [true, "Semester required"],
  },
  instructor: {
    type: String,
    require: [true, "Instructor ID required"],
  },
});

const PlagiarismSchema = new mongoose.Schema({
  courseID: {
    type: String,
    require: true,
  },
  assignmentID: {
    type: String,
    require: true,
  },
  questionID: {
    type: String,
    require: true,
  },
  questionNum: {
    type: Number,
    require: true,
  },
  languageName: {
    type: String,
    require: true,
  },
  student1Name: {
    type: String,
    require: [true, "Student 1 name required"],
  },
  student_1_ID: {
    type: String,
    require: [true, "Student 1 ID required"],
  },
  student2Name: {
    type: String,
    require: [true, "Student 2  required"],
  },
  student_2_ID: {
    type: String,
    require: [true, "Student 2 ID required"],
  },
  similarity: {
    type: Number,
    require: [true, "Similarity required"],
  },
});

const Assignment = mongoose.model("Assignment", AssignmentSchema);
const Course = mongoose.model("Course", CourseSchema);
const Submission = mongoose.model("Submission", SubmissionsSchema);
const Plagiarism = mongoose.model("Plagiarism", PlagiarismSchema);

module.exports = {
  Assignment,
  Course,
  Plagiarism,
  Submission,
};
