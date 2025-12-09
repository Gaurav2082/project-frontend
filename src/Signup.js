import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (!name || !email || !password) {
        throw new Error("Please fill all fields");
      }

      await axios.post("http://127.0.0.1:8000/api/signup/", {
        name,
        email,
        password,
      });

      setMessage("Signup successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.error || "Signup failed. Try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupContainer>
      <SignupPaper elevation={5}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Create Account
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Join us and start your journey
        </Typography>

        <StyledTextField
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />

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

        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
        </StyledButton>

        {/* 🔗 Login Option */}
        <Typography variant="body2" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <Link
            sx={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/login")}
          >
            Login
          </Link>
        </Typography>

        <Snackbar
          open={!!message}
          autoHideDuration={6000}
          onClose={() => setMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setMessage("")}
            severity={message.includes("successful") ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </SignupPaper>
    </SignupContainer>
  );
}

export default Signup;

/* 🌈 UI Styles */

const SignupContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  padding: 20px;
`;

const SignupPaper = styled(Paper)`
  padding: 35px;
  width: 380px;
  border-radius: 15px;
  text-align: center;
  background: #ffffffee;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 20px !important;
`;

const StyledButton = styled(Button)`
  margin-top: 10px !important;
  width: 100%;
  padding: 10px !important;
  border-radius: 8px !important;
  font-weight: bold !important;
  text-transform: none !important;

  &:hover {
    transform: scale(1.02);
  }
`;
