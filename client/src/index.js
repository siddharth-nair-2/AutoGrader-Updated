import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {ConfigProvider, theme} from "antd";
import {BrowserRouter} from "react-router-dom";
import TrackerProvider from "./context/TrackerProvider.js";
import AuthProvider from "./context/AuthProvider.js";
import {App as AppAntd} from "antd";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ConfigProvider
                theme={{
                    algorithm: theme.defaultAlgorithm,
                    token: {
                        // Your custom theme tokens
                        colorPrimary: "#000000", // Primary color
                        // Add more customizations as needed 6ab28a
                    },
                    components: {
                        Card: {
                            actionsBg: "#ffffff",
                        },
                        Select: {
                            optionActiveBg: "#d4d4d4",
                            optionSelectedBg: "#a3a3a3",
                        },
                        Button: {
                            colorPrimaryBorderHover: "#000000",
                            colorPrimaryBgHover: "#ffffff",
                            colorPrimaryTextHover: "#000000",
                            colorPrimary: "#ffffff",
                            colorPrimaryBorder: "#000000",
                            colorPrimaryBg: "#000000",
                        },
                    },
                }}
            >
                <AuthProvider>
                    <TrackerProvider>
                        <AppAntd>
                            <DevSupport ComponentPreviews={ComponentPreviews}
                                        useInitialHook={useInitial}
                            >
                                <App/>
                            </DevSupport>
                        </AppAntd>
                    </TrackerProvider>
                </AuthProvider>
            </ConfigProvider>
        </BrowserRouter>
    </React.StrictMode>
);
