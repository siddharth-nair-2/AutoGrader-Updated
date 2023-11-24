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

const ViewCreateDiv = styled.div`
  display: flex;
  font-size: 24px;
  justify-content: space-evenly;
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

const AddStudent = styled.button`
  color: #014b01;
  background-color: #e2ffe2;
  border: 1px solid #014b01;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  font-size: 12;
  border-radius: 14px;
  margin-top: 3px;
  margin-bottom: 3px;
  padding-left: 15px;
  padding-right: 15px;
`;

const RemoveStudent = styled.button`
  color: darkred;
  background-color: #ffd4d4;
  border: 1px solid darkred;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  font-size: 12;
  border-radius: 14px;
  margin-top: 3px;
  margin-bottom: 3px;
  padding-left: 5px;
  padding-right: 5px;
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

const CourseStudents = () => {
  const fetchCourseStudents = async () => {
    try {
      const data = await axios.get(
        `http://localhost:5000/api/user/students/course/${
          JSON.parse(localStorage.getItem("courseInfo"))._id
        }`
      );
      setStudents(data.data);
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

  const fetchAllStudents = async () => {
    try {
      const data = await axios.get("http://localhost:5000/api/user/students");
      const filteredData = data.data.filter((student) => {
        return (
          student.courses.findIndex((x) => {
            return (
              x.courseID === JSON.parse(localStorage.getItem("courseInfo"))._id
            );
          }) === -1
        );
      });
      setAllStudents(filteredData);
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

  const AddButton = (params) => {
    const addHandler = async () => {
      try {
        const data = await axios.put(
          `http://localhost:5000/api/user/${params.data._id}/courses/add/${
            JSON.parse(localStorage.getItem("courseInfo"))._id
          }`
        );
        fetchCourseStudents();
        fetchAllStudents();
        toast({
          title: "Student added!",
          description: `${params.data.firstName} ${params.data.lastName} has been added to the course!`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Add the student!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };
    return <AddStudent onClick={addHandler}>Add</AddStudent>;
  };
  const RemoveButton = (params) => {
    const removeHandler = async () => {
      try {
        const data = await axios.put(
          `http://localhost:5000/api/user/${params.data._id}/courses/remove/${
            JSON.parse(localStorage.getItem("courseInfo"))._id
          }`
        );
        fetchCourseStudents();
        fetchAllStudents();
        toast({
          title: "Student removed!",
          description: `${params.data.firstName} ${params.data.lastName} has been removed from the course!`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to remove the student!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    return <RemoveStudent onClick={removeHandler}>Remove</RemoveStudent>;
  };
  const [columnDefsRemove] = useState([
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      maxWidth: 75,
    },
    { field: "firstName" },
    { field: "lastName" },
    { field: "email" },
    { headerName: "Remove", maxWidth: 150, cellRenderer: RemoveButton },
  ]);
  const [columnDefsAdd] = useState([
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      maxWidth: 75,
    },
    { field: "firstName" },
    { field: "lastName" },
    { field: "email" },
    { headerName: "Add", maxWidth: 150, cellRenderer: AddButton },
  ]);

  const toast = useToast();

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const { selectedCourse, setSelectedCourse } = TrackerState();
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [showAddStudents, setShowAddStudents] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedCourse(JSON.parse(localStorage.getItem("courseInfo")));
    if (!JSON.parse(localStorage.getItem("courseInfo"))) {
      navigate("/");
    }
    fetchCourseStudents();
    fetchAllStudents();
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
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
      {selectedCourse && selectedCourse.name && (
        <>
          <Heading>
            <Link to={"/"}>
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
          {students?.length > 0 && !showAddStudents && (
            <>
              <Title>Enrolled Students</Title>
              <CourseBox>
                <div
                  className="ag-theme-alpine"
                  style={{
                    height: 350,
                    width: "60%",
                    fontFamily: "Poppins, Sans-Serif",
                    fontSize: 14,
                  }}
                >
                  <AgGridReact
                    rowData={students.sort((p1, p2) =>
                      p1.firstName > p2.firstName
                        ? 1
                        : p1.firstName < p2.firstName
                        ? -1
                        : 0
                    )}
                    columnDefs={columnDefsRemove}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    rowHeight={50}
                    paginationPageSize={5}
                  ></AgGridReact>
                </div>
              </CourseBox>
            </>
          )}
          {students?.length <= 0 && (
            <CourseCard>You have no students in this course!</CourseCard>
          )}
          <ViewCreateDiv>
            <CourseButtons
              onClick={(e) => setShowAddStudents(!showAddStudents)}
            >
              {showAddStudents ? "- Enrolled Students" : "+ New Student"}
            </CourseButtons>
          </ViewCreateDiv>
          {showAddStudents && (
            <>
              <Title>Filter through students and add to course!</Title>
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
                    rowData={allStudents.sort((p1, p2) =>
                      p1.firstName > p2.firstName
                        ? 1
                        : p1.firstName < p2.firstName
                        ? -1
                        : 0
                    )}
                    columnDefs={columnDefsAdd}
                    onGridReady={onGridReady}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    rowHeight={50}
                    paginationPageSize={10}
                  ></AgGridReact>
                </div>
              </CourseBox>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default CourseStudents;
