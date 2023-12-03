import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";
import TrackerProvider from "./context/TrackerProvider";
import AuthProvider from "./context/AuthProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            // Your custom theme tokens
            colorPrimary: "#000000", // Primary color
            borderRadiusBase: "2px", // Border radius
            colorBgContainer: "#f4f3f6", // Background color for containers
            colorTextBase: "#000000", // Base text color
            colorHeading: "#ffffff", // Text color for headings
            // Add more customizations as needed 6ab28a
          },
        }}
      >
        <AuthProvider>
          <TrackerProvider>
            <App />
          </TrackerProvider>
        </AuthProvider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
