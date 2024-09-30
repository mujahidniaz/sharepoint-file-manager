import axios from "axios";
import React, { useRef, useState } from "react";
import { Alert, Button, Card, Container, ProgressBar } from "react-bootstrap";
import { FaCloudUploadAlt, FaFile, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./FileUpload.css";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      setUploading(false);
      navigate("/files");
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("File upload failed. Please try again.");
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <Container className="py-4">
      <Card className="upload-card">
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <FaCloudUploadAlt className="upload-icon" />
            <h2>Upload File</h2>
          </Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <div
            className="drop-zone"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <p>Drag and drop a file here, or click to select a file</p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          {file && (
            <div className="file-info">
              <FaFile className="file-icon" />
              <span>{file.name}</span>
              <Button
                variant="link"
                onClick={removeFile}
                className="remove-file"
              >
                <FaTimes />
              </Button>
            </div>
          )}
          {uploading && (
            <ProgressBar
              now={uploadProgress}
              label={`${uploadProgress}%`}
              className="my-3"
            />
          )}
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!file || uploading}
            className="upload-button"
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default FileUpload;
