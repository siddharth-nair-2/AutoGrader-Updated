import { Toast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TrackerState } from "../../../context/TrackerProvider";
import AssignmentCard from "../../misc/AssignmentCard";
import Heading from "../../misc/Heading";
import Navbar from "../../misc/Navbar";

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  height: 100vh;
  padding-bottom: 20px;
  background-color: #f4f3f6;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
`;

const SingleContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CourseCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  color: black;
  background-color: white;
  border-radius: 24px;
  width: 600px;
  height: 100px;
  margin: auto;
  margin-top: 50px;
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
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
  font-size: 16px;
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

const ViewCreateDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
  height: 80%;
`;

const CourseBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
  margin: 25px;
`;

const Courses = () => {
  const { selectedCourse, setSelectedCourse } = TrackerState();
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("courseInfo"))) {
      navigate("/");
    }
    setSelectedCourse(JSON.parse(localStorage.getItem("courseInfo")));
    localStorage.removeItem("assignmentInfo");
    localStorage.removeItem("testInfo");
    localStorage.removeItem("moduleInfo");
    localStorage.removeItem("submissionInfo");
  }, []);

  return (
    <Container>
      <Navbar />
      {selectedCourse && selectedCourse.name && (
        <>
          <Heading>
            <Link to={"/"}>
              <CourseButtons
                style={{
                  position: "absolute",
                  left: "1%",
                  fontSize: "14px",
                  padding: "5px 10px 5px 10px",
                  cursor: "pointer",
                }}
              >{`< Back`}</CourseButtons>
            </Link>
            {selectedCourse?.name.toUpperCase()}
          </Heading>

          <ViewCreateDiv>
            <CourseButtons onClick={(e) => navigate("/viewallassignments")} style={{width: "250px"}}>
              View All Assignments
            </CourseButtons>
            <CourseButtons onClick={(e) => navigate("/viewalltests")} style={{width: "250px"}}>
              View All Tests
            </CourseButtons>
            <CourseButtons onClick={(e) => navigate("/viewallmodules")} style={{width: "250px"}}>
              View All Modules
            </CourseButtons>
          </ViewCreateDiv>
        </>
      )}
    </Container>
  );
};

export default Courses;
