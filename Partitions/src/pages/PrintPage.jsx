import Header from "../components/Header";
import LyricsBlock from "../components/LyricsBlock";
import { forwardRef } from "react";

const PrintPage = forwardRef(({ song, zoom = 1 }, ref) => {
  if (!song) return null;

  const orderedBlocks = song.progressions
    ?.flatMap((p) => p.lyricsBlocks || [])
    .filter((b) => b.progression_id)
    .sort((a, b) => a.position - b.position);

  return (
    <div
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
      }}
    >
      <div className="flex justify-center">
        <div
          ref={ref}
          className="w-[794px] min-h-[1123px] bg-white border p-6 overflow-hidden"
        >
          <Header song={song} />

          <div
            className="mt-8"
            style={{
              columnCount: 2,
              columnGap: "5px",
            }}
          >
            {orderedBlocks?.map((block) => {
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
    </div>
  );
});

export default PrintPage;
