// src/components/Layout.js
import React from "react";
import { Container } from "react-bootstrap";
import NavBar from "./NavBar";

function Layout({ children }) {
  return (
    <>
      <NavBar />
      <Container className="mt-4">{children}</Container>
    </>
  );
}

export default Layout;
