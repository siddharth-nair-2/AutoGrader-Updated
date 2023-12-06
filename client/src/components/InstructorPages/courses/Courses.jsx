import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
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

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  height: 100vh;
  padding-bottom: 20px;
  background-color: #f4f3f6;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
`;

const SingleContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CourseCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  color: black;
  background-color: white;
  border-radius: 24px;
  width: 600px;
  height: 100px;
  margin: auto;
  margin-top: 50px;
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
  box-shadow: 1px -1px 25px -1px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 1px -1px 25px -1px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 1px -1px 25px -1px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.002);
  }
`;

const CourseButtons = styled.button`
  border: none;
  outline: none;
  padding: 16px;
  background-color: black;
  border-radius: 24px;
  font-weight: bold;
  font-size: 16px;
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

const ViewCreateDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
  height: 80%;
`;

const CourseBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
  margin: 25px;
`;

const Courses = () => {
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
  }, []);

  const CourseActionCard = ({ title, icon, navigateTo }) => (
    <Card
      hoverable
      onClick={() => navigate(navigateTo)}
      className="text-center"
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
            {selectedCourse.name.toUpperCase()}
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
