import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../misc/Navbar";
import { TrackerState } from "../../../context/TrackerProvider";
import Heading from "../../misc/Heading";
import DateTimePicker from "react-datetime-picker";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  padding-bottom: 20px;
  background-color: #f4f3f6;
`;

const FormBox = styled.div`
  width: 40%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-family: "Poppins", sans-serif;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  width: 100%;
  margin-top: 12px;
`;

const Input = styled.input`
  border: #e1dfec 2px solid;
  width: 100%;
  padding: 15px;
  border-radius: 46px;
  background-color: white;
  margin: 5px 0;
  font-size: 12px;
`;

const QNInput = styled.input`
  border: #e1dfec 2px solid;
  width: 9%;
  padding: 15px;
  border-radius: 46px;
  background-color: white;
  margin: 5px 0;
  font-size: 12px;
`;

const QuestionInput = styled.input`
  border: #e1dfec 2px solid;
  width: 77%;
  padding: 15px;
  border-radius: 46px;
  background-color: white;
  margin: 5px 0;
  font-size: 12px;
`;

const AddLogo = styled.div`
  border: #e1dfec 2px solid;
  width: 7%;
  padding: 15px;
  padding-left: 17px;
  padding-bottom: 17px;
  font-weight: 800;
  border-radius: 46px;
  background-color: white;
  margin: 5px 0;
  font-size: 12px;
`;

const TextArea = styled.textarea`
  border: #e1dfec 2px solid;
  width: 100%;
  padding: 15px;
  border-radius: 23px;
  background-color: white;
  margin: 5px 0;
  font-size: 12px;
`;

const BlackBtn = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  background-color: #0a071b;
  color: white;
  width: 100%;
  padding: 17px;
  margin: 5px 0;
  font-size: 14px;
  border-radius: 46px;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-top: 40px;
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

const Select = styled.select`
  border: #e1dfec 2px solid;
  width: 100%;
  padding: 15px;
  border-radius: 46px;
  background-color: white;
  margin: 5px 0;
  font-size: 12px;
