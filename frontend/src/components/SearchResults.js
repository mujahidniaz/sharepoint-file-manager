// src/components/SearchResults.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { FaArrowLeft, FaFile, FaSearch } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./SearchResults.css";

function SearchResults() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("term");
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      searchFiles();
    }
  }, [searchTerm]);

  const searchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/search_files",
        { search_word: searchTerm },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setResults(response.data);
      setError(null);
    } catch (error) {
      console.error("Error searching files:", error);
      setError("An error occurred while searching files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/files")}>
          Files
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Search Results</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="mb-0">
            <FaSearch className="me-2" />
            Search Results
          </h2>
        </Col>
        <Col xs="auto">
          <Button variant="outline-secondary" as={Link} to="/files">
            <FaArrowLeft className="me-2" />
            Back to File List
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Alert variant="info">Searching for "{searchTerm}"...</Alert>
      ) : results.length === 0 ? (
        <Alert variant="warning">No results found for "{searchTerm}"</Alert>
      ) : (
        <>
          <Alert variant="info">
            Found {results.length} result{results.length !== 1 ? "s" : ""} for "
            {searchTerm}"
          </Alert>
          {results.map((file) => (
            <Card key={file.file_name} className="mb-3 search-result-card">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs={12} md={6}>
                    <h5 className="mb-0">
                      <FaFile className="me-2" />
                      {file.file_name}
                    </h5>
                  </Col>
                  <Col xs={12} md={3} className="my-2 my-md-0">
                    <Badge bg="primary" className="p-2">
                      Matches: {file.total_matches}
                    </Badge>
                  </Col>
                  <Col xs={12} md={3} className="text-md-end">
                    <Button
                      variant="outline-primary"
                      as={Link}
                      to={`/details/${encodeURIComponent(
                        file.file_name
                      )}?term=${searchTerm}`}
                      className="w-100"
                    >
                      View Details
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
}

export default SearchResults;
