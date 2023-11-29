import axios from "axios";
import styled from "styled-components";
import DateTimePicker from "react-datetime-picker";

import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

import Navbar from "../../misc/Navbar";
import Heading from "../../misc/Heading";
import { useAuth } from "../../../context/AuthProvider";
import { useTracker } from "../../../context/TrackerProvider";

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
const CreateTheoryAssignment = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedCourse, setSelectedCourse } = useTracker();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDesc] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [visibility, setVisibility] = useState(false);
  const [instructorFiles, setInstructorFiles] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    if (localStorage.getItem("courseInfo") === null) {
      navigate("/"); // Redirect if no course is selected
    } else {
      setSelectedCourse(JSON.parse(localStorage.getItem("courseInfo")));
    }
  }, []);

  const handleDueDate = (newValue) => {
    setDueDate(newValue);
  };

  const handleFileChange = (e) => {
    setInstructorFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !visibility || !instructorFiles) {
      toast({
        title: "Missing Information",
        description: "Pleast enter all information!",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (name.length > 64) {
      toast({
        title: "Name is too lengthy!",
        description: "Assignment Name should be less than 65 characters.",
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

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("dueDate", dueDate);
    formData.append("visibility", visibility);
    formData.append("courseId", selectedCourse._id);
    formData.append("instructorFiles", instructorFiles);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/tracker/theoryAssignments",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast({
        title: "Assignment created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      window.location = "/viewallassignments";
    } catch (err) {
      toast({
        title: "Error creating assignment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container>
      <Navbar />
      <Heading>
        <Link to={"/viewallassignments"}>
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
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Label htmlFor="assignment-desc">Assignment Description</Label>
          <TextArea
            id="assignment-desc"
            placeholder="Please enter a description for your Assignment!"
            onChange={(e) => setDesc(e.target.value)}
            required
          />
          <Label htmlFor="assignment-due">Due Date</Label>
          <DateTimePicker
            onChange={(e) => handleDueDate(e)}
            value={dueDate}
            minDate={new Date()}
          />
          <Label htmlFor="assignment-visible">Visibility</Label>
          <Select
            id="assignment-visible"
            onChange={(e) => setVisibility(e.target.value === "true")}
          >
            <option value={false}>Not visible to students</option>
            <option value={true}>Visible to students</option>
          </Select>
          <Label htmlFor="instructor-files">Instructor Files</Label>
          <input
            type="file"
            id="instructor-files"
            multiple
            onChange={handleFileChange}
          />
          <BlackBtn type="submit">Create Assignment</BlackBtn>
        </FormContainer>
      </FormBox>
    </Container>
  );
};

export default CreateTheoryAssignment;
