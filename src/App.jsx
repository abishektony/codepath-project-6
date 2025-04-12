// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard";
import MovieDetail from "./MovieDetail";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </Router>
  );
}
