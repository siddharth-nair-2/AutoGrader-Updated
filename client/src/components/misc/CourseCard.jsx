import React from "react";
import styled from "styled-components";
import { TrackerState } from "../../Context/TrackerProvider";
import { useNavigate } from "react-router-dom";
import { HiUserGroup } from "react-icons/hi";

const CourseCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  padding-bottom: 10px;
  color: black;
  background-color: white;
  border-radius: 24px;
  width: 400px;
  height: 250px;
  box-shadow: 1px -1px 25px -1px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 1px -1px 25px -1px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 1px -1px 25px -1px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.002);
  }
`;

const CardID = styled.div`
  border-radius: 12px;
  /* background-color: #e0f7ef; */
  text-align: left;
  font-weight: 600;
  font-size: 20px;
  color: #5bb38a;
`;

const CardSem = styled.div`
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  color: #5bb38a;
  margin-top: 5px;
`;

const CardName = styled.div`
  font-weight: 600;
  text-align: left;
  font-size: 24px;
  color: black;
`;

const CardDesc = styled.div`
  display: flex;
  height: 80px;
`;

const OpenCourse = styled.div`
  position: absolute;
  font-weight: 400;
  top: 88%;
  left: 92%;
  height: 25px;
  width: 25px;
  padding-left: 9px;
  padding-top: 1px;
  cursor: pointer;
  color: white;
  background-color: black;
  border-radius: 50%;
  &:hover {
    transform: scale(1.1);
  }
`;
const ViewStudents = styled.div`
  position: absolute;
  font-weight: 400;
  top: 88%;
  right: 92%;
  height: 25px;
  width: 25px;
  padding-left: 4px;
  padding-top: 3px;
  cursor: pointer;
  color: white;
  background-color: black;
  border-radius: 50%;
  &:hover {
    transform: scale(1.1);
  }
`;

const CourseCardMain = ({ course, description, isStudent}) => {
  const { setSelectedCourse } = TrackerState();
  const navigate = useNavigate();

  const handleCourseClick = () => {
    localStorage.setItem("courseInfo", JSON.stringify(course));
    setSelectedCourse(course);
    navigate("/course");
  };

  const handleStudentsClick = () => {
    localStorage.setItem("courseInfo", JSON.stringify(course));
    setSelectedCourse(course);
    navigate("/courseStudents");
  };
  return (
    <CourseCard>
      {!isStudent && (
        <ViewStudents onClick={handleStudentsClick}>
          <HiUserGroup />
        </ViewStudents>
      )}
      <OpenCourse onClick={handleCourseClick}>&gt;</OpenCourse>
      <CardID>
        {course.courseID}
        {course.section}
      </CardID>
      <CardName>{course.name}</CardName>
      <CardDesc>{description}</CardDesc>
      <CardSem>
        <hr style={{ marginBottom: "10px" }} />
        {course.semester}
      </CardSem>
    </CourseCard>
  );
};

export default CourseCardMain;
