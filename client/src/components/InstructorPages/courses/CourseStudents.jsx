import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTracker } from "../../../context/TrackerProvider";
import { notification, Table, Button, Input, Typography, Space } from "antd";

import Heading from "../../misc/Heading";
import Navbar from "../../misc/Navbar";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;

const CourseStudents = () => {
  const navigate = useNavigate();
  const { selectedCourse, setSelectedCourse } = useTracker();
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [showAddStudents, setShowAddStudents] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Check if courseInfo is available; if not, redirect to home
    const courseInfo = JSON.parse(localStorage.getItem("courseInfo"));
    if (!courseInfo) {
      navigate("/");
      return;
    }
    setSelectedCourse(courseInfo);
    fetchCourseStudents();
    fetchAllStudents(courseInfo._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add sorting functionality to your column definitions
  const getColumns = (columns) =>
    columns.map((col) => ({
      ...col,
      sorter: col.sorter !== false,
      sortDirections: ["descend", "ascend"],
      // If you want to enable filtering add filter here
    }));

  // Enhanced student data with filter functionality
  const getFilteredData = (data) => {
    return data.filter((item) =>
      Object.keys(item).some((key) =>
        String(item[key]).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  const fetchCourseStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/students/course/${
          JSON.parse(localStorage.getItem("courseInfo"))._id
        }`
      );
      setStudents(response.data);
    } catch (error) {
      notification.error({
        message: "Error Occurred!",
        description: "Failed to load the courses",
        duration: 5,
        placement: "bottomLeft",
      });
    }
  };

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user/students"
      );
      const filteredData = response.data.filter((student) => {
        return (
          student.courses.findIndex((x) => {
            return (
              x.courseID === JSON.parse(localStorage.getItem("courseInfo"))._id
            );
          }) === -1
        );
      });
      setAllStudents(filteredData);
    } catch (error) {
      notification.error({
        message: "Error Occurred!",
        description: "Failed to load the students",
        duration: 5,
        placement: "bottomLeft",
      });
    }
  };

  const addStudent = async (student) => {
    try {
      await axios.put(
        `http://localhost:5000/api/user/${student._id}/courses/add/${selectedCourse._id}`
      );
      fetchCourseStudents();
      fetchAllStudents();
      notification.success({
        message: "Student Added",
        description: `${student.firstName} ${student.lastName} has been added to the course.`,
        duration: 5,
        placement: "bottomLeft",
      });
    } catch (error) {
      notification.error({
        message: "Error Occurred!",
        description:
          error.response?.data?.message ||
          "Failed to add the student to the course.",
        duration: 5,
        placement: "bottomLeft",
      });
    }
  };

  const removeStudent = async (student) => {
    try {
      await axios.put(
        `http://localhost:5000/api/user/${student._id}/courses/remove/${selectedCourse._id}`
      );
      fetchCourseStudents();
      fetchAllStudents();
      notification.success({
        message: "Student Removed",
        description: `${student.firstName} ${student.lastName} has been removed from the course.`,
        duration: 5,
        placement: "bottomLeft",
      });
    } catch (error) {
      notification.error({
        message: "Error Occurred!",
        description:
          error.response?.data?.message ||
          "Failed to remove the student from the course.",
        duration: 5,
        placement: "bottomLeft",
      });
    }
  };

  useEffect(() => {
    setSelectedCourse(JSON.parse(localStorage.getItem("courseInfo")));
    if (!JSON.parse(localStorage.getItem("courseInfo"))) {
      navigate("/");
    }
    fetchCourseStudents();
    fetchAllStudents();
  }, []);

  // Column definitions for the enrolled students table
  const enrolledColumns = [
    {
      title: "#",
      key: "index",
      render: (text, record, index) => index + 1, // Add this line to show the row number starting at 1
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          onClick={() => removeStudent(record)}
          className="bg-[#82110b] border-[#82110b] text-[#fad5d5] rounded-lg text-sm font-semibold flex 
      items-center justify-center hover:bg-[#fad5d5] hover:text-[#82110b] hover:border-[#82110b]"
        >
          Remove
        </Button>
      ),
    },
  ];

  // Column definitions for the all students table
  const allStudentsColumns = [
    {
      title: "#",
      key: "index",
      render: (text, record, index) => index + 1, // Add this line to show the row number starting at 1
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          onClick={() => addStudent(record)}
          className="bg-[#227109] border-[#227109] text-[#e5fee2] rounded-lg text-sm font-semibold flex 
        items-center justify-center hover:bg-[#e5fee2] hover:text-[#227109] hover:border-[#227109]"
        >
          Add
        </Button>
      ),
    },
  ];

  // Use memoization to avoid unnecessary re-renders
  const filteredEnrolledStudents = useMemo(
    () => getFilteredData(students),
    [students, searchText]
  );
  const filteredAllStudents = useMemo(
    () => getFilteredData(allStudents),
    [allStudents, searchText]
  );

  return (
    <>
      <Navbar />
      <div className="h-full overflow-auto bg-gray-100 p-6">
        <div className="flex justify-between items-center">
          <Link to="/" className=" flex-1">
            <Button
              icon={<ArrowLeftOutlined />}
              className=" mb-6 sm:mb-0 bg-black border-black text-white rounded-lg text-sm font-medium flex 
              items-center justify-center hover:bg-white hover:text-black hover:border-black"
            >
              Back
            </Button>
          </Link>
          <Title className="text-center my-4 flex-1">
            {selectedCourse?.name.toUpperCase()}
          </Title>
          <div className=" flex-1">
            <Button
              className="bg-black border-black text-white rounded-lg text-sm font-medium flex 
            items-center justify-center hover:bg-white hover:text-black hover:border-black ml-auto"
              onClick={() => setShowAddStudents(!showAddStudents)}
            >
              {showAddStudents ? "Remove Students" : "Add Students"}
            </Button>
          </div>
        </div>
        <div className=" max-w-7xl m-auto">
          {!showAddStudents && (
            <>
              <Title level={4} className="text-center my-4">
                Enrolled Students
              </Title>
              <Input
                placeholder="Search students..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="my-4 shadow-sm"
              />
              <Table
                dataSource={filteredEnrolledStudents}
                columns={enrolledColumns}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                className="my-4"
              />
            </>
          )}

          {showAddStudents && (
            <>
              <Title level={4} className="text-center my-4">
                Filter through students and add to course!
              </Title>
              <Input
                placeholder="Search students..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="my-4 shadow-sm"
              />
              <Table
                dataSource={filteredAllStudents}
                columns={allStudentsColumns}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                className="my-4"
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseStudents;
