import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TrackerState } from "../../../Context/TrackerProvider";
import Editor from "@monaco-editor/react";
import Navbar from "../../misc/Navbar";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

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

const QuestionsDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  padding: 10px;
`;

const QuestionSelected = styled.button`
  background-color: white;
  color: black;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 5px;
  font-size: 18;
  height: 35px;
  font-weight: 700;
  width: 35px;
`;

const QuestionNotSelected = styled.button`
  background-color: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 5px;
  font-size: 18;
  height: 35px;
  font-weight: 700;
  width: 35px;
`;

const QuestionBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  gap: 50px;
  padding-left: 20px;
  padding-right: 20px;
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

const ButtonsBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 50px;
  padding: 10px;
`;

const ClearBtn = styled.button`
  border: none;
  outline: none;
  background-color: white;
  color: black;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 12px;
  border-radius: 46px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const BlackBtn = styled.button`
  border: none;
  outline: none;
  background-color: #5bb38a;
  color: white;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  margin: 5px 0;
  font-size: 14px;
  border-radius: 46px;
  font-weight: 600;
  letter-spacing: 0.5px;

  :disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

const CompileBtn = styled(BlackBtn)`
  background-color: black;
  :disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

const TestCasesBox = styled.div`
  height: 93.5%;
  display: flex;
  flex-direction: column;
  padding-top: 1.5px;
`;

const SingleTestCaseBox = styled.div`
  width: 100%;
  max-height: 215px;
  border-bottom: 0.5px solid black;
  flex-grow: 1;
  flex-basis: 0;
  flex-shrink: 0;
`;

const HeaderBoxTest = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  font-weight: 800;
  background-color: lightgray;
`;

