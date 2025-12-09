import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Uploadpage from "./Uploadpage";
import Dashboard from "./Dashboard";

// Check if user is logged in
const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

// Route wrapper to protect private routes
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fileupload"
          element={
            <ProtectedRoute>
              <Uploadpage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
