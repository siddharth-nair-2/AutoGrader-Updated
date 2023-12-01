import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useTracker } from "../../context/TrackerProvider";

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

const OpenAssignment = styled.div`
  position: absolute;
  font-weight: 400;
  top: 88%;
  left: 92%;
  height: 25px;
  width: 25px;
  padding-left: 0px;
  padding-bottom: 3px;
  cursor: pointer;
  color: white;
  background-color: black;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    transform: scale(1.1);
  }
`;

const AssignmentCard = ({ assignment }) => {
  const { setSelectedCourse } = useTracker();
  const navigate = useNavigate();

  const handleAssignmentOpen = () => {
    localStorage.setItem("assignmentInfo", JSON.stringify(assignment));
    navigate("/viewassignment");
  };
  return (
    <CourseCard>
      <OpenAssignment onClick={handleAssignmentOpen}>&rarr;</OpenAssignment>
      <CardID>{assignment.name}</CardID>
      {console.log(assignment.questions)}
      {assignment.questions !== undefined ? (
        <CardName>{`${assignment.questions?.length} Question(s)`}</CardName>
      ) : (
        <CardName>{`${assignment.instructorFiles?.length} Files`}</CardName>
      )}
      <CardDesc>{assignment.description}</CardDesc>
      <CardSem>
        <hr style={{ marginBottom: "10px" }} />
        {`Due on: ${new Date(assignment.due_date).toLocaleString("en-CA", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}`}
      </CardSem>
    </CourseCard>
  );
};

export default AssignmentCard;
