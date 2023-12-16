import axios from "axios";
import { App, Card, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTracker } from "../../../context/TrackerProvider";
import AssignmentCard from "../../misc/AssignmentCard";
import Heading from "../../misc/Heading";
import Navbar from "../../misc/Navbar";
import Title from "antd/es/typography/Title";

const StudentCourses = () => {
  const { selectedCourse, setSelectedCourse } = useTracker();
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  const { notification } = App.useApp();

  useEffect(() => {
    setSelectedCourse(JSON.parse(localStorage.getItem("courseInfo")));
    localStorage.removeItem("assignmentInfo");
    localStorage.removeItem("assignmentAnswers");
    localStorage.removeItem("testCases");
    if (!JSON.parse(localStorage.getItem("courseInfo"))) {
      navigate("/");
    }
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const data = await axios.get(
        `http://localhost:5000/api/tracker/allAssignments/visible?courseID=${
          JSON.parse(localStorage.getItem("courseInfo"))._id
        }`
      );
      setAssignments(data.data);
    } catch (error) {
      notification.error({
        message: "Error Occured!",
        description: "Failed to load the courses",
        duration: 5,
        placement: "bottomLeft",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-full overflow-auto bg-gray-100 px-6 py-2">
        <Heading
          link={"/"}
          title={`${selectedCourse?.name.toUpperCase()}`}
          size={1}
        />
        <Row gutter={[16, 16]} justify="center" className=" gap-4">
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <AssignmentCard key={assignment._id} assignment={assignment} />
            ))
          ) : (
            <Card className="text-center p-6">
              <Title level={4}>You have no assignments for this course!</Title>
            </Card>
          )}
        </Row>
      </div>
    </>
  );
};

export default StudentCourses;
