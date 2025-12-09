import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoArrowBack } from "react-icons/io5";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/dashboard/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => setUserData(response.data))
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        navigate("/login");
      });
  }, [navigate]);

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <IoArrowBack size={22} />
      </BackButton>

      <Card>
        <Title>Welcome to Your Dashboard</Title>

        {userData ? (
          <Subtitle>
            Hello, <b>{userData.username}</b>
            <br />
            <small>{userData.email}</small>
          </Subtitle>
        ) : (
          <Loading>Loading user details...</Loading>
        )}

        <ButtonRow>
          <GreenButton onClick={() => navigate("/fileupload")}>
            Upload File
          </GreenButton>

          <BlueButton
            onClick={() => {
              localStorage.removeItem("access_token");
              navigate("/login");
            }}
          >
            Logout
          </BlueButton>
        </ButtonRow>
      </Card>
    </Container>
  );
};

export default Dashboard;

/* 🌈 Styled Components */

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

/* 🔙 Floating Back Button */
const BackButton = styled.button`
  position: absolute;
  top: 25px;
  left: 25px;
  background: rgba(255, 255, 255, 0.25);
  border: none;
  padding: 12px;
  border-radius: 50%;
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  transition: 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.35);
  }
`;

const Card = styled.div`
  width: 420px;
  background: rgba(255, 255, 255, 0.18);
  padding: 40px;
  border-radius: 18px;
  backdrop-filter: blur(18px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  text-align: center;
  color: white;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 15px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.05rem;
  margin-bottom: 25px;
  opacity: 0.9;

  small {
    opacity: 0.8;
  }
`;

const Loading = styled.p`
  margin-bottom: 25px;
  opacity: 0.9;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  color: white;
  width: 48%;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

const GreenButton = styled(Button)`
  background: #28a745;
`;

const BlueButton = styled(Button)`
  background: #007bff;
`;
