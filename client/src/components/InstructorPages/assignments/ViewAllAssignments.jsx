import axios from "axios";
import { notification, Button, Row, Typography, Card } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTracker } from "../../../context/TrackerProvider";
import AssignmentCard from "../../misc/AssignmentCard";
import Navbar from "../../misc/Navbar";

const { Title } = Typography;

const ViewAllAssignments = () => {
  const { selectedCourse, setSelectedCourse } = useTracker();
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("courseInfo"))) {
      navigate("/");
    }
    setSelectedCourse(JSON.parse(localStorage.getItem("courseInfo")));
    localStorage.removeItem("assignmentInfo");
    localStorage.removeItem("testInfo");
    localStorage.removeItem("moduleInfo");
    localStorage.removeItem("submissionInfo");
    fetchAssignments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAssignments = async () => {
    try {
      const data = await axios.get(
        `http://localhost:5000/api/tracker/allAssignments?courseID=${
          JSON.parse(localStorage.getItem("courseInfo"))._id
        }`
      );
      setAssignments(data.data);
    } catch (error) {
      notification.error({
        message: "Error Occured!",
        description: "Failed to load the assignments",
        duration: 5,
        placement: "bottomLeft",
      });
    }
  };
  return (
    <>
      <Navbar />
      <div className="h-full overflow-auto bg-gray-100 p-6">
        <Link to="/course" className="mb-4">
          <Button
            icon={<ArrowLeftOutlined />}
            className="bg-[#000000] text-white font-semibold flex justify-center items-center hover:bg-slate-100"
          >
            Back
          </Button>
        </Link>
        <Title level={2} className="text-center mb-8">
          {selectedCourse?.name.toUpperCase()}
        </Title>
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
        <div className="text-center mt-8">
          <Button
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/createAssignment")}
            className="bg-[#000000] text-white font-semibold  hover:bg-slate-100 mx-2"
          >
            New Coding Assignment
          </Button>
          <Button
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/createTheoryAssignment")}
            className="bg-[#000000] text-white font-semibold  hover:bg-slate-100 mx-2"
          >
            New Theory Assignment
          </Button>
        </div>
      </div>
    </>
  );
};

export default ViewAllAssignments;
