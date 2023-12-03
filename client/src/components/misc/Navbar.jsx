import React, { useEffect } from "react";
import { Layout, Menu, Button, Avatar, Typography, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
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

const { Header } = Layout;
const { Text } = Typography;
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
    <Layout className="layout">
      <Header
        style={{
          backgroundColor: "black",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left Section: User Information */}
        {user && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Text strong style={{ color: "white", marginBottom: "2px" }}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={{ color: "white" }}>{user.userType}</Text>
          </div>
        )}

        {/* Center Section: Logo */}
        <Avatar
          src="userLogo.jpg"
          onClick={handleLogoClick}
          style={{ cursor: "pointer", alignSelf: "center" }}
        />

        {/* Right Section: Logout Button */}
        <Button
          type="primary"
          shape="round"
          icon={<UserOutlined />}
          onClick={handleLogout}
          style={{ backgroundColor: "white", color: "black", border: "none" }}
        >
          Logout
        </Button>
      </Header>
    </Layout>
  );
};

export default Navbar;
