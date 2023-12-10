import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTracker } from "../../../context/TrackerProvider";
import { Card, Button, Typography, Space } from "antd";
import {
  ArrowLeftOutlined,
  ReadOutlined,
  ProfileOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import Navbar from "../../misc/Navbar";

const { Title } = Typography;

const Courses = () => {
  const { selectedCourse, setSelectedCourse } = useTracker();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const CourseActionCard = ({ title, icon, navigateTo }) => (
    <Card
      hoverable
      onClick={() => navigate(navigateTo)}
      className="text-center shadow-lg"
    >
      {icon}
      <Title level={4}>{title}</Title>
    </Card>
  );

  return (
    <>
      <Navbar />
      <div className="h-full overflow-auto bg-gray-100 p-6">
        <Link to="/" className=" flex-1">
          <Button
            icon={<ArrowLeftOutlined />}
            className=" mb-6 sm:mb-0 bg-black border-black text-white rounded-lg text-sm font-medium flex 
              items-center justify-center hover:bg-white hover:text-black hover:border-black"
          >
            Back
          </Button>
        </Link>
        <Space
          direction="vertical"
          size="large"
          className="w-full h-full flex flex-col items-center justify-center"
        >
          <Title className="text-center">
            {selectedCourse?.name.toUpperCase()}
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <CourseActionCard
              title="View All Assignments"
              icon={<ReadOutlined style={{ fontSize: "24px" }} />}
              navigateTo="/viewallassignments"
            />
            <CourseActionCard
              title="View All Tests"
              icon={<ProfileOutlined style={{ fontSize: "24px" }} />}
              navigateTo="/viewalltests"
            />
            <CourseActionCard
              title="View All Modules"
              icon={<AppstoreOutlined style={{ fontSize: "24px" }} />}
              navigateTo="/viewallmodules"
            />
          </div>
        </Space>
      </div>
    </>
  );
};

export default Courses;
