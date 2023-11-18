import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TrackerState } from "../../../Context/TrackerProvider";
import Heading from "../../misc/Heading";
import Navbar from "../../misc/Navbar";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  padding-bottom: 20px;
  background-color: #f4f3f6;
`;

const CourseButtons = styled.button`
  border: none;
  outline: none;
  padding: 16px;
  background-color: black;
  border-radius: 24px;
  font-weight: bold;
  font-size: 14px;
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

const CourseBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
  margin: 25px;
`;

const Title = styled.div`
  color: black;
  font-size: 20px;
  margin: 20px 80px 20px 80px;
  font-weight: 600;
  justify-content: center;
  display: flex;
`;

const RemoveStudent = styled.button`
  color: #0099ff;
  background-color: #b0dfff;
  border: 1px solid #0099ff;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  font-size: 12;
  border-radius: 14px;
  margin-top: 3px;
  margin-bottom: 3px;
  padding-left: 15px;
  padding-right: 15px;
`;

const Input = styled.input`
  border: #e1dfec 2px solid;
  width: 100%;
  padding: 10px;
  border-radius: 46px;
  background-color: white;
  margin: 5px 0;
  font-size: 12px;
`;

const ViewAssignmentSubmission = () => {
  const fetchAllAssignments = async () => {
    try {
      const data = await axios.post(
        "http://localhost:5000/api/tracker/getAllSubmissions",
        {
          courseID: JSON.parse(localStorage.getItem("assignmentInfo")).courseID,
          assignmentID: JSON.parse(localStorage.getItem("assignmentInfo"))._id,
        }
      );
      setAllStudents(data.data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the students",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const DateRenderer = (params) => {
    return (
      <div>
        {new Date(params.data.updatedAt).toLocaleString("en-CA", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}
      </div>
    );
  };

  const LanguageRenderer = (params) => {
    return params.data.languageName === "62"
      ? "Java"
      : params.data.languageName === "50"
      ? "C"
      : params.data.languageName === "54"
      ? "C++"
      : "Python";
  };
  const navigate = useNavigate();

  const ViewButton = (params) => {
    const removeHandler = async () => {
      localStorage.setItem("submissionInfo", JSON.stringify(params.data));
      navigate("/viewSubmission");
    };

    return <RemoveStudent onClick={removeHandler}>View</RemoveStudent>;
  };
  const [columnDefsAdd] = useState([
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      maxWidth: 75,
    },
    {
      headerName: "Name",
      field: "studentName",
    },
    {
      headerName: "Q. No.",
      maxWidth: 100,
      field: "questionNum",
    },
    {
      headerName: "Language",
      maxWidth: 150,
      cellRenderer: LanguageRenderer,
    },
    {
      headerName: "Passed Cases",
      maxWidth: 155,
      field: "testCases",
    },
    { headerName: "Upload Date", cellRenderer: DateRenderer },
    {
      headerName: "View",
      minWidth: 120,
      maxWidth: 150,
      cellRenderer: ViewButton,
    },
  ]);

  const toast = useToast();

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { selectedCourse, setSelectedCourse } = TrackerState();
  const [allStudents, setAllStudents] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState();

  useEffect(() => {
    localStorage.removeItem("submissionInfo");
    if (!JSON.parse(localStorage.getItem("assignmentInfo"))) {
      navigate("/course");
    } else {
      setSelectedCourse(JSON.parse(localStorage.getItem("courseInfo")));
      setSelectedAssignment(JSON.parse(localStorage.getItem("assignmentInfo")));
      fetchAllAssignments();
    }
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const handleVisibilityToggle = async () => {
    if (
      window.confirm(
        `The assignment is currently ${
          selectedAssignment.visibleToStudents ? "" : "not "
        }visible to students! Are you sure you want to change this?`
      )
    ) {
      try {
        const data = await axios
          .post("http://localhost:5000/api/tracker/updateAssignment", {
            assignmentID: JSON.parse(localStorage.getItem("assignmentInfo"))
              ._id,
            courseID: JSON.parse(localStorage.getItem("assignmentInfo"))
              .courseID,
            visibleToStudents: !JSON.parse(
              localStorage.getItem("assignmentInfo")
            ).visibleToStudents,
          })
          .then(() =>
            toast({
              title: "Visibility Changed!",
              description: `The assignment is ${
                JSON.parse(localStorage.getItem("assignmentInfo"))
                  .visibleToStudents
                  ? "not "
                  : ""
              }visible to students!`,
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "bottom-left",
            })
          )
          .then(() => navigate("/course"));
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Delete the assignment",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const handleAssignmentDelete = async () => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        const data = await axios
          .post("http://localhost:5000/api/tracker/assignmentDelete", {
            assignmentID: JSON.parse(localStorage.getItem("assignmentInfo"))
              ._id,
          })
          .then(() => navigate("/course"));
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Delete the assignment",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const onFilterTextChange = (e) => {
    gridApi.setQuickFilter(e.target.value);
  };

  return (
    <Container>
      <Navbar />
      {selectedCourse && selectedCourse?.name && (
        <>
          <Heading>
            <Link to={"/course"}>
              <CourseButtons
                style={{
                  position: "absolute",
                  left: "1%",
                  fontSize: "14px",
                  padding: "5px 10px 5px 10px",
                  cursor: "pointer",
                }}
              >{`< Back`}</CourseButtons>
            </Link>
            {selectedCourse?.name.toUpperCase()}
            <CourseButtons
              style={{
                position: "absolute",
                right: "1%",
                fontSize: "16px",
                padding: "10px 15px 10px 15px",
                backgroundColor: "#46282F",
              }}
              onClick={handleAssignmentDelete}
            >
              Delete Assignment
            </CourseButtons>
          </Heading>
          {
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Title>All Submissions for {selectedAssignment?.name}</Title>
              <CourseBox>
                <div
                  className="ag-theme-alpine"
                  style={{
                    height: 500,
                    width: "60%",
                    fontFamily: "Poppins, Sans-Serif",
                    fontSize: 14,
                  }}
                >
                  <Input
                    type="search"
                    id="search-students"
                    placeholder="Search..."
                    name="searchStudents"
                    onChange={onFilterTextChange}
                    required
                  />
                  <AgGridReact
                    rowData={allStudents.sort((p1, p2) => {
                      let firstComp =
                        p1.studentName < p2.studentName
                          ? 1
                          : p1.studentName > p2.studentName
                          ? -1
                          : 0;
                      if (firstComp === 0) {
                        let aDate = new Date(p1.createdAt);
                        let bDate = new Date(p2.createdAt);
                        firstComp = bDate - aDate;
                      }
                      return firstComp;
                    })}
                    columnDefs={columnDefsAdd}
                    onGridReady={onGridReady}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    rowHeight={50}
                    paginationPageSize={10}
                  ></AgGridReact>
                </div>
              </CourseBox>
              <div
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "flex",
                }}
              >
                <Link to={"/plagiarism"}>
                  <CourseButtons
                    style={{
                      fontSize: "18px",
                      marginTop: "50px",
                      width: "200px",
                      padding: "10px",
                      backgroundColor: "#46282F",
                    }}
                  >
                    Plagiarism List
                  </CourseButtons>
                </Link>
                <CourseButtons
                  style={{
                    fontSize: "18px",
                    marginTop: "50px",
                    width: "200px",
                    padding: "10px",
                    backgroundColor: "Black",
                  }}
                  onClick={handleVisibilityToggle}
                >
                  Toggle Visibility
                </CourseButtons>
              </div>
            </div>
          }
        </>
      )}
    </Container>
  );
};

export default ViewAssignmentSubmission;
