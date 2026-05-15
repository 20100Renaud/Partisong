import { BrowserRouter, Routes, Route } from "react-router-dom";
import DescriptionPage from "./pages/DescriptionPage";
import LyricsPage from "./pages/LyricsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/description/:id" element={<DescriptionPage />} />
        <Route path="/lyrics/:id" element={<LyricsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
