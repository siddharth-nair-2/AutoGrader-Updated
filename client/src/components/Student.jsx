import axios from "axios";
import styled from "styled-components";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from 'antd';
import { useAuth } from "../context/AuthProvider";

import CourseCardMain from "./misc/CourseCard";
import Heading from "./misc/Heading";
import Navbar from "./misc/Navbar";

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  padding-bottom: 20px;
  background-color: #f4f3f6;
`;

const ViewCreateDiv = styled.div`
  display: flex;
  font-size: 24px;
  justify-content: space-evenly;
`;

const CourseBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
  margin: 25px;
`;

const CourseCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  padding-bottom: 10px;
  color: black;
  background-color: white;
  border-radius: 24px;
  width: 400px;
  height: 250px;
  box-shadow: 1px -1px 25px -1px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 1px -1px 25px -1px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 1px -1px 25px -1px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.002);
  }
`;

const CourseButtons = styled.button`
  border: none;
  outline: none;
  padding: 16px;
  background-color: black;
  border-radius: 24px;
  font-weight: bold;
  font-size: 14px;
  color: white;
  cursor: pointer;
  margin-right: 20px;
  box-shadow: 1px -1px 25px -1px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 1px -1px 25px -1px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 1px -1px 25px -1px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: scale(1.01);
  }
`;

const NoCoursesMessage = styled(CourseCard)`
  margin: auto;
  margin-top: 50px;
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
`;

const Student = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("courseInfo");
    localStorage.removeItem("assignmentInfo");
    localStorage.removeItem("submissionInfo");
    localStorage.removeItem("testCases");
    fetchAllCourses();
  }, [user]);

  const fetchAllCourses = async () => {
    const courseIDs = user?.courses?.map((course) => course.courseID) || [];
    if (courseIDs.length === 0) return;

    const url = `http://localhost:5000/api/tracker/studentCourses?courseIds=${courseIDs.join(
      ","
    )}`;

    try {
      const res = await axios.get(url);
      setCourses(res.data);
    } catch (error) {
      notification.error({
        message: "Error Occured!",
        description: "Failed to Load the courses",
        duration: 5,
        placement: "bottomLeft",
      });
    }
  };
  return (
    <Container>
      <Navbar />
      {courses && courses.length > 0 ? (
        <>
          <Heading>COURSES</Heading>
          <CourseBox>
            {courses.slice(0, 8).map((course) => {
              let desc = course.description;
              if (desc.length > 120) {
                desc = desc.substring(0, 114) + "...";
              }
              return (
                <CourseCardMain
                  isStudent={true}
                  key={course._id}
                  course={course}
                  description={desc}
                />
              );
            })}
          </CourseBox>
          {courses.length > 8 && (
            <ViewCreateDiv>
              <CourseButtons>View All Courses</CourseButtons>
            </ViewCreateDiv>
          )}
        </>
      ) : (
        <NoCoursesMessage>You have no courses!</NoCoursesMessage>
      )}
    </Container>
  );
};

export default Student;