`;

const CreateAssignments = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [description, setDesc] = useState();
  const [notes, setNotes] = useState("");
  const [name, setName] = useState();
  const [value, setValue] = useState(new Date());
  const [questionList, setQuestionList] = useState([
    {
      questionNum: "",
      questionInfo: "",
      testCases: [{ inputCase: "", expectedOutput: "" }],
    },
  ]);
  const [visibility, setVisiblity] = useState();

  const { selectedCourse, setSelectedCourse } = TrackerState();

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("courseInfo"))) {
      navigate("/");
    }
    setSelectedCourse(JSON.parse(localStorage.getItem("courseInfo")));
  }, []);

  const handleQuestionChange = (e, index) => {
    const { name, value } = e.target;
    const questions = [...questionList];
    questions[index][name] = value;
    setQuestionList(questions);
  };

  const handleCaseInfoChange = (e, outerIndex, innerIndex) => {
    const { name, value } = e.target;
    let questionsListCopy = JSON.parse(JSON.stringify(questionList));
    questionsListCopy[outerIndex].testCases[innerIndex][name] = value;
    setQuestionList(questionsListCopy);
  };

  const handleCaseAddClick = (outerIndex, innerIndex) => {
    let questionsListCopy = JSON.parse(JSON.stringify(questionList));
    questionsListCopy[outerIndex].testCases.push({
      inputCase: "",
      expectedOutput: "",
    });
    setQuestionList(questionsListCopy);
  };

  const handleAddClick = () => {
    setQuestionList([
      ...questionList,
      {
        questionNum: "",
        questionInfo: "",
        testCases: [{ inputCase: "", expectedOutput: "" }],
      },
    ]);
  };

  const handleCaseRemoveClick = (outerIndex, innerIndex) => {
    const list = [...questionList[outerIndex].testCases];
    list.splice(innerIndex, 1);
    let questionsListCopy = JSON.parse(JSON.stringify(questionList));
    questionsListCopy[outerIndex].testCases = list;
    setQuestionList(questionsListCopy);
  };

  const handleRemoveClick = (index) => {
    const list = [...questionList];
    list.splice(index, 1);
    setQuestionList(list);
  };

  const handleDueDate = (newValue) => {
    setValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !value || !visibility) {
      toast({
        title: "Missing Information",
        description: "Pleast enter all information!",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (
      questionList.length < 2 &&
      (questionList[0].questionNum === "" || questionList[0].questionNum === "")
    ) {
      toast({
        title: "No Question!",
        description: "Each assignment should have at least one question!",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (name.length > 64) {
      toast({
        title: "Name is too lengthy!",
        description: "Course Name should be less than 65 characters.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (description.length > 2000) {
      toast({
        title: "Description is too lengthy!",
        description: "Description should be less than 2000 characters.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (notes.length > 256) {
      toast({
        title: "Notes are too lengthy!",
        description: "Notes should be less than 256 characters.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    try {
      const config = {
        Headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/tracker/assignments",
        {
          courseID: JSON.parse(localStorage.getItem("courseInfo"))._id,
          name,
          description,
          notes,
          due_date: value.toISOString(),
          visibleToStudents: visibility,
          questions: questionList,
        },
        config
      );
      window.location = "/course";
    } catch (error) {
      console.log(error);
      if(error.response.data === "Exists"){
        toast({
          title: "Error",
          description: "An assignment with the same name already exists!",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
      else if (
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
  };

  return (
    <Container>
      <Navbar />
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
        {`CREATE AN ASSIGNMENT - ${selectedCourse?.name}`}
      </Heading>
      <FormBox>
        <FormContainer onSubmit={handleSubmit}>
          <Label htmlFor="assignment-name">Assignment Name</Label>
          <Input
            type="text"
            id="assignment-name"
            placeholder="Assignment X"
            name="assignmentName"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Label htmlFor="assignment-desc">Assignment Description</Label>
          <TextArea
            type="textarea"
            id="assignment-desc"
            placeholder="Please enter a description for your Assignment!"
            name="assignmentDesc"
            rows={2}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
          <Label htmlFor="assignment-notes">Assignment Notes</Label>
          <TextArea
            type="textarea"
            id="assignment-notes"
            placeholder="Any notes? Write 'em here!"
            name="assignmentNotes"
            rows={2}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Label htmlFor="assignment-due">Due Date</Label>
          <DateTimePicker
            onChange={(e) => handleDueDate(e)}
            value={value}
            minDate={new Date()}
          />
          <Label htmlFor="assignment-visible">Visibility</Label>
          <Select
            required
            name="assignmentVisible"
            id="assignment-visible"
            onChange={(e) => setVisiblity(e.target.value)}
          >
            <option value="" selected disabled hidden>
              Choose visiblity
            </option>
            <option value={false}>Not visible to students</option>
            <option value={true}>Visible to students</option>
          </Select>
          <Label htmlFor="assignment-due">Questions</Label>
          {questionList.map((q, index) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                  key={index}
                >
                  <QNInput
                    type="number"
                    id="question-num"
                    placeholder="QNo."
                    min={1}
                    value={q.questionNum}
                    onChange={(e) => handleQuestionChange(e, index)}
                    name="questionNum"
                    required
                  />
                  <QuestionInput
                    type="text"
                    id="question-info"
                    placeholder="Write the question here..."
                    name="questionInfo"
                    value={q.questionInfo}
                    onChange={(e) => handleQuestionChange(e, index)}
                    required
                  />
                  {questionList.length !== 1 && (
                    <AddLogo>
                      <DeleteIcon
                        boxSize={4}
                        onClick={() => handleRemoveClick(index)}
                        color="red"
                        _hover={{ transform: "scale(1.1)", cursor: "pointer" }}
                      />
                    </AddLogo>
                  )}
                  {questionList.length - 1 === index && (
                    <AddLogo>
                      <AddIcon
                        boxSize={4}
                        onClick={handleAddClick}
                        color="green"
                        _hover={{ transform: "scale(1.1)", cursor: "pointer" }}
                      />
                    </AddLogo>
                  )}
                </div>

                {q.testCases.map((indCase, innerIndex) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                      key={`${innerIndex} - ${index}`}
                    >
                      {q.testCases.length !== 1 && (
                        <AddLogo>
                          <DeleteIcon
                            boxSize={4}
                            onClick={() =>
                              handleCaseRemoveClick(index, innerIndex)
                            }
                            color="red"
                            _hover={{
                              transform: "scale(1.1)",
                              cursor: "pointer",
                            }}
                          />
                        </AddLogo>
                      )}
                      {q.testCases.length - 1 === innerIndex && (
                        <AddLogo>
                          <AddIcon
                            boxSize={4}
                            onClick={(e) =>
                              handleCaseAddClick(index, innerIndex)
                            }
                            color="green"
                            _hover={{
                              transform: "scale(1.1)",
                              cursor: "pointer",
                            }}
                          />
                        </AddLogo>
                      )}
                      <QuestionInput
                        type="text"
                        id="input-case"
                        placeholder="Input Case"
                        name="inputCase"
                        value={indCase.inputCase}
                        onChange={(e) =>
                          handleCaseInfoChange(e, index, innerIndex)
                        }
                        required
                      />
                      <QuestionInput
                        type="text"
                        id="expected-output"
                        placeholder="Output case"
                        name="expectedOutput"
                        value={indCase.expectedOutput}
                        onChange={(e) =>
                          handleCaseInfoChange(e, index, innerIndex)
                        }
                        required
                      />
                    </div>
                  );
                })}
              </>
            );
          })}
          <BlackBtn>Create Assignment</BlackBtn>
        </FormContainer>
      </FormBox>
    </Container>
  );
};

export default CreateAssignments;
