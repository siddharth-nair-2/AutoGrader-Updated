import { Route, Routes, Navigate } from "react-router-dom";
import Instructor from "./components/Instructor";
import Signup from "./components/Auth/SignUp";
import Login from "./components/Auth/Login";
import { ChakraProvider } from "@chakra-ui/react";
import Student from "./components/Student";
import NotFound from "./components/NotFound";
import CreateCourses from "./components/InstructorPages/courses/createCourses";
import Courses from "./components/InstructorPages/courses/Courses";
import CreateAssignments from "./components/InstructorPages/assignments/CreateAssignments";
import CourseStudents from "./components/InstructorPages/courses/CourseStudents";
import StudentCourses from "./components/StudentPages/courses/StudentCourses";
import StudentAssignments from "./components/StudentPages/assignments/StudentAssignments";
import ViewAssignmentSubmission from "./components/InstructorPages/assignments/ViewAssignmentSubmission";
import SingleSubmission from "./components/InstructorPages/assignments/SingleSubmission";
import PlagiarismPage from "./components/InstructorPages/assignments/PlagiarismPage";
import ViewAllAssignments from "./components/InstructorPages/assignments/ViewAllAssignments";
import ViewAllModules from "./components/InstructorPages/modules/ViewAllModules";
import ViewAllTests from "./components/InstructorPages/tests/ViewAllTests";

function App() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  // Function to render routes specific to a user type
  const renderRoutesForUser = (userType, routes) => {
    return (
      user &&
      user.userType === userType &&
      routes.map((route) => <Route key={route.path} {...route} />)
    );
  };

  // Define routes specific to 'Instructor' and 'Student'
  const instructorRoutes = [
    { path: "/", exact: true, element: <Instructor /> },
    { path: "/createcourses", exact: true, element: <CreateCourses /> },
    { path: "/createassignment", exact: true, element: <CreateAssignments /> },
    { path: "/course", exact: true, element: <Courses /> },
    {
      path: "/viewassignment",
      exact: true,
      element: <ViewAssignmentSubmission />,
    },
    { path: "/viewallassignments", exact: true, element: <ViewAllAssignments />},
    { path: "/viewallmodules", exact: true, element: <ViewAllModules />},
    { path: "/viewalltests", exact: true, element: <ViewAllTests />},
    { path: "/courseStudents", exact: true, element: <CourseStudents /> },
    { path: "/viewSubmission", exact: true, element: <SingleSubmission /> },
    { path: "/plagiarism", exact: true, element: <PlagiarismPage /> },
  ];

  const studentRoutes = [
    { path: "/", exact: true, element: <Student /> },
    { path: "/course", exact: true, element: <StudentCourses /> },
    { path: "/viewassignment", exact: true, element: <StudentAssignments /> },
  ];
  return (
    <ChakraProvider>
      <Routes>
        {renderRoutesForUser("Instructor", instructorRoutes)}
        {renderRoutesForUser("Student", studentRoutes)}

        {/* Redirects for logged-in users */}
        {user && (
          <>
            <Route path="/login" element={<Navigate replace to="/" />} />
            <Route path="/signup" element={<Navigate replace to="/" />} />
          </>
        )}

        {/* Public routes */}
        {!user && (
          <>
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/" element={<Navigate replace to="/login" />} />
          </>
        )}

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
