import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import DescriptionPage from "./DescriptionPage";
import LyricsPage from "./LyricsPage";
import PrintPage from "./PrintPage";
import { House, MoveHorizontal, Maximize } from "lucide-react";
import { styles, ui, themes } from "../styles/styles";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function StudioPage({ toggleFullscreen }) {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [view, setView] = useState("description");
  const [zoom, setZoom] = useState(1);
  const previewRef = useRef(null);
  const printRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  const exportPDF = async () => {
    if (!printRef.current) return;

    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [794, 1123],
    });

    pdf.addImage(imgData, "PNG", 0, 0, 794, 1123);

    pdf.save(`${song.artist} - ${song.title}.pdf`);
  };

  useEffect(() => {
    fetch(`/api/songs/${id}`)
      .then((r) => r.json())
      .then(setSong);
  }, [id]);

  const PAGE_WIDTH = 794;
  const PAGE_HEIGHT = 1123;

  const fitWidth = () => {
    if (!previewRef.current) return;

    const containerWidth = previewRef.current.clientWidth;
    const newZoom = (containerWidth -40) / PAGE_WIDTH;

    setZoom(newZoom);
  };

  const fitHeight = () => {
    if (!previewRef.current) return;

    const containerHeight = previewRef.current.clientHeight;
    const newZoom = (containerHeight ) / PAGE_HEIGHT;

    setZoom(newZoom);

    requestAnimationFrame(() => {
      const el = previewRef.current;
      if (!el) return;

      el.scrollTop = 0;
      el.scrollLeft = 0;
    });
  };

  const handleMouseDown = (e) => {
    if (!previewRef.current) return;

    isDragging.current = true;

    startX.current = e.pageX;
    startY.current = e.pageY;

    scrollLeft.current = previewRef.current.scrollLeft;
    scrollTop.current = previewRef.current.scrollTop;

    previewRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !previewRef.current) return;

    e.preventDefault();

    const dx = e.pageX - startX.current;
    const dy = e.pageY - startY.current;

    previewRef.current.scrollLeft = scrollLeft.current - dx;
    previewRef.current.scrollTop = scrollTop.current - dy;
  };

  const handleMouseUp = () => {
    isDragging.current = false;

    if (previewRef.current) {
      previewRef.current.style.cursor = "grab";
    }
  };

  const orderedBlocks = useMemo(() => {
    return song?.progressions
      ?.flatMap((p) => p.lyricsBlocks || [])
      .sort((a, b) => a.position - b.position);
  }, [song]);

  if (!song) return <div>Loading...</div>;

  return (
    <div className="h-screen flex bg-black overflow-hidden">
      {/* HOME BTN */}
      <div className="absolute left-1/2 -translate-x-1/2 top-8 z-60">
        <Link to="/dashboard" className={`${ui.button} w-12 h-12`}>
          <House size={18} className="group-hover:hidden" />
          <span className="hidden group-hover:block text-sm font-medium">
            Accueil
          </span>
        </Link>
      </div>
      {/* -------------LEFT : EDITOR-------------------- */}
      <div className="w-1/2 border-r border-zinc-800 flex flex-col h-full">
        {/* HEADER */}
        <div className="flex gap-2 border-b border-zinc-800 h-14 items-center shrink-0">
          {/* NAV BTN */}
          <div className="relative flex mx-auto gap-3">
            <div>
              <button
                onClick={() => setView("description")}
                className={`${ui.buttonSm}
              px-4 py-2 rounded-xl cursor-pointer
              ${view === "description" ? "" : "bg-gradient-to-b from-zinc-500 to-zinc-800"}
            `}
              >
                Descripsong
              </button>
            </div>
            <div>
              <button
                onClick={() => setView("lyrics")}
                className={`${ui.buttonSm}
              px-4 py-2 rounded-xl cursor-pointer
              ${view === "lyrics" ? "" : "bg-gradient-to-b from-zinc-500 to-zinc-800"}
            `}
              >
                Chansong
              </button>
            </div>
          </div>
          
        </div>

        {/* EDITOR */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {view === "description" ? (
            <DescriptionPage
              embedded
              song={song}
              setSong={setSong}
              toggleFullscreen={toggleFullscreen}
            />
          ) : (
            <LyricsPage
              embedded
              song={song}
              setSong={setSong}
              toggleFullscreen={toggleFullscreen}
            />
          )}
        </div>
      </div>

      {/* ----------------RIGHT : PREVIEW-------------- */}
      <div className="w-1/2 flex flex-col z-50">
        {/* HEADER */}
        <div className="flex items-center justify-between p-3 border-b border-zinc-800 h-14">
          {/* LEFT : empty */}
          <div className="w-40" />

          {/* CENTER : ZOOM GROUP */}

          <div className="flex items-center gap-3 mx-auto">
            <button onClick={fitWidth} className={`${ui.buttonSm} px-4 py-2`}>
              <MoveHorizontal size={18} />
            </button>

            <div className="flex flex-col items-center text-white">
              <span className=" absolute text-sm w-12 mt-3">
                {Math.round(zoom * 100)}%
              </span>

              <input
                type="range"
                min={1}
                max={2}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="relative  w-48 accent-purple-500 cursor-pointer"
              />
            </div>

            <button onClick={fitHeight} className={`${ui.buttonSm} px-4 py-2`}>
              <Maximize size={18} absoluteStrokeWidth />
            </button>
          </div>

          {/* RIGHT : PDF BUTTON */}
          <div className="w-40 flex justify-end">
            <button onClick={exportPDF} className={`${ui.buttonSm} px-4 py-2 `}>
              Export PDF
            </button>
          </div>
        </div>

        {/* PREVIEW */}
        <div
          ref={previewRef}
          className="flex-1 overflow-auto p-6 cursor-grab select-none no-scrollbar"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="min-w-max flex justify-center">
            <PrintPage
              ref={printRef}
              embedded
              song={song}
              orderedBlocks={orderedBlocks}
              zoom={zoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
