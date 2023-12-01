import React, { useEffect } from "react";
import { useTracker } from "../../context/TrackerProvider";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const NavBar = styled.nav`
  width: 100%;
  height: 70px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: "Poppins", sans-serif;
`;

const H1Nav = styled.h1`
  color: white;
  font-size: 25px;
  margin: 0;
  margin-left: 20px;
`;

const H2Nav = styled.h1`
  color: white;
  font-size: 14px;
  margin: 0;
  margin-left: 20px;
  font-weight: 600;
`;

const NavLeftDiv = styled.div`
  flex: 1;
  display: flex;
  align-items: start;
  flex-direction: column;
`;

const LogoutBtn = styled.button`
  border: none;
  outline: none;
  padding: 12px 0;
  background-color: white;
  border-radius: 20px;
  width: 120px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  margin-right: 20px;
`;

const LogoImg = styled.img`
  max-width: 50px;
  flex: 1;
  cursor: pointer;
`;
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    localStorage.removeItem("courseInfo");
    localStorage.removeItem("assignmentInfo");
    localStorage.removeItem("submissionInfo");
    localStorage.removeItem("testCases");
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    window.location = "/";
  };

  return (
    <NavBar>
      {user && (
        <NavLeftDiv>
          <H1Nav>
            {user.firstName} {user.lastName}
          </H1Nav>
          <H2Nav>{user.userType}</H2Nav>
        </NavLeftDiv>
      )}
      <LogoImg
        src="userLogo.jpg"
        alt="Autograder logo"
        onClick={handleLogoClick}
      />
      <div style={{ flex: "1", textAlign: "right" }}>
        <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
      </div>
    </NavBar>
  );
};

export default Navbar;
