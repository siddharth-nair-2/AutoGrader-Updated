import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TrackerState } from "../../../context/TrackerProvider";
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

const PlagiarismPage = () => {
  const fetchAllPlagiarismComparisons = async () => {
    try {
      let url = `http://localhost:5000/api/tracker/plagiarism?assignmentID=${
        JSON.parse(localStorage.getItem("assignmentInfo"))._id
      }&courseID=${JSON.parse(localStorage.getItem("assignmentInfo")).courseID}`;
      const data = await axios.get(url);
      console.log(url);
      console.log(data.data);
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
      headerName: "Name",
      field: "student1Name",
    },
    {
      headerName: "Compared To",
      field: "student2Name",
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
      headerName: "Similarity %",
      field: "similarity",
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
      fetchAllPlagiarismComparisons();
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

  const onFilterTextChange = (e) => {
    gridApi.setQuickFilter(e.target.value);
  };

  return (
    <Container>
      <Navbar />
      {selectedCourse && selectedCourse?.name && (
        <>
          <Heading>
            <Link to={"/viewAssignment"}>
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
          </Heading>
          {
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Title>Plagiarism Comparisons - {selectedAssignment?.name}</Title>
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
            </div>
          }
        </>
      )}
    </Container>
  );
};

export default PlagiarismPage;
