// src/components/NavBar.js
import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/files">
          <img
            src="https://banner2.cleanpng.com/20180612/fre/kisspng-sharepoint-online-microsoft-office-365-microsoft-i-5b1f7d411e18e2.0374999515287903371233.jpg"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="SharePoint logo"
          />
          SharePoint File Manager
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Button variant="outline-primary" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
