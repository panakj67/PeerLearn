import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
  text-align: center;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 120px;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
`;

const Message = styled.p`
  font-size: 24px;
  margin-bottom: 30px;
  font-weight: 400;
  letter-spacing: 1px;
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 18px;
  border: none;
  background: #ff7b7b;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  
  &:hover {
    background-color: #ff5a5a;
    transform: scale(1.05);
  }
  
  &:active {
    background-color: #ff4a4a;
    transform: scale(1);
  }
`;

const NotFound = () => {
    const navigateHome = () => {
        window.location.href = "/";
    };

  return (
    <Container>
      <Title>404</Title>
      <Message>Oops! The page you're looking for doesn't exist.</Message>
      <Button onClick={navigateHome}>Go Back Home</Button>
    </Container>
  );
};

export default NotFound;
