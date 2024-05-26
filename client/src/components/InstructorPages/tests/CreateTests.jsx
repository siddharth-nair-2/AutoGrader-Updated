import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    DatePicker,
    Switch,
    Upload,
    Space,
    Checkbox,
    InputNumber,
    App,
    Select,
    Modal,
} from "antd";
import {
    MinusCircleOutlined,
    PlusOutlined,
    InboxOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Navbar from "../../misc/Navbar";
import Heading from "../../misc/Heading";
import { useNavigate } from "react-router-dom";
import { useTracker } from "../../../context/TrackerProvider";
import { useAuth } from "../../../context/AuthProvider";
import moment from "moment";
import QuestionForm from "./QuestionForm";
import QuestionListDisplay from "./QuestionListDisplay";

const { TextArea } = Input;
const { Dragger } = Upload;

const CreateTest = () => {
    const [form] = Form.useForm();
    const [testType, setTestType] = useState("test");
    const { notification, modal } = App.useApp();
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate();
    const { selectedCourse, setSelectedCourse } = useTracker();
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = (question) => {
        const questionWithNumber = {
            ...question,
            questionNum: questions.length + 1
        };
        setQuestions([...questions, questionWithNumber]);
        setIsModalVisible(false);
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (localStorage.getItem("courseInfo") === null) {
            navigate("/");
        } else {
            setSelectedCourse(JSON.parse(localStorage.getItem("courseInfo")));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onTypeChange = (value) => {
        setTestType(value);
    };

    const onFinish = async (values) => {
        const { name, description, scheduledAt, duration } = values;
        // Basic validations
        if (!name.trim() || name.length > 64) {
            notification.error({
                message: "Invalid Test Name",
                description: "Test name cannot be empty or too lengthy.",
            });
            return;
        }

        if (description && description.length > 2000) {
            notification.error({
                message: "Description Too Long",
                description: "Description cannot exceed 2000 characters.",
            });
            return;
        }

        if (!scheduledAt || new Date(scheduledAt) < new Date()) {
            notification.error({
                message: "Invalid Scheduled Date",
                description: "Scheduled date and time cannot be in the past.",
            });
            return;
        }
        if (duration <= 0) {
            notification.error({
                message: "Invalid Duration",
                description: "Duration must be a positive number.",
            });
            return;
        }

        if (fileList.length > 0) {
            // If files are uploaded, show modal to confirm file upload
            modal.confirm({
                title: "Confirm File Upload and Test Creation!",
                content: (
                    <div>
                        <p>You have uploaded the following files:</p>
                        <ul>
                            {fileList.map((file) => (
                                <li key={file.uid}>{file.name}</li>
                            ))}
                        </ul>
                    </div>
                ),
                onOk: () => handleUpload(values),
                okButtonProps: {
                    className: " main-black-btn",
                },
            });
        } else {
            // If no files are uploaded, show modal to confirm test creation
            modal.confirm({
                title: "Confirm Test Creation",
                content: "Are you sure you want to create the test without any files?",
                onOk: () => createTest(values, []),
                okButtonProps: {
                    className: " main-black-btn",
                },
            });
        }
    };

    const createTest = async (formData, uploadedFiles) => {
        const {
            name,
            description,
            scheduledAt,
            duration,
            visibleToStudents,
        } = formData;


        try {
            const { data } = await axios.post(
                "/api/tracker/test",
                {
                    courseID: selectedCourse._id,
                    name: name,
                    description: description,
                    scheduledAt: scheduledAt,
                    duration: duration,
                    questions: questions,
                    visibleToStudents: !!visibleToStudents,
                    testType: testType,
                    files: uploadedFiles,
                }
            );

            notification.success({
                message: "Test created successfully!",
                description: `Test ${data.name} has been created.`,
                duration: 4,
                placement: "bottomLeft",
            });

            navigate("/viewalltests");
        } catch (error) {
            notification.error({
                message: "Error creating test",
                description:
                    error.response?.data?.message || "Failed to create the test",
                duration: 4,
                placement: "bottomLeft",
            });
        }
    };

    const handleUpload = async (formData) => {
        const uploadPromises = fileList.map((file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "kgen9eiq");
            formData.append("folder", "test-files");
            return axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`,
                formData
            );
        });

        try {
            const uploadResponses = await Promise.all(uploadPromises);
            const uploadedFiles = uploadResponses.map((response) => {
                let url = response.data.url; // URL of the uploaded file
                const fileName = response.data.original_filename; // Original file name
                const publicId = response.data.public_id; // Public ID of the uploaded file

                if (!publicId.includes(".")) {
                    url = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/fl_attachment/${publicId}`;
                }

                return {
                    publicId: publicId,
                    fileName: fileName,
                    filePath: url,
                };
            });

            // Now create the test with the uploaded files
            await createTest(formData, uploadedFiles);
        } catch (error) {
            notification.error({
                message: "File upload failed",
                description: error.message,
            });
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

    const handleRemoveQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    return (
        <>
            <Navbar />
            <div className="h-full overflow-auto bg-gray-100 px-6 py-2">
                <Heading link="/viewalltests" title="CREATE A TEST/QUIZ" />

                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    className="max-w-3xl mx-auto mt-6"
                    initialValues={{
                        questions: [
                            {
                                questionInfo: "",
                                options: [{ value: "", isCorrect: false }],
                            },
                        ],
                    }}
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true }]}
                        label={<span className="font-bold">Name</span>}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={<span className="font-bold">Description</span>}
                    >
                        <TextArea autoSize={{ minRows: 3 }} />
                    </Form.Item>

                    <div className="flex justify-between items-center space-x-4">
                        {/* Scheduled At */}
                        <Form.Item
                            name="scheduledAt"
                            label={<span className="font-bold">Scheduled At</span>}
                            rules={[
                                {
                                    required: true,
                                    message: "Please select the scheduled date and time!",
                                },
                            ]}
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                disabledDate={(currentDate) => {
                                    // Disable all past dates
                                    return currentDate && currentDate < moment().startOf("day");
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="type"
                            label={<span className="font-bold">Type</span>}
                            rules={[{ required: true, message: "Please select a type!" }]}
                        >
                            <Select
                                onChange={onTypeChange}
                                style={{
                                    width: 120,
                                }}
                            >
                                <Select.Option value="test">Test</Select.Option>
                                <Select.Option value="quiz">Quiz</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="flex justify-between items-center space-x-4">
                        {/* Duration */}
                        <Form.Item
                            name="duration"
                            label={
                                <span className="font-bold">{`Duration (${testType === "test" ? "in minutes" : "in days"
                                    })`}</span>
                            }
                            rules={[
                                { required: true, message: "Please input the test duration!" },
                            ]}
                        >
                            <InputNumber min={1} style={{ width: "100%" }} />
                        </Form.Item>

                        {/* Visible to Students */}
                        <Form.Item
                            name="visibleToStudents"
                            label={<span className="font-bold">Visible to Students</span>}
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </div>
                    <Button type="primary" onClick={showModal} className={"my-4 main-black-btn"}>
                        Add Question
                    </Button>
                    <QuestionListDisplay questions={questions} onRemove={handleRemoveQuestion} />
                    <Modal
                        title="Add a New Question"
                        open={isModalVisible}
                        footer={null}
                        onCancel={handleCancel}
                    >
                        <QuestionForm onSave={handleSave} />
                    </Modal>

                    {/* File Upload */}
                    <Form.Item
                        label={<span className="font-bold mt-4">Files for Test</span>}
                    >
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                        </Dragger>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            className="w-full main-black-btn"
                        >
                            Create Test
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default CreateTest;
