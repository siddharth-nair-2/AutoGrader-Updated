import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const trackerContext = createContext();

const TrackerProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedCourse, setSelectedCourse] = useState();
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);
  return (
    <trackerContext.Provider
      value={{
        user,
        setUser,
        selectedCourse,
        setSelectedCourse,
        courses,
        setCourses,
      }}
    >
      {children}
    </trackerContext.Provider>
  );
};
export const TrackerState = () => {
  return useContext(trackerContext);
};

export default TrackerProvider;