const TestBodyContent = styled.div`
  overflow-y: scroll;
  font-family: "Consolas", sans-serif;
  font-size: 14px;
  max-height: 78%;
  background-color: #373737;
  color: white;
  min-height: 78%;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2px;
  width: 100%;
  padding: 5px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StudentAssignments = () => {
  const { selectedCourse, setSelectedCourse, user } = TrackerState();
  const [selectedAssignment, setSelectedAssignment] = useState();
  const [allQuestions, setAllQuestions] = useState();
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [userLang, setUserLang] = useState("62");
  const [userTheme, setUserTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(16);
  const [tempState, setTempState] = useState([]);
  const [userCode, setUserCode] = useState(
    "// Enter your code here, and name the class Main"
  );
  const [disabled, setDisabled] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const toast = useToast();

  const options = {
    fontSize: fontSize,
  };

  const languagesList = [
    { value: "50", label: "C" },
    { value: "54", label: "C++" },
    { value: "71", label: "Python" },
    { value: "62", label: "Java" },
  ];

  const themesList = [
    { value: "vs-dark", label: "Dark" },
    { value: "light", label: "Light" },
  ];
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedCourse(JSON.parse(localStorage.getItem("courseInfo")));
    setSelectedAssignment(JSON.parse(localStorage.getItem("assignmentInfo")));
    if (!JSON.parse(localStorage.getItem("courseInfo"))) {
      navigate("/");
    }
    if (!JSON.parse(localStorage.getItem("assignmentInfo"))) {
      navigate("/course");
    }
    let allQues = JSON.parse(
      localStorage.getItem("assignmentInfo")
    ).questions.sort((p1, p2) =>
      p1.questionNum > p2.questionNum
        ? 1
        : p1.questionNum < p2.questionNum
        ? -1
        : 0
    );
    setAllQuestions(allQues);

    setSelectedQuestion(allQues[0]);
    let arrayTestCase = [];
    localStorage.setItem("testCases", "");
    for (const element of allQues[0].testCases) {
      arrayTestCase.push({
        index: element.inputCase,
        expectedOutput: element.expectedOutput,
        color: "white",
        output: "",
        backgroundColor: "gray",
      });
    }
    localStorage.setItem("testCases", JSON.stringify(arrayTestCase));
  }, []);

  const handleQuestionChange = (question) => {
    if (userCode !== "// Enter your code here, and name the class Main") {
      if (window.confirm("Any unsubmitted changes will be lost!")) {
        setSelectedQuestion(question);
        setUserCode("// Enter your code here, and name the class Main");
        let arrayTestCase = [];
        for (const element of question.testCases) {
          arrayTestCase.push({
            index: element.inputCase,
            expectedOutput: element.expectedOutput,
            color: "white",
            output: "",
            backgroundColor: "gray",
          });
        }
        localStorage.setItem("testCases", JSON.stringify(arrayTestCase));
      }
    } else {
      setSelectedQuestion(question);
      setUserCode("// Enter your code here, and name the class Main");
      let arrayTestCase = [];
      for (const element of question.testCases) {
        arrayTestCase.push({
          index: element.inputCase,
          expectedOutput: element.expectedOutput,
          color: "white",
          output: "",
          backgroundColor: "gray",
        });
      }
      localStorage.setItem("testCases", JSON.stringify(arrayTestCase));
    }

    setSubmitDisabled(true);
  };

  const downloadCode = () => {
    let fileName = prompt("Please enter your file-name:", "myCode");
    if (fileName == null || fileName === "") {
    } else {
      const element = document.createElement("a");
      const file = new Blob([userCode], {
        type: "text/plain;charset-utf-8",
      });
      const langNow =
        userLang === "62"
          ? "java"
          : userLang === "50"
          ? "c"
          : userLang === "54"
          ? "cpp"
          : "py";
      element.href = URL.createObjectURL(file);
      element.download = `${fileName}.${langNow}`;
      document.body.appendChild(element);
      element.click();
    }
  };

  const compileCode = async () => {
    if (
      userCode === `` ||
      userCode === "// Enter your code here, and name the class Main"
    ) {
      return;
    } else {
      setDisabled(true);
      for await (const [
        index,
        singleCase,
      ] of selectedQuestion.testCases.entries()) {
        const data = {
          language_id: userLang,
          source_code: userCode,
          stdin: singleCase.inputCase,
          expected_output: singleCase.expectedOutput,
        };
        const options = {
          method: "POST",
          url: "https://judge0-server.siddharthnair.info/submissions/",
          data: data,
        };

        axios
          .request(options)
          .then(function (response) {
            const token = response.data.token;
            checkStatus(token, index);
          })
          .catch((err) => {
            let error = err.response ? err.response.data : err;
            setDisabled(false);
            console.log(error);
            toast({
              title: "Error",
              description: error.response.statusText,
              status: "error",
              duration: 4000,
              isClosable: true,
            });
          });
      }
    }
  };

  const checkStatus = async (token, caseIndex) => {
    const options = {
      method: "GET",
      url: "https://judge0-server.siddharthnair.info/submissions/" + token,
    };
    try {
      let response = await axios.request(options);

      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token, caseIndex);
        }, 2000);
        return;
      } else {
        let arrTemp = JSON.parse(localStorage.getItem("testCases"));
        if (!response.data.stdout) {
          if (response.data.compile_output) {
            arrTemp[caseIndex].output = response.data.compile_output;
          } else if (response.data.stderr) {
            arrTemp[caseIndex].output = response.data.stderr;
          }
          arrTemp[caseIndex].color = "#EA5053";
          arrTemp[caseIndex].backgroundColor = "#46282F";
          localStorage.setItem("testCases", JSON.stringify(arrTemp));
        } else {
          arrTemp[caseIndex].output = response.data.stdout;
          if (response.data.stdout !== arrTemp[caseIndex].expectedOutput) {
            arrTemp[caseIndex].color = "#EA5053";
            arrTemp[caseIndex].backgroundColor = "#46282F";
          } else {
            arrTemp[caseIndex].color = "#5CBAA4";
            arrTemp[caseIndex].backgroundColor = "#293D3A";
          }
          localStorage.setItem("testCases", JSON.stringify(arrTemp));
          setTempState(JSON.parse(localStorage.getItem("testCases")));
        }
        setDisabled(false);
        let totalCases = selectedQuestion.testCases.length;
        if (totalCases - 1 === caseIndex) {
          toast({
            title: "Success",
            description: "Compiled successfully!",
            status: "success",
            duration: 4000,
            isClosable: true,
          });

          setSubmitDisabled(false);
        }
        return;
      }
    } catch (error) {
      console.log("err", error);
      setDisabled(false);
      toast({
        title: "Error",
        description: error.response.statusText,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setUserCode(reader.result);
      setSubmitDisabled(true);
    };

    reader.onerror = () => {
      toast({
        title: "Error reading file",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    };
  };

  const handleBack = () => {
    if (window.confirm("All information entered will be lost!")) {
      navigate("/course");
    }
  };

  const handleQuestionSubmit = async () => {
    if (
      userCode === "// Enter your code here, and name the class Main" ||
      userCode === ""
    ) {
      toast({
        title: "No answer entered!",
        description: "Please enter an answer to submit this question!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setDisabled(true);
    try {
      const config = {
        Headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/tracker/comparesubmission",
        {
          studentID: user._id,
          questionID: selectedQuestion._id,
        },
        config
      );
      if (data.length > 0) {
        if (
          !window.confirm(
            "You already have previous submissions for this question, overwrite?"
          )
        ) {
          setDisabled(false);
          return;
        } else {
          try {
            let arrVal = JSON.parse(localStorage.getItem("testCases"));
            let passedCases = 0;
            arrVal.forEach((element) => {
              if (element.expectedOutput === element.output) {
                passedCases++;
              }
            });
            const config = {
              Headers: {
                "Content-type": "application/json",
              },
            };
            const { data } = await axios.post(
              "http://localhost:5000/api/tracker/updatesubmission",
              {
                courseID: selectedCourse._id,
                assignmentID: selectedAssignment._id,
                questionID: selectedQuestion._id,
                studentID: user._id,
                answer: userCode,
                languageName: userLang,
                testCases: `${passedCases}/${arrVal.length}`,
              },
              config
            );
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        try {
          const config = {
            Headers: {
              "Content-type": "application/json",
            },
          };

          let arrVal = JSON.parse(localStorage.getItem("testCases"));
          let passedCases = 0;
          arrVal.forEach((element) => {
            if (element.expectedOutput === element.output) {
              passedCases++;
            }
          });

          const { data } = await axios.post(
            "http://localhost:5000/api/tracker/submission",
            {
              studentName: `${user.firstName} ${user.lastName}`,
              studentID: user._id,
              assignmentID: selectedAssignment._id,
              courseID: selectedCourse._id,
              questionID: selectedQuestion._id,
              questionNum: selectedQuestion.questionNum,
              questionInfo: selectedQuestion.questionInfo,
              languageName: userLang,
              testCases: `${passedCases}/${arrVal.length}`,
              answer: userCode,
            },
            config
          );
          toast({
            title: `Question ${selectedQuestion.questionNum} submitted!`,
            description: "You have submitted the answer for this question!",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        } catch (error) {
          console.log(error);
          if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500
          ) {
            toast({
              title: "Error",
              description: error.response.statusText,
              status: "error",
              duration: 4000,
              isClosable: true,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const config = {
        Headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/tracker/getCustomSubmissions",
        {
          courseID: selectedCourse._id,
          assignmentID: selectedAssignment._id,
          questionID: selectedQuestion._id,
          languageName: userLang,
          studentID: user._id,
        },
        config
      );
      if (data.length > 0) {
        const otherSubmissions = data;
        try {
          let arrVal = JSON.parse(localStorage.getItem("testCases"));
          let passedCases = 0;
          arrVal.forEach((element) => {
            if (element.expectedOutput === element.output) {
              passedCases++;
            }
          });
          const config = {
            Headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post(
            // "https://plagiarism-server.siddharthnair.info/plagiarism/",
            "http://localhost:8080/plagiarism/",
            {
              studentName: `${user.firstName} ${user.lastName}`,
              studentID: user._id,
              assignmentID: selectedAssignment._id,
              courseID: selectedCourse._id,
              questionID: selectedQuestion._id,
              questionNum: selectedQuestion.questionNum,
              questionInfo: selectedQuestion.questionInfo,
              languageName: userLang,
              testCases: `${passedCases}/${arrVal.length}`,
              answer: userCode,
              otherSubmissions: otherSubmissions,
            },
            config
          );
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }

    setDisabled(false);
  };

  return (
    <Container>
      <Navbar />
      {selectedCourse &&
        selectedCourse.name &&
        selectedAssignment &&
        selectedAssignment.name &&
        allQuestions &&
        selectedQuestion && (
          <>
            <AssignmentNameDiv>
              <CourseButtons
                style={{
                  position: "absolute",
                  left: "1%",
                  top: "13%",
                  fontSize: "14px",
                  padding: "5px 10px 5px 10px",
                  cursor: "pointer",
                }}
                onClick={handleBack}
              >
                {`< Back`}
              </CourseButtons>

              {`${selectedCourse?.name.toUpperCase()} - ${
                selectedAssignment?.name
              }`}
            </AssignmentNameDiv>
            <QuestionsDiv>
              {allQuestions?.map((question) => {
                if (selectedQuestion._id !== question._id) {
                  return (
                    <QuestionSelected
                      key={question._id}
                      onClick={() => handleQuestionChange(question)}
                    >
                      {question.questionNum}
                    </QuestionSelected>
                  );
                } else {
                  return (
                    <QuestionNotSelected
                      key={question._id}
                      onClick={() => handleQuestionChange(question)}
                    >
                      {question.questionNum}
                    </QuestionNotSelected>
                  );
                }
              })}
            </QuestionsDiv>
            <QuestionBox>
              <div
                style={{
                  width: "15%",
                }}
              >
                <QuestionInfo>
                  <QNoDiv>Question {selectedQuestion.questionNum}</QNoDiv>
                  <QInfo>{selectedQuestion.questionInfo}</QInfo>
                </QuestionInfo>
              </div>
              <EditorBox>
                <UserInfoBox>
                  <Select
                    value={userLang}
                    onChange={(e) => {
                      setUserLang(e.target.value);
                      setSubmitDisabled(true);
                    }}
                    placeholder={userLang}
                  >
                    {languagesList.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
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
                    language={userLang}
                    defaultLanguage="java"
                    keepCurrentModel={true}
                    saveViewState={false}
                    value={userCode}
                    onChange={(value) => {
                      setUserCode(value);
                      setSubmitDisabled(true);
                    }}
                  />
                </div>
              </EditorBox>
              <QuestionInfo>
                <QNoDiv>Test Cases</QNoDiv>
                <TestCasesBox>
                  {selectedQuestion?.testCases.map((testCaseEach, index) => {
                    let arrVal = JSON.parse(localStorage.getItem("testCases"));
                    return (
                      <SingleTestCaseBox key={testCaseEach._id}>
                        <HeaderBoxTest
                          style={{
                            backgroundColor: arrVal[index].backgroundColor,
                            color: arrVal[index].color,
                          }}
                        >
                          Test Case {index + 1}
                        </HeaderBoxTest>
                        <TestBodyContent>
                          <div>Input: {testCaseEach.inputCase}</div>
                          <div style={{ fontSize: "15px" }}>
                            Expected: {testCaseEach.expectedOutput}
                          </div>
                          <div style={{ fontSize: "15px" }}>
                            {`Ouput: \n${arrVal[index].output}`}
                          </div>
                        </TestBodyContent>
                      </SingleTestCaseBox>
                    );
                  })}
                </TestCasesBox>
              </QuestionInfo>
            </QuestionBox>
            <ButtonsBox>
              <input
                type="file"
                onChange={handleFileInput}
                accept=".java,.py, .pyi, .pyc, .pyd, .pyo, .pyw, .pyz, .cpp, .c, .cxx, .cc"
                onClick={(e) => (e.target.value = null)}
              />
              <CompileBtn onClick={downloadCode} disabled={disabled}>
                Download Code
              </CompileBtn>
              <CompileBtn onClick={compileCode} disabled={disabled}>
                Compile Code
              </CompileBtn>
              <BlackBtn
                onClick={handleQuestionSubmit}
                disabled={submitDisabled}
                title={
                  submitDisabled
                    ? "Compile your code to submit!"
                    : "Submit Answer!"
                }
              >
                Submit Question {selectedQuestion.questionNum}
              </BlackBtn>
            </ButtonsBox>
          </>
        )}
    </Container>
  );
};

export default StudentAssignments;
