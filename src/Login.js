import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

function Login() {
  const API_URL = "https://project-backend-1-wrwn.onrender.com/api/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}login/`, {
        email,
        password,
      });

      // Save token if exists
      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
      }

      showSnackbar("Login successful!", "success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      showSnackbar(
        error.response?.data?.error || "Login failed. Try again.",
        "error"
      );
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <PageContainer>
      <FormCard elevation={4}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Welcome Back
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Login to continue
        </Typography>

        <StyledTextField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />

        <StyledTextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />

        <StyledButton variant="contained" color="primary" onClick={handleLogin}>
          Login
        </StyledButton>

        {/* Signup link */}
        <Typography variant="body2" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <Link
            sx={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Link>
        </Typography>
      </FormCard>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}

export default Login;

/************* Styled Components **************/

const PageContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  padding: 20px;
`;

const FormCard = styled(Paper)`
  width: 380px;
  padding: 35px;
  text-align: center;
  border-radius: 15px;
  background: #ffffffee;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 20px !important;
`;

const StyledButton = styled(Button)`
  width: 100%;
  padding: 10px !important;
  border-radius: 8px !important;
  font-weight: bold !important;
  text-transform: none !important;

  &:hover {
    transform: scale(1.02);
  }
`;
