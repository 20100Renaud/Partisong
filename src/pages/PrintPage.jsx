import Header from "../components/Header";
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
        className="bg-white border p-6 overflow-hidden"
        style={{
          width: `${PAGE_WIDTH}px`,
          minHeight: `${PAGE_HEIGHT}px`,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
      >
        <Header song={song} />

        <div
          className="mt-8"
          style={{
            columnCount: 2,
            columnGap: "5px",
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
