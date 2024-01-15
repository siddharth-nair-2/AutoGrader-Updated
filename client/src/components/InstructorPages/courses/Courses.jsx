import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTracker } from "../../../context/TrackerProvider";
import { Card, Typography, Space, Button } from "antd";
import {
  ReadOutlined,
  ProfileOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Navbar from "../../misc/Navbar";
import Heading from "../../misc/Heading";

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
      <div className="h-full overflow-auto bg-gray-100 px-6 py-2">
        <div className="flex justify-between items-center">
          <Link to="/viewalltests">
            <Button
              icon={<ArrowLeftOutlined />}
              className=" sm:mb-0 bg-black border-black text-white rounded-lg text-sm font-medium flex 
            items-center justify-center hover:bg-white hover:text-black hover:border-black"
            >
              Back
            </Button>
          </Link>
          <Title className="text-center my-4" level={3}>
            {selectedCourse?.name.toUpperCase()}
          </Title>
          <Link to="/createmodule" className=" w-[85px]">
            <Button
            icon={<PlusOutlined />}
              className="bg-[#46282F] border-[#46282F] text-white rounded-lg text-sm font-medium flex 
          items-center justify-center hover:bg-white hover:text-[#ff5a5a] hover:border-[#46282F] -ml-4"
              onClick={() => console.log("first")}
            >
              Module
            </Button>
          </Link>
        </div>
        <Space
          direction="vertical"
          size="large"
          className="w-full h-full flex flex-col items-center justify-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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
          </div>
        </Space>
      </div>
    </>
  );
};

export default Courses;
