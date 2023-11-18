import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../misc/Navbar";

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  height: 100vh;
  padding-bottom: 20px;
  background-color: #f4f3f6;
`;

const HeadingDiv = styled.div`
  color: black;
  font-size: 36px;
  margin: 20px 80px 20px 80px;
  font-weight: 600;
  justify-content: center;
  display: flex;
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

const TextArea = styled.textarea`
  border: #e1dfec 2px solid;
  width: 100%;
  padding: 15px;
  border-radius: 23px;
  background-color: white;
  margin: 5px 0;
  font-size: 12px;
`;

const WhiteBtn = styled.button`
  border: none;
  outline: none;
  padding: 12px 0;
  background-color: white;
  border-radius: 20px;
  width: 180px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
`;

const BlackBtn = styled(WhiteBtn)`
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

const Select = styled.select`
  border: #e1dfec 2px solid;
  width: 100%;
  padding: 15px;
  border-radius: 46px;
  background-color: white;
  margin: 5px 0;
  font-size: 12px;
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


const CreateCourses = () => {
  const [userData, setUserData] = useState();
  const toast = useToast();
  const navigate = useNavigate();
  const [courseID, setCourseID] = useState();
  const [section, setSection] = useState();
  const [semester, setSemester] = useState();
  const [description, setDesc] = useState();
  const [name, setName] = useState();

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userInfo")));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseID || !description || !name || semester === "" || !section) {
      toast({
        title: "Missing Information",
        description: "Pleast enter all information!",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setSection(section.toUpperCase());
    if (!section.match(/[A-Z]/i)) {
      toast({
        title: "Invalid Course Section",
        description: "Course Section should be between A and Z characters.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (courseID.length < 8 || courseID.length > 10) {
      toast({
        title: "Invalid Course ID",
        description: "Course ID should be between 8 and 10 characters.",
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
    try {
      const config = {
        Headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/tracker/course",
        {
          courseID,
          name,
          description,
          semester,
          section,
          instructor: JSON.parse(localStorage.getItem("userInfo"))._id,
        },
        config
      );
      window.location = "/";
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
  };

  return (
    <Container>
      <Navbar />
      <HeadingDiv>
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
        CREATE A COURSE
      </HeadingDiv>
      <FormBox>
        <FormContainer onSubmit={handleSubmit}>
          <Label htmlFor="code-course">Course Code</Label>
          <Input
            type="text"
            id="code-course"
            placeholder="COSC4106"
            name="codeCourse"
            onChange={(e) => setCourseID(e.target.value)}
            required
          />
          <Label htmlFor="code-section">Course Section</Label>
          <Input
            type="text"
            id="code-section"
            placeholder="A"
            name="codeSection"
            onChange={(e) => setSection(e.target.value)}
            maxLength={1}
            required
          />
          <Label htmlFor="course-name">Course Name</Label>
          <Input
            type="text"
            id="course-name"
            placeholder="Analysis of Algorithm"
            name="nameCourse"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Label htmlFor="course-desc">Course Description</Label>
          <TextArea
            type="textarea"
            id="course-desc"
            placeholder="Please enter a description for your course!"
            name="descCourse"
            rows={8}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
          <Label htmlFor="course-sem">Semester</Label>
          <Select
            required
            name="semCourse"
            id="course-sem"
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="" selected disabled hidden>
              Choose Semester
            </option>
            <option value="Winter 2023">Winter 2023</option>
            <option value="Summer 2023">Summer 2023</option>
            <option value="Spring 2023">Spring 2023</option>
            <option value="Fall 2023">Fall 2023</option>
            <option value="Winter 2024">Winter 2024</option>
            <option value="Summer 2024">Summer 2024</option>
            <option value="Spring 2024">Spring 2024</option>
            <option value="Fall 2024">Fall 2024</option>
            <option value="Winter 2025">Winter 2025</option>
            <option value="Summer 2025">Summer 2025</option>
            <option value="Spring 2025">Spring 2025</option>
            <option value="Fall 2025">Fall 2025</option>
          </Select>
          <BlackBtn>Create Course</BlackBtn>
        </FormContainer>
      </FormBox>
    </Container>
  );
};

export default CreateCourses;
