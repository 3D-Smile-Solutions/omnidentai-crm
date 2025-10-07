import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector, useDispatch } from "react-redux";
import { Provider } from "react-redux";
import  store  from "./redux/store";
import { fetchMe } from "./redux/slices/authSlice";
import { getTheme } from "./theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import BackgroundWrapper from "./components/BackgroundWrapper/BackgroundWrapper";
import "./App.css"; // Import the CSS

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";

function AppContent() {
  const dispatch = useDispatch();
  const { user, fetchStatus } = useSelector((state) => state.auth);
  const { isDarkMode } = useTheme();
  const theme = getTheme(isDarkMode);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  // Apply theme class to body
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  const isAuthenticated = !!user;

  if (fetchStatus === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BackgroundWrapper>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
            />
            <Route
              path="/"
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
            />
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={3000} />
      </BackgroundWrapper>
    </MuiThemeProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}