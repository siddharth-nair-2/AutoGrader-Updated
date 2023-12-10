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
import CreateAssignments2 from "./components/InstructorPages/assignments/duplicateCreateAssignments";

export const instructorRoutes = [
  { path: "/", element: <Instructor /> },
  { path: "/createcourses", element: <CreateCourses /> },
  { path: "/createassignment", element: <CreateAssignments /> },
  { path: "/createassignment2", element: <CreateAssignments2 /> },
  { path: "/createTheoryAssignment", element: <CreateTheoryAssignment /> },
  { path: "/course", element: <Courses /> },
  {
    path: "/viewassignment",
    element: <ViewAssignmentSubmission />,
  },
  { path: "/viewallassignments", element: <ViewAllAssignments /> },
  { path: "/viewallmodules", element: <ViewAllModules /> },
  { path: "/viewalltests", element: <ViewAllTests /> },
  { path: "/courseStudents", element: <CourseStudents /> },
  { path: "/viewSubmission", element: <SingleSubmission /> },
  { path: "/plagiarism", element: <PlagiarismPage /> },
];

export const studentRoutes = [
  { path: "/", element: <Student /> },
  { path: "/course", element: <StudentCourses /> },
  { path: "/viewassignment", element: <StudentAssignments /> },
];
