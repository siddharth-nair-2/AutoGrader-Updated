import axios from "axios";
import styled from "styled-components";
import DateTimePicker from "react-datetime-picker";

import { useEffect, useState } from "react";
import { Upload, Button, App, Progress, Modal, Typography } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../misc/Navbar";
import Heading from "../../misc/Heading";
import { useAuth } from "../../../context/AuthProvider";
import { useTracker } from "../../../context/TrackerProvider";

const { Text } = Typography;

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

const { Dragger } = Upload;

const CreateTheoryAssignment = () => {
  const navigate = useNavigate();
  const { selectedCourse, setSelectedCourse } = useTracker();
  const { notification } = App.useApp();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDesc] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [visibility, setVisibility] = useState(false);
  const [instructorFiles, setInstructorFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
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

    if (instructorFiles.length === 0) {
      notification.error({
        message: "No files uploaded!",
        description: "Please upload at least one file.",
        duration: 4,
        placement: "bottomLeft",
      });
      return;
    }

    try {
      const assignmentData = {
        name,
        description,
        due_date: dueDate,
        visibleToStudents: visibility,
        instructorFiles,
        courseID: selectedCourse._id,
      };

      await axios.post(
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

  const handleUpload = async () => {
    // Reset progress to 0
    setUploadProgress(0);

    const uploadPromises = fileList.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "kgen9eiq");

      return axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress((oldProgress) => Math.max(oldProgress, progress));
          },
        }
      );
    });

    try {
      const responses = await Promise.all(uploadPromises);

      const newInstructorFiles = responses.map((response) => {
        const url = response.data.url; // URL of the uploaded file
        const fileName = response.data.original_filename; // Original file name

        return {
          fileName,
          filePath: url,
        };
      });

      // Update the state with new instructor files
      setInstructorFiles((currentFiles) => [
        ...currentFiles,
        ...newInstructorFiles,
      ]);

      responses.forEach((response) => {
        notification.success({
          message: "File uploaded!",
          description: `${response.data.original_filename} uploaded successfully`,
          duration: 4,
          placement: "bottomLeft",
        });
      });
      console.log("All files uploaded", responses);
    } catch (error) {
      notification.error("File upload failed");
      console.error(error);
    }
  };

  const props = {
    multiple: true,
    onRemove: (file) => {
      const newFileList = fileList.filter((item) => item.uid !== file.uid);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList((prevFileList) => [...prevFileList, file]);
      return false; // Prevent automatic upload
    },
    fileList,
  };

  const showUploadConfirmation = () => {
    Modal.confirm({
      title: `Are you sure you want to upload ${fileList.length} files?`,
      content: (
        <div className="my-2">
          <p className="mb-2 font-semibold">Files to be uploaded:</p>
          <ol className=" list-decimal list-inside">
            {fileList.map((file) => (
              <li
                style={{}}
                key={file.uid}
                className=" bg-white p-1 rounded-lg text-black"
              >
                <Text ellipsis>{file.name}</Text>
              </li>
            ))}
          </ol>
        </div>
      ),
      onOk() {
        handleUpload();
      },
      onCancel() {},
      okButtonProps: {
        className: " main-black-btn",
      },
      cancelButtonProps: {
        className: " hover:!border-black hover:!text-black",
      },
      width: 800,
    });
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

          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
          <Button
            type="primary"
            htmlType="button"
            onClick={showUploadConfirmation}
            disabled={fileList.length === 0}
            style={{ marginTop: 16 }}
          >
            Start Upload
          </Button>
          {uploadProgress > 0 && (
            <Progress percent={Math.round(uploadProgress)} />
          )}
          <BlackBtn type="submit">Create Assignment</BlackBtn>
        </FormContainer>
      </FormBox>
    </Container>
  );
};

export default CreateTheoryAssignment;
