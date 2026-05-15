import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./Index.css";

import Dashboard from "./pages/SongDashboard";
import DescriptionPage from "./pages/DescriptionPage";
import LyricsPage from "./pages/LyricsPage";
import PrintPage from "./pages/PrintPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/description/:id" element={<DescriptionPage />} />

        <Route path="/lyrics/:id" element={<LyricsPage />} />

        <Route path="/print/:id" element={<PrintPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
