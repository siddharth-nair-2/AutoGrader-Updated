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

const ViewAllTests = () => {
  const { selectedCourse, setSelectedCourse } = TrackerState();
  const [tests, settests] = useState([]);
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
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const data = await axios.post(
        "http://localhost:5000/api/tracker/assignmentGet",
        {
          _id: JSON.parse(localStorage.getItem("courseInfo"))._id,
        }
      );
      settests(data.data);
    } catch (error) {
      Toast({
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
      {selectedCourse && selectedCourse.name && (
        <>
          <Heading>
            <Link to={"/course"}>
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
          {tests?.length > 0 ? (
            <CourseBox>
              {tests.length > 0 &&
                tests.map((assignment) => {
                  return (
                    <AssignmentCard
                      key={assignment._id}
                      assignment={assignment}
                    />
                  );
                })}
            </CourseBox>
          ) : (
            <CourseCard>You have no tests for this course!</CourseCard>
          )}
          <ViewCreateDiv>
            <CourseButtons onClick={(e) => navigate("/createAssignment")}>
              + New Tests
            </CourseButtons>
          </ViewCreateDiv>
        </>
      )}
    </Container>
  );
};

export default ViewAllTests;
