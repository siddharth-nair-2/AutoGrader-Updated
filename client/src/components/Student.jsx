import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CourseCardMain from "./misc/CourseCard";
import Heading from "./misc/Heading";
import Navbar from "./misc/Navbar";
import styles from "./styles.module.css";

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
const Student = () => {
  const [userData, setUserData] = useState();
  const [courses, setCourses] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userInfo")));
    localStorage.removeItem("courseInfo");
    localStorage.removeItem("assignmentInfo");
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    let urlCourses = [];
    for (
      let i = 0;
      i < JSON.parse(localStorage.getItem("userInfo"))?.courses?.length;
      i++
    ) {
      urlCourses.push(
        JSON.parse(localStorage.getItem("userInfo")).courses[i].courseID
      );
    }
    if (urlCourses.length < 1) {
      return;
    }
    const url = `http://localhost:5000/api/tracker/studentCourses?courseIds=${urlCourses.toString()}`;
    try {
      const data = await axios.get(url);
      setCourses(data.data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the courses",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <Container>
      <Navbar />
      {courses && courses.length > 0 && (
        <>
          <Heading>COURSES</Heading>
          <CourseBox>
            {courses &&
              courses.length > 0 &&
              courses.slice(0, 8).map((course) => {
                let desc = course.description;
                if (desc.length > 120) {
                  desc = desc.substring(0, 114);
                  desc += "...";
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
          <ViewCreateDiv>
            {courses.length > 8 && (
              <CourseButtons>View All Courses</CourseButtons>
            )}
          </ViewCreateDiv>
        </>
      )}
      {courses && courses.length < 1 && (
        <>
          <CourseCard
            style={{
              margin: "auto",
              marginTop: "50px",
              marginBottom: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "24px",
              fontWeight: "500",
            }}
          >
            You have no courses!
          </CourseCard>
        </>
      )}
    </Container>
  );
};

export default Student;
