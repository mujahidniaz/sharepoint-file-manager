// src/components/Login.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Form, Image } from "react-bootstrap";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/files");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.session_token);
      navigate("/files");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <div className="text-center mb-4">
              <Image
                src="https://banner2.cleanpng.com/20180612/fre/kisspng-sharepoint-online-microsoft-office-365-microsoft-i-5b1f7d411e18e2.0374999515287903371233.jpg"
                alt="SharePoint Logo"
                width="80"
                height="80"
              />
              <h2 className="mt-3">SharePoint File Manager</h2>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group id="username" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group id="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button className="w-100" type="submit">
                <FaSignInAlt className="me-2" />
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;
