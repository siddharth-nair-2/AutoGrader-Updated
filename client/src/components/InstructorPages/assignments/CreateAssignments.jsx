import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../misc/Navbar";
import { useAuth } from "../../../context/AuthProvider";
import { useTracker } from "../../../context/TrackerProvider";
import {
  Form,
  Input,
  Button,
  Typography,
  Space,
  Select,
  DatePicker,
  App,
  Switch,
  Progress,
} from "antd";
import {
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";

const { TextArea } = Input;
const { Title, Text } = Typography;

const CreateAssignments = () => {
  const { notification, modal } = App.useApp();

  const navigate = useNavigate();
  const { selectedCourse, setSelectedCourse } = useTracker();
  const { user } = useAuth();
  const [instructorFiles, setInstructorFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [publicIds, setPublicIds] = useState([]);
  const [uploadedStatus, setUploadedStatus] = useState(true);

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
  const [form] = Form.useForm();

  const onFinish = async (e) => {
    const { name, description, dueDate, visibleToStudents, questions } = e;
    if (
      !name ||
      !description ||
      !dueDate ||
      visibleToStudents === undefined ||
      !questions
    ) {
      notification.error({
        message: "Missing Information",
        description: "Pleast enter all information!",
        duration: 4,
        placement: "bottomLeft",
      });
      return;
    }
    if (questions.length < 1) {
      notification.error({
        message: "No Question!",
        description: "Each assignment should have at least one question!",
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

    if (uploadedStatus === false) {
      notification.error({
        message: "Please upload the files!",
        description:
          "Please press the Start Upload button before creating the assignment.",
        duration: 8,
        placement: "bottomLeft",
      });
      return;
    }
    try {
      const config = {
        Headers: {
          "Content-type": "application/json",
        },
      };
      await axios.post(
        "http://localhost:5000/api/tracker/assignments",
        {
          courseID: selectedCourse._id,
          name,
          description,
          due_date: dueDate.toDate(),
          visibleToStudents,
          questions,
          instructorFiles,
        },
        config
      );
      window.location = "/viewallassignments";
    } catch (error) {
      if (error.response.status === 409) {
        notification.error({
          message: "Error",
          description: "An assignment with the same name already exists!",
          duration: 4,
          placement: "bottomLeft",
        });
      } else if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        notification.error({
          message: "Error",
          description: error.response.statusText,
          duration: 4,
          placement: "bottomLeft",
        });
      }
    }
  };

  const props = {
    multiple: true,
    onChange: (info) => {
      if (info.fileList.length > 0) {
        setUploadedStatus(false);
      }
      if (info.fileList.length === 0 && instructorFiles.length === 0) {
        setUploadedStatus(true);
      }
    },
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

  const handleUpload = async () => {
    // Reset progress to 0
    setUploadProgress(0);
    setInstructorFiles([]);
    setPublicIds([]);

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

      const newInstructorFiles = [];
      const newPublicIds = [];

      responses.map((response) => {
        const url = response.data.url; // URL of the uploaded file
        const fileName = response.data.original_filename; // Original file name
        const publicId = response.data.public_id; // Public ID of the uploaded file

        newInstructorFiles.push({ publicId, fileName, filePath: url });
        newPublicIds.push(publicId);

        notification.success({
          message: "File uploaded!",
          description: `${fileName} uploaded successfully`,
          duration: 4,
          placement: "bottomLeft",
        });
      });

      // Update the state with new instructor files
      setInstructorFiles((currentFiles) => [
        ...currentFiles,
        ...newInstructorFiles,
      ]);
      setPublicIds((currentIds) => [...currentIds, ...newPublicIds]);
      setUploadedStatus(true);
    } catch (error) {
      notification.error({
        message: "File upload failed",
        description: error.message,
        duration: 4,
        placement: "bottomLeft",
      });
    }
  };

  const showUploadConfirmation = () => {
    modal.confirm({
      title: `Are you sure you want to upload ${fileList.length} files? ${
        instructorFiles.length > 0
          ? "This will overwrite the existing files."
          : ""
      }`,
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
        if (instructorFiles.length > 0) {
          deleteFiles(publicIds); // Delete old files first
        }
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

  const deleteFiles = async (publicIds) => {
    try {
      await axios.post("http://localhost:5000/api/tracker/delete-file", {
        publicIds,
      });

      setInstructorFiles([]);
      setPublicIds([]);
      notification.success({
        message: "Files Overwritten",
        description: "The existing files have been successfully overwritten.",
        duration: 4,
        placement: "bottomLeft",
      });
    } catch (error) {
      console.error("Error deleting files:", error);
      notification.error({
        message: "Overwriting Failed",
        description: "Failed to overwrite files. Please try again.",
        duration: 4,
        placement: "bottomLeft",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-full overflow-auto bg-gray-100 px-6 py-2">
        <div className="flex justify-between items-center">
          <Link to="/viewallassignments" className=" flex-1">
            <Button
              icon={<ArrowLeftOutlined />}
              className="bg-black border-black text-white rounded-lg text-sm font-medium flex 
              items-center justify-center hover:bg-white hover:text-black hover:border-black"
            >
              Back
            </Button>
          </Link>
          <Title level={3} className="text-center font-bold my-4 flex-1">
            {`CREATE A CODING ASSIGNMENT - ${selectedCourse?.name}`}
          </Title>
          <div className=" flex-1"></div>
        </div>
        <Form
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          className="max-w-3xl mx-auto mt-6"
          initialValues={{
            questions: [
              {
                questionInfo: "",
                testCases: [{ inputCase: "", expectedOutput: "" }],
              },
            ],
          }}
        >
          {/* Assignment Name */}
          <Form.Item
            name="name"
            label={<span className=" font-bold">Assignment Name</span>}
            rules={[
              { required: true, message: "Please input the assignment name!" },
            ]}
          >
            <Input placeholder="Assignment X" />
          </Form.Item>

          {/* Assignment Description */}
          <Form.Item
            name="description"
            label={<span className=" font-bold">Assignment Description</span>}
            rules={[
              {
                required: true,
                message: "Please input the assignment description!",
              },
            ]}
          >
            <TextArea
              placeholder="Describe the assignment"
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>

          <div className="flex justify-between items-center space-x-4">
            {/* Visible to Students */}
            <Form.Item
              name="visibleToStudents"
              label={<span className=" font-bold">Visible to Students</span>}
              valuePropName="checked"
              initialValue={true}
            >
              <Switch
                checkedChildren="Visible"
                unCheckedChildren="Hidden"
                className=" bg-[#858687] hover:shadow-xl hover:!bg-[#4b4c4d]"
              />
            </Form.Item>

            {/* Due Date */}
            <Form.Item
              name="dueDate"
              label={<span className=" font-bold">Due Date</span>}
              rules={[
                { required: true, message: "Please select the due date!" },
              ]}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
          </div>

          {/* Instructor Files */}
          <Form.Item
            label={<span className=" font-bold">Instructor Files</span>}
          >
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
          </Form.Item>
          <Button
            type="primary"
            htmlType="button"
            onClick={showUploadConfirmation}
            disabled={
              (fileList.length === 0 && instructorFiles.length === 0) ||
              uploadedStatus
            }
            className=" mb-4 main-black-btn"
          >
            {uploadedStatus ? "Files Up to date" : "Start Upload"}
          </Button>
          {uploadProgress > 0 && (
            <Progress percent={Math.round(uploadProgress)} />
          )}

          {/* Questions List */}
          <Form.List
            name="questions"
            rules={[
              {
                validator: async (_, questions) => {
                  if (!questions || questions.length < 1) {
                    return Promise.reject(
                      new Error("At least one question is required.")
                    );
                  }
                },
              },
            ]}
          >
            {(questions, { add, remove }) => (
              <>
                {questions.map(({ key, name, ...restField }) => {
                  return (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "questionNum"]}
                        label={<span className=" font-bold">#</span>}
                        initialValue={key + 1}
                      >
                        <Input
                          type="number"
                          min={1}
                          placeholder="1"
                          disabled={true}
                          className=" w-[50px]"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "questionInfo"]}
                        label={
                          <span className=" font-bold">Question info</span>
                        }
                        rules={[
                          { required: true, message: "Missing question" },
                        ]}
                      >
                        <Input
                          placeholder="Question info"
                          className=" w-[200px]"
                        />
                      </Form.Item>
                      <Form.List
                        name={[name, "testCases"]}
                        rules={[
                          {
                            validator: async (_, testCases) => {
                              if (!testCases || testCases.length < 1) {
                                return Promise.reject(
                                  new Error(
                                    "At least one test case is required."
                                  )
                                );
                              }
                            },
                          },
                        ]}
                      >
                        {(cases, { add: addCase, remove: removeCase }) => (
                          <>
                            {cases.map((caseField) => {
                              return (
                                <Space key={caseField.key} align="baseline">
                                  <Form.Item
                                    {...caseField}
                                    name={[caseField.name, "inputCase"]}
                                    label={<span>Input test case</span>}
                                    key={caseField.key + "input"}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Input case required",
                                      },
                                    ]}
                                  >
                                    <Input
                                      placeholder="Input case"
                                      className=" w-[150px]"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    {...caseField}
                                    name={[caseField.name, "expectedOutput"]}
                                    label={<span>Expected output</span>}
                                    key={caseField.key + "output"}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Expected output required",
                                      },
                                    ]}
                                  >
                                    <Input
                                      placeholder="Expected output"
                                      className=" w-[150px]"
                                    />
                                  </Form.Item>
                                  {cases.length > 1 ? (
                                    <MinusCircleOutlined
                                      onClick={() => removeCase(caseField.name)}
                                    />
                                  ) : null}
                                </Space>
                              );
                            })}
                            <Button
                              type="dashed"
                              onClick={() => addCase()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add test case
                            </Button>
                          </>
                        )}
                      </Form.List>
                      {questions.length > 1 ? (
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      ) : null}
                    </Space>
                  );
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        questionInfo: "",
                        testCases: [{ inputCase: "", expectedOutput: "" }],
                      })
                    }
                    block
                    icon={<PlusOutlined />}
                  >
                    Add question
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button
              size="large"
              htmlType="submit"
              className="w-full font-medium flex items-center justify-center main-black-btn"
            >
              Create Assignment
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreateAssignments;
