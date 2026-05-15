import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import LyricsBlock from "../components/LyricsBlock";

export default function PrintPage() {
  const [song, setSong] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/songs/${id}`)
      .then((r) => r.json())
      .then(setSong);
  }, [id]);

  if (!song) {
    return <div>Loading...</div>;
  }

  const orderedBlocks = song.progressions
    .flatMap((p) => p.lyricsBlocks || [])
    .filter((b) => b.progression_id)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">
      <div className="w-[794px] min-h-[1123px] bg-white border p-10 overflow-hidden">
        {/* Header */}
        <Header song={song} />

        {/* Blocks */}
        <div className="mt-10 space-y-6">
          {orderedBlocks.map((block) => {
            const progression = song.progressions.find(
              (p) => p.id === block.progression_id,
            );

            if (!progression) return null;

            return (
              <LyricsBlock
                key={block.id}
                progression={progression}
                block={block}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
