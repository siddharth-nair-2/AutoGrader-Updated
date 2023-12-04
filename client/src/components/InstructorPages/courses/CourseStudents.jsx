import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTracker } from "../../../context/TrackerProvider";
import { notification, Table, Button, Input, Typography, Space } from "antd";

import Heading from "../../misc/Heading";
import Navbar from "../../misc/Navbar";

const { Title } = Typography;

const CourseStudents = () => {
  const navigate = useNavigate();
  const { selectedCourse, setSelectedCourse } = useTracker();
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [showAddStudents, setShowAddStudents] = useState(false);

  useEffect(() => {
    // Check if courseInfo is available; if not, redirect to home
    const courseInfo = JSON.parse(localStorage.getItem("courseInfo"));
    if (!courseInfo) {
      navigate("/");
      return;
    }
    setSelectedCourse(courseInfo);
    fetchCourseStudents(courseInfo._id);
    fetchAllStudents(courseInfo._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCourseStudents = async (courseId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/students/course/${courseId}`
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

  const fetchAllStudents = async (courseId) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user/students"
      );
      const courseStudents = new Set(students.map((student) => student._id));
      const nonCourseStudents = response.data.filter(
        (student) => !courseStudents.has(student._id)
      );
      setAllStudents(nonCourseStudents);
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
      fetchCourseStudents(selectedCourse._id);
      fetchAllStudents(selectedCourse._id);
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
      fetchCourseStudents(selectedCourse._id);
      fetchAllStudents(selectedCourse._id);
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
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => removeStudent(record)} danger>
          Remove
        </Button>
      ),
    },
  ];

  // Column definitions for the all students table
  const allStudentsColumns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => addStudent(record)} type="primary">
          Add
        </Button>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <Link to="/">
            <Button className="mt-4">Back</Button>
          </Link>
          <Title className="text-center my-4">
            {selectedCourse?.name.toUpperCase()}
          </Title>
          <Button
            type="primary"
            onClick={() => setShowAddStudents(!showAddStudents)}
          >
            {showAddStudents ? "Hide Add Students" : "Show Add Students"}
          </Button>
        </div>

        {!showAddStudents && (
          <>
            <Title level={4} className="text-center my-4">
              Enrolled Students
            </Title>
            <Table
              dataSource={students}
              columns={enrolledColumns}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              className="my-4"
            />
          </>
        )}

        {showAddStudents && (
          <>
            <Input
              placeholder="Search students..."
              onChange={(e) => {} /* handle search */}
              className="my-4"
            />
            <Table
              dataSource={allStudents}
              columns={allStudentsColumns}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              className="my-4"
            />
          </>
        )}
      </div>
    </>
  );
};

export default CourseStudents;
