import Editor from "@monaco-editor/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TrackerState } from "../../../Context/TrackerProvider";
import Navbar from "../../misc/Navbar";

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  padding-bottom: 20px;
  background-color: #f4f3f6;
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

const AssignmentNameDiv = styled.div`
  width: 100%;
  padding: 10px;
  font-weight: 600;
  position: relative;
  font-size: 16px;
  background-color: #5bb38a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QuestionBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  gap: 50px;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 10px;
`;

const QuestionInfo = styled.div`
  flex: 0.9;
  border: 1px solid black;
  border: #1e1e1e 2px solid;
  width: 100%;
  font-size: 18px;
`;

const QNoDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e1e;
  color: white;
  padding: 10px;
`;

const QInfo = styled.div`
  width: 95%;
  font-size: 16px;
  padding: 10px;
  color: #1e1e1e;
`;

const EditorBox = styled.div`
  width: 60%;
  flex: 3;
`;

const Select = styled.select`
  border: #1e1e1e 2px solid;
  padding: 8px;
  width: 15%;
  border-radius: 46px;
  background-color: white;
  margin-bottom: 10px;
  font-size: 12px;
`;

const UserInfoBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const SingleSubmission = () => {
  const [activeSubmission, setActiveSubmission] = useState();
  const { selectedCourse, setSelectedCourse, user } = TrackerState();
  const [selectedAssignment, setSelectedAssignment] = useState();
  const [userTheme, setUserTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(16);

  const options = {
    fontSize: fontSize,
    readOnly: true,
    domReadOnly: true,
  };

  const themesList = [
    { value: "vs-dark", label: "Dark" },
    { value: "light", label: "Light" },
  ];
  const navigate = useNavigate();
  useEffect(() => {
    setActiveSubmission(JSON.parse(localStorage.getItem("submissionInfo")));
    setSelectedAssignment(JSON.parse(localStorage.getItem("assignmentInfo")));
    setSelectedCourse(JSON.parse(localStorage.getItem("courseInfo")));
    if (!localStorage.getItem("submissionInfo")) {
      navigate("/viewassignment");
    } else {
      setSelectedCourse(JSON.parse(localStorage.getItem("courseInfo")));
      setActiveSubmission(JSON.parse(localStorage.getItem("submissionInfo")));
      setSelectedAssignment(JSON.parse(localStorage.getItem("assignmentInfo")));
    }
  }, []);

  return (
    <Container>
      <Navbar />
      {selectedCourse && selectedAssignment && activeSubmission && (
        <>
          <AssignmentNameDiv>
            <Link to={"/viewassignment"}>
              <CourseButtons
                style={{
                  position: "absolute",
                  left: "1%",
                  top: "13%",
                  fontSize: "14px",
                  padding: "5px 10px 5px 10px",
                  cursor: "pointer",
                }}
              >
                {`< Back`}
              </CourseButtons>
            </Link>

            {`${selectedCourse?.name.toUpperCase()} - ${
              selectedAssignment?.name
            }`}
          </AssignmentNameDiv>
          <QuestionBox>
            <div
              style={{
                width: "15%",
              }}
            >
              <QuestionInfo>
                <QNoDiv>Question {activeSubmission.questionNum}</QNoDiv>
                <QInfo>{activeSubmission.questionInfo}</QInfo>
              </QuestionInfo>
              <QuestionInfo style={{ marginTop: "50px" }}>
                <QInfo>
                  Language:{" "}
                  {activeSubmission.languageName === "62"
                    ? "Java"
                    : activeSubmission.languageName === "50"
                    ? "C"
                    : activeSubmission.languageName === "54"
                    ? "C++"
                    : "Python"}
                </QInfo>
              </QuestionInfo>
              <QuestionInfo style={{ marginTop: "50px" }}>
                <QInfo>Test Cases Passed: {activeSubmission.testCases}</QInfo>
              </QuestionInfo>
              <QuestionInfo style={{ marginTop: "50px" }}>
                <QInfo>Code By: {activeSubmission.studentName}</QInfo>
              </QuestionInfo>
            </div>
            <EditorBox>
              <UserInfoBox>
                <Select
                  value={userTheme}
                  onChange={(e) => setUserTheme(e.target.value)}
                  placeholder={userTheme}
                >
                  {themesList.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    justifyContent: "cennter",
                    alignItems: "center",
                  }}
                >
                  <label>Font Size: </label>
                  <input
                    type="range"
                    min="14"
                    max="30"
                    value={fontSize}
                    step="2"
                    style={{ backgroundColor: "green" }}
                    onChange={(e) => {
                      setFontSize(e.target.value);
                    }}
                  />
                </div>
              </UserInfoBox>
              <div style={{ width: "100%", border: "2px solid #1e1e1e" }}>
                <Editor
                  options={options}
                  height="calc(72vh - 50px)"
                  width="100%"
                  theme={userTheme}
                  defaultLanguage="java"
                  keepCurrentModel={true}
                  saveViewState={false}
                  value={activeSubmission.answer}
                />
              </div>
            </EditorBox>
          </QuestionBox>
        </>
      )}
    </Container>
  );
};

export default SingleSubmission;
