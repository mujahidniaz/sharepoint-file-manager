// src/App.js
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css"; // We'll create this for custom styles
import FileList from "./components/FileList";
import FileUpload from "./components/FileUpload";
import Layout from "./components/Layout";
import Login from "./components/Login";
import MatchDetails from "./components/MatchDetails";
import SearchResults from "./components/SearchResults";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Layout>
              <FileList />
            </Layout>
          }
        />
        <Route
          path="/files"
          element={
            <Layout>
              <FileList />
            </Layout>
          }
        />
        <Route
          path="/upload"
          element={
            <Layout>
              <FileUpload />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <SearchResults />
            </Layout>
          }
        />
        <Route
          path="/details/:fileId"
          element={
            <Layout>
              <MatchDetails />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/files" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
