import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import DescriptionPage from "./DescriptionPage";
import LyricsPage from "./LyricsPage";
import PrintPage from "./PrintPage";
import { House, MoveHorizontal, Maximize, ExternalLink } from "lucide-react";
import { PAGE_WIDTH, PAGE_HEIGHT } from "../constants/page";
import DemoBadge from "../components/DemoBadge";
import { ui } from "../styles/styles";
import html2canvas from "html2canvas";
import { getSong, DEMO_MODE } from "../api";
import jsPDF from "jspdf";

export default function StudioPage({ toggleFullscreen }) {
  const { id } = useParams();

  const [song, setSong] = useState(null);
  const [view, setView] = useState("description");
  const [zoom, setZoom] = useState(1);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1480);

  const previewRef = useRef(null);
  const printRef = useRef(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  const FIT_MARGIN = 32;
  const DEMO_SPACE = 40;

  // DATA
  useEffect(() => {
    getSong(id).then(setSong).catch(console.error);
  }, [id]);

  // RESPONSIVE
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1480);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // DEFAULT DESCRIPTION PAGE
  useEffect(() => {
    if (isDesktop && view === "preview") {
      setView("description");
    }
  }, [isDesktop, view]);

  // PRINT / PDF
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
      format: [PAGE_WIDTH, PAGE_HEIGHT],
    });

    pdf.addImage(imgData, "PNG", 0, 0, PAGE_WIDTH, PAGE_HEIGHT);

    pdf.save(`${song.artist} - ${song.title}.pdf`);
  };

  // ZOOM
  const fitWidth = () => {
    if (!previewRef.current) return;

    const container = previewRef.current;

    const availableWidth = container.clientWidth - FIT_MARGIN;

    setZoom(availableWidth / PAGE_WIDTH);
  };

  const fitHeight = () => {
    if (!previewRef.current) return;

    const container = previewRef.current;

    const styles = window.getComputedStyle(container);

    const paddingTop = parseFloat(styles.paddingTop) || 0;
    const paddingBottom = parseFloat(styles.paddingBottom) || 0;
    const demoSpace = DEMO_MODE ? DEMO_SPACE : 0;

    const availableHeight =
      container.clientHeight -
      paddingTop -
      paddingBottom -
      demoSpace -
      FIT_MARGIN;

    const newZoom = availableHeight / PAGE_HEIGHT;

    setZoom(newZoom);

    requestAnimationFrame(() => {
      const el = previewRef.current;

      if (!el) return;

      el.scrollTop = 0;
      el.scrollLeft = 0;
    });
  };

  // LOAD ON FITHEIGHT
  useEffect(() => {
    if (!isDesktop && view !== "preview") return;

    let frame1;
    let frame2;

    frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        fitHeight();
      });
    });

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [isDesktop, view]);

  // DRAG PREVIEW
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

  // ORDERED BLOCKS
  const orderedBlocks = useMemo(() => {
    return song?.progressions
      ?.flatMap((p) => p.lyricsBlocks || [])
      .filter((b) => b.progression_id)
      .sort((a, b) => a.position - b.position);
  }, [song]);

  // LOADING
  if (!song) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden relative max-[650px]:text-xs">
      {/*  HOME: Desktop only */}
      <div className="absolute left-8 top-1 z-60">
        {isDesktop && (
          <Link to="/dashboard" className={`${ui.button} w-12 h-12`}>
            <House size={18} className="group-hover:hidden" />
            <span className="hidden group-hover:block text-sm font-medium">
              Accueil
            </span>
          </Link>
        )}
      </div>
      {/* =========== NAVIGATION BAR ================== */}

      <nav className="h-14 border-b border-zinc-800 shrink-0 flex items-center justify-center z-50">
        <div className="flex items-center gap-3">
          {/* HOME: Mobile / Tablet only */}
          {!isDesktop && (
            <Link
              to="/dashboard"
              className={`${ui.button} w-12 h-12 max-[650px]:w-10 max-[650px]:h-10`}
            >
              <House size={18} />
            </Link>
          )}

          {/* DESCRIPSONG */}
          <button
            onClick={() => setView("description")}
            className={`${ui.buttonSm}
              px-4 py-2 rounded-xl cursor-pointer
              ${
                view === "description"
                  ? ""
                  : "bg-gradient-to-b from-zinc-500 to-zinc-800"
              }
            `}
          >
            Descripsong
          </button>

          {/* CHANSONG */}
          <button
            onClick={() => setView("lyrics")}
            className={`${ui.buttonSm}
              px-4 py-2 rounded-xl cursor-pointer
              ${
                view === "lyrics"
                  ? ""
                  : "bg-gradient-to-b from-zinc-500 to-zinc-800"
              }
            `}
          >
            Chansong
          </button>

          {/* PREVIEW: Mobile and Tablet */}
          {!isDesktop && (
            <button
              onClick={() => setView("preview")}
              className={`${ui.buttonSm}
                px-4 py-2 rounded-xl cursor-pointer
                ${
                  view === "preview"
                    ? ""
                    : "bg-gradient-to-b from-zinc-500 to-zinc-800"
                }
              `}
            >
              Aperçu
            </button>
          )}
        </div>
      </nav>

      {/* DEMO BADGE */}
      {DEMO_MODE && <DemoBadge />}

      <div className="flex-1 min-h-0">
        {/* ===========DESKTOP ================ */}

        {isDesktop ? (
          <div className="h-full flex">
            {/* EDITOR */}
            <div className="w-1/2 border-r border-zinc-800 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {view === "description" && (
                  <DescriptionPage
                    embedded
                    song={song}
                    setSong={setSong}
                    toggleFullscreen={toggleFullscreen}
                  />
                )}

                {view === "lyrics" && (
                  <LyricsPage
                    embedded
                    song={song}
                    setSong={setSong}
                    toggleFullscreen={toggleFullscreen}
                  />
                )}
              </div>
            </div>

            {/* PREVIEW */}
            <div className="w-1/2 h-full flex flex-col min-h-0">
              {/* PREVIEW CONTROLS */}
              <div className="h-14 shrink-0 flex items-center justify-center relative">
                <div className="flex items-center gap-3">
                  {/* FIT WIDTH */}
                  <button
                    onClick={fitWidth}
                    className={`${ui.buttonSm} px-4 py-2`}
                  >
                    <MoveHorizontal size={18} />
                  </button>

                  {/* ZOOM */}
                  <div className="flex flex-col items-center text-white">
                    <span className="text-sm w-12">
                      {Math.round(zoom * 100)}%
                    </span>

                    <input
                      type="range"
                      min={0.5}
                      max={2}
                      step={0.05}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-48 accent-purple-500 cursor-pointer"
                    />
                  </div>

                  {/* FIT HEIGHT */}
                  <button
                    onClick={fitHeight}
                    className={`${ui.buttonSm} px-4 py-2`}
                  >
                    <Maximize size={18} absoluteStrokeWidth />
                  </button>
                </div>

                {/* PDF */}
                <button
                  onClick={exportPDF}
                  className={`${ui.buttonSm} px-2 py-2 gap-1.5 text-sm absolute right-2`}
                >
                  <ExternalLink size={18} />
                  PDF
                </button>
              </div>

              {/* PREVIEW */}
              <div
                ref={previewRef}
                className="flex-1 min-h-0 overflow-auto cursor-grab select-none no-scrollbar"
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
        ) : (
          /* ===============MOBILE / TABLET================= */

          <div className="h-full">
            {/* DESCRIPTION */}
            {view === "description" && (
              <div className="h-full overflow-y-auto no-scrollbar">
                <DescriptionPage
                  embedded
                  song={song}
                  setSong={setSong}
                  toggleFullscreen={toggleFullscreen}
                />
              </div>
            )}

            {/* LYRICS */}
            {view === "lyrics" && (
              <div className="h-full overflow-y-auto no-scrollbar">
                <LyricsPage
                  embedded
                  song={song}
                  setSong={setSong}
                  toggleFullscreen={toggleFullscreen}
                />
              </div>
            )}

            {/* PREVIEW */}
            {view === "preview" && (
              <div className="h-full flex flex-col">
                {DEMO_MODE && (
                  <div
                    style={{
                      height: `${DEMO_SPACE}px`,
                      flexShrink: 0,
                    }}
                  />
                )}
                {/* PREVIEW */}
                <div
                  ref={previewRef}
                  className="flex-1 overflow-auto cursor-grab select-none no-scrollbar"
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

                {/* PREVIEW CONTROLS */}
                <div className="h-14 border-b border-zinc-800 shrink-0 flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    {/* FIT WIDTH */}
                    <button
                      onClick={fitWidth}
                      className={`${ui.buttonSm} px-4 py-2`}
                    >
                      <MoveHorizontal size={18} />
                    </button>

                    {/* ZOOM */}
                    <div className="flex flex-col items-center text-white">
                      <span className="text-sm w-12">
                        {Math.round(zoom * 100)}%
                      </span>

                      <input
                        type="range"
                        min={0.5}
                        max={2}
                        step={0.05}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-48 max-[650px]:w-34 accent-purple-500 cursor-pointer"
                      />
                    </div>

                    {/* FIT HEIGHT */}
                    <button
                      onClick={fitHeight}
                      className={`${ui.buttonSm} px-4 py-2`}
                    >
                      <Maximize size={18} absoluteStrokeWidth />
                    </button>

                    {/* PDF */}
                    <button
                      onClick={exportPDF}
                      className={`${ui.buttonSm} px-2 py-2 gap-1.5 text-sm`}
                    >
                      <ExternalLink size={18} />
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
