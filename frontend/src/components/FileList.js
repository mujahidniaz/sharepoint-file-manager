// src/components/FileList.js
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { FaEye, FaSearch, FaSync, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./FileList.css";

function FileList() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchFiles = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) setRefreshing(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/list_files", {
          headers: { Authorization: token },
        });

        if (Array.isArray(response.data)) {
          setFiles(response.data);
          setError(null);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        setError(
          "An error occurred while fetching files. Please try logging in again."
        );
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    fetchFiles();
    const intervalId = setInterval(() => {
      fetchFiles(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchFiles]);

  const handleSearch = () => {
    navigate(`/search?term=${searchTerm}`);
  };

  const handleManualRefresh = () => {
    fetchFiles(true);
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <h2 className="my-4">Files</h2>
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search files"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary" onClick={handleSearch}>
              <FaSearch /> Search
            </Button>
          </InputGroup>
        </Col>
        <Col md={6} className="text-md-end mt-3 mt-md-0">
          <Button
            variant="success"
            onClick={() => navigate("/upload")}
            className="me-2"
          >
            <FaUpload /> Upload File
          </Button>
          <Button
            variant="outline-secondary"
            onClick={handleManualRefresh}
            disabled={refreshing}
          >
            <FaSync className={refreshing ? "fa-spin" : ""} /> Refresh
          </Button>
        </Col>
      </Row>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created</th>
              <th>Modified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.URL}>
                <td>{file.Name}</td>
                <td>{new Date(file.Created).toLocaleString()}</td>
                <td>{new Date(file.Modified).toLocaleString()}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    href={file.WebURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaEye /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default FileList;
