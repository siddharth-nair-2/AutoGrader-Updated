import axios from "axios";
import styled from "styled-components";
import DateTimePicker from "react-datetime-picker";

import { useEffect, useState } from "react";
import { notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
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
  const navigate = useNavigate();
  const { selectedCourse, setSelectedCourse } = useTracker();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDesc] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [visibility, setVisibility] = useState(false);
  const [instructorFiles, setInstructorFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".pdf, .doc, .docx, .ppt, .pptx, .txt, .java, .c, .cpp, .py",
    onDrop: (acceptedFiles) => {
      // Update your state here with the new files
      setInstructorFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

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
      notification.error({
        message: "Missing Information",
        description: "Pleast enter all information!",
        duration: 4,
        placement: "bottomLeft",
      });
      return;
    }

    if (name.length > 64) {
      notification.error({
        message: "Name is too lengthy!",
        description: "Assignment Name should be less than 65 characters.",
        duration: 4,
        placement: "bottomLeft",
      });
      return;
    }
    if (description.length > 2000) {
      notification.error({
        message: "Description is too lengthy!",
        description: "Description should be less than 2000 characters.",
        duration: 4,
        placement: "bottomLeft",
      });
      return;
    }

    const fileFormData = new FormData();
    instructorFiles.forEach((file) => {
      fileFormData.append("instructorFiles", file);
    });

    try {
      const fileUploadResponse = await axios.post(
        "http://localhost:5000/api/tracker/upload-files",
        fileFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const instructorFilesData = fileUploadResponse.data.urls.map(
        (url, index) => ({
          fileName: instructorFiles[index].name,
          filePath: url,
          extension: instructorFiles[index].name.split(".").pop(),
        })
      );

      const assignmentData = {
        name,
        description,
        due_date: dueDate,
        visibleToStudents: visibility,
        instructorFiles: instructorFilesData,
        courseID: selectedCourse._id,
      };

      const res = await axios.post(
        "http://localhost:5000/api/tracker/theoryAssignments",
        assignmentData
      );
      notification.success({
        message: "Assignment created successfully!",
        description: "The assignment has been created!",
        duration: 3,
        placement: "bottomLeft",
      });
      window.location = "/viewallassignments";
    } catch (err) {
      notification.error({
        message: "Error creating assignment",
        description: "Failed to create the assignment",
        duration: 5,
        placement: "bottomLeft",
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
          {/* <input
            type="file"
            id="instructor-files"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.java, .c, .cpp, .py"
          /> */}
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          <div>
            {instructorFiles.map((file) => (
              <div key={file.name}>
                <p>{file.name}</p>
                {/* Implement logic to display file preview if needed */}
              </div>
            ))}
          </div>
          <BlackBtn type="submit">Create Assignment</BlackBtn>
        </FormContainer>
      </FormBox>
    </Container>
  );
};

export default CreateTheoryAssignment;
