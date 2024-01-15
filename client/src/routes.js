import Instructor from "./components/Instructor";
import Student from "./components/Student";
import CreateCourses from "./components/InstructorPages/courses/createCourses";
import Courses from "./components/InstructorPages/courses/Courses";
import CreateAssignments from "./components/InstructorPages/assignments/CreateAssignments";
import CreateTheoryAssignment from "./components/InstructorPages/assignments/CreateTheoryAssignment";
import CourseStudents from "./components/InstructorPages/courses/CourseStudents";
import StudentCourses from "./components/StudentPages/courses/StudentCourses";
import StudentAssignments from "./components/StudentPages/assignments/StudentAssignments";
import ViewAssignmentSubmission from "./components/InstructorPages/assignments/ViewAssignmentSubmission";
import SingleSubmission from "./components/InstructorPages/assignments/SingleSubmission";
import PlagiarismPage from "./components/InstructorPages/assignments/PlagiarismPage";
import ViewAllAssignments from "./components/InstructorPages/assignments/ViewAllAssignments";
import ViewAllModules from "./components/InstructorPages/modules/ViewAllModules";
import ViewAllTests from "./components/InstructorPages/tests/ViewAllTests";
import StudentTheoryAssignments from "./components/StudentPages/assignments/StudentTheoryAssignments";
import ViewTheoryAssignmentSubmission from "./components/InstructorPages/assignments/ViewTheoryAssignmentSubmission";
import SingleTheorySubmission from "./components/InstructorPages/assignments/SingleTheorySubmission";
import CreateTest from "./components/InstructorPages/tests/CreateTests";
import StudentTests from "./components/StudentPages/tests/StudentTests";
import ViewTestSubmissions from "./components/InstructorPages/tests/ViewTestSubmissions";
import SingleTestSubmission from "./components/InstructorPages/tests/SingleTestSubmission";
import CreateModules from "./components/InstructorPages/modules/CreateModules";

export const instructorRoutes = [
  { path: "/", element: <Instructor /> },

  // Courses
  { path: "/createcourses", element: <CreateCourses /> },
  { path: "/course", element: <Courses /> },
  { path: "/courseStudents", element: <CourseStudents /> },

  // Assignments
  { path: "/createassignment", element: <CreateAssignments /> },
  { path: "/createTheoryAssignment", element: <CreateTheoryAssignment /> },
  { path: "/viewassignment", element: <ViewAssignmentSubmission /> },
  {
    path: "/viewtheoryassignment",
    element: <ViewTheoryAssignmentSubmission />,
  },
  { path: "/viewallassignments", element: <ViewAllAssignments /> },
  { path: "/plagiarism", element: <PlagiarismPage /> },

  // Assignment Submissions
  { path: "/viewSubmission", element: <SingleSubmission /> },
  { path: "/viewTheorySubmission", element: <SingleTheorySubmission /> },

  // Tests
  { path: "/createtest", element: <CreateTest /> },
  { path: "/viewalltests", element: <ViewAllTests /> },

  // Test Submissions
  { path: "/viewtest", element: <ViewTestSubmissions /> },
  { path: "/viewtestsubmission/:id", element: <SingleTestSubmission /> },

  // Modules
  { path: "/createmodule", element: <CreateModules /> },
  { path: "/viewallmodules", element: <ViewAllModules /> },
];

export const studentRoutes = [
  { path: "/", element: <Student /> },
  { path: "/course", element: <StudentCourses /> },
  { path: "/viewassignment", element: <StudentAssignments /> },
  { path: "/viewtest", element: <StudentTests /> },
  { path: "/viewtheoryassignment", element: <StudentTheoryAssignments /> },
];
