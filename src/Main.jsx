import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./Index.css";

import Dashboard from "./pages/SongDashboard";
import DescriptionPage from "./pages/DescriptionPage";
import LyricsPage from "./pages/LyricsPage";
import PrintPage from "./pages/PrintPage";
import StudioPage from "./pages/StudioPage";

function App() {
  const goFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        exitFullscreen();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route
        path="/dashboard"
        element={<Dashboard toggleFullscreen={toggleFullscreen} />}
      />
      <Route
        path="/description/:id"
        element={<DescriptionPage toggleFullscreen={toggleFullscreen} />}
      />
      <Route
        path="/lyrics/:id"
        element={<LyricsPage toggleFullscreen={toggleFullscreen} />}
      />
      <Route
        path="/print/:id"
        element={<PrintPage toggleFullscreen={toggleFullscreen} />}
      />
      <Route
        path="/studio/:id"
        element={<StudioPage toggleFullscreen={toggleFullscreen} />}
      />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
