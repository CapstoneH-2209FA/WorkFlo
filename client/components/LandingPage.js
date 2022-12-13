import React from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
const LandingPage = () => {
  return (
    <Container>
      <Box>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            color: "white",
            backgroundColor: "rgba(20,20,20,.3)",
          }}
        >
          <h2>Improve Productivity</h2>

          <h3>Introducing WorkFlo</h3>
        </div>

        {/* <img
          height="100%"
          width="100%"
          src="https://img.freepik.com/free-photo/water-splash-isolated-white-background_1112-2043.jpg?w=2000"
        /> */}
      </Box>
      <Link to="/login">
        <Button variant="contained" size="large">
          Get Started
        </Button>
      </Link>
    </Container>
  );
};

export default LandingPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(9, 121, 110, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
  justify-content: center;
  align-items: center;
  height: calc(100vh - 150px);
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  font-family: Ubuntu;
  height: 30vh;
  filter: drop-shadow(10px 10px 4px black);
  width: 50vw;
  margin-bottom: 20px;
  background-image: url("/images/flo.jpeg");
  background-size: cover;
`;
