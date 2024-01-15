import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTracker } from "../../../context/TrackerProvider";

const ViewAllModules = () => {
  const { selectedCourse, setSelectedCourse } = useTracker();
  const [modules, setModules] = useState([]);
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
    fetchModules();
  }, []);

  const fetchModules = async () => {};
  return <>sadasd</>;
};

export default ViewAllModules;
