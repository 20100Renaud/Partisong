import PrintPage_Header from "../components/PrintPage_Header";
import LyricsBlock from "../components/LyricsBlock";
import { PAGE_WIDTH, PAGE_HEIGHT } from "../constants/page";
import { forwardRef } from "react";

const PrintPage = forwardRef(({ song, orderedBlocks = [], zoom = 1 }, ref) => {
  if (!song) return null;

  return (
    <div
      style={{
        width: `${PAGE_WIDTH * zoom}px`,
        height: `${PAGE_HEIGHT * zoom}px`,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        ref={ref}
        className="bg-white border p-6 overflow-hidden flex flex-col"
        style={{
          width: `${PAGE_WIDTH}px`,
          height: `${PAGE_HEIGHT}px`,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
      >
        <PrintPage_Header song={song} />

        <div
          className="mt-8 flex-1 min-h-0"
          style={{
            columnCount: 2,
            columnGap: "5px",
            columnFill: "auto",
          }}
        >
          {orderedBlocks.map((block) => {
            const progression = song.progressions.find(
              (p) => p.id === block.progression_id,
            );

            if (!progression) return null;

            return (
              <div
                key={block.id}
                className="break-inside-avoid mb-4"
                style={{
                  marginBottom: `${(block.mb ?? 4) * 4}px`,
                }}
              >
                <LyricsBlock progression={progression} block={block} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

PrintPage.displayName = "PrintPage";

export default PrintPage;
