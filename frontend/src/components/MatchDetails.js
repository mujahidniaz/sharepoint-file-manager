// src/components/MatchDetails.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Container,
  Spinner,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaFile,
  FaFileAlt,
  FaParagraph,
  FaTable,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import "./MatchDetails.css";

function MatchDetails() {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const { fileId } = useParams();
  const navigate = useNavigate();
  const searchTerm = new URLSearchParams(window.location.search).get("term");

  useEffect(() => {
    fetchDetails();
  }, [fileId]);

  const fetchDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/search_files",
        { search_word: searchTerm },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      const fileDetails = response.data.find(
        (file) => file.file_name === decodeURIComponent(fileId)
      );
      setDetails(fileDetails);
    } catch (error) {
      console.error("Error fetching match details:", error);
      setError(
        "An error occurred while fetching match details. Please try again."
      );
    }
  };

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!details)
    return (
      <Spinner animation="border" role="status" className="d-block mx-auto" />
    );
  const backToSearch = () => {
    alert(searchTerm);
    navigate(`/search?term=${searchTerm}`);
  };
  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/files")}>
          Files
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate(`/search?term=${searchTerm}`)}>
          Search Results
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Match Details</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FaFile className="me-2" />
          Match Details for {details.file_name}
        </h2>
        <Button
          variant="outline-primary"
          onClick={() => navigate(`/search?term=${searchTerm}`)}
        >
          <FaArrowLeft className="me-2" />
          Back to Search Results
        </Button>
      </div>

      <Alert variant="info">
        Showing matches for "{searchTerm}" in {details.file_name}
      </Alert>

      {details.matches.map((match, index) => (
        <Card key={index} className="mb-3 match-card">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-3">
              {match.paragraph_number && (
                <Badge bg="info" className="match-badge">
                  <FaParagraph className="me-1" />
                  Paragraph {match.paragraph_number}
                </Badge>
              )}
              {match.page_number && (
                <Badge bg="info" className="match-badge">
                  <FaFileAlt className="me-1" />
                  Page {match.page_number}, Line {match.line_number}
                </Badge>
              )}
              {match.line_number && !match.page_number && (
                <Badge bg="info" className="match-badge">
                  Line {match.line_number}
                </Badge>
              )}
              {match.sheet_name && (
                <Badge bg="info" className="match-badge">
                  <FaTable className="me-1" />
                  Sheet: {match.sheet_name}, Cell: {match.cell}
                </Badge>
              )}
              <Badge bg="primary" className="match-count">
                {match.matches} {match.matches === 1 ? "match" : "matches"}
              </Badge>
            </div>
            <Card.Text className="match-content">{match.content}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default MatchDetails;
