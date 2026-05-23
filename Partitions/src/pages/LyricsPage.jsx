import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Info,
  House,
  Music4,
  Trash2,
  NotebookText,
  Monitor,
} from "lucide-react";
import { styles, ui, themes } from "../styles/styles";

export default function LyricsPage(props) {
  const embedded = props.embedded ?? false;
  const [localSong, setLocalSong] = useState(null);
  const song = embedded ? props.song : localSong;
  const setSong = embedded ? props.setSong : setLocalSong;
  const { id } = useParams();

  useEffect(() => {
    if (embedded) return;

    fetch(`/api/songs/${id}`)
      .then((r) => r.json())
      .then(setLocalSong);
  }, [id, embedded]);

  // THEMES
  const themeMap = Object.fromEntries(themes.map((t) => [t.name, t]));

  function getTheme(name) {
    return themeMap[name] || themes[0];
  }

  // UPDATE BLOCK
  async function updateBlock(id, field, value) {
    await fetch(`/api/lyrics-blocks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });

    setSong((prev) => {
      const updated = structuredClone(prev);

      let found = null;

      for (const p of updated.progressions) {
        found = p.lyricsBlocks?.find((b) => b.id === id);
        if (found) break;
      }

      if (found) {
        found[field] = value;
      }

      return updated;
    });
  }

  // ADD BLOCK
  async function addBlock() {
    const response = await fetch(`/api/lyrics-blocks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        song_id: song.id,
        progression_id: song.progressions[0]?.id || null,
        content: "",
        show_chords: 0,
        position: song.progressions.flatMap((p) => p.lyricsBlocks || []).length,
        mb: 4,
      }),
    });

    const newBlock = await response.json();

    setSong((prev) => ({
      ...prev,
      progressions: prev.progressions.map((p) => {
        if (p.id === newBlock.progression_id) {
          return {
            ...p,
            lyricsBlocks: [...(p.lyricsBlocks || []), newBlock],
          };
        }

        return p;
      }),
    }));
  }

  // UPDATE LYRICS BLOCK
  function updateLyricsBlock(id, value) {
    fetch(`/api/lyrics-blocks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: song.title,
        artist: song.artist,
        capo: song.capo,
      }),
    });

    setSong((prev) => {
      const updated = structuredClone(prev);
      const b = updated.lyricsBlocks.find((x) => x.id === id);
      if (b) b.content = value;
      return updated;
    });
  }

  // DELETE BLOCK
  async function deleteBlock(id) {
    await fetch(`/api/lyrics-blocks/${id}`, {
      method: "DELETE",
    });

    setSong((prev) => ({
      ...prev,
      progressions: prev.progressions.map((p) => ({
        ...p,
        lyricsBlocks: (p.lyricsBlocks || []).filter((b) => b.id !== id),
      })),
    }));
  }

  if (!song) return <div>Loading...</div>;

  const blocks = song.progressions
    .flatMap((p) => p.lyricsBlocks || [])
    .sort((a, b) => a.position - b.position);

  //
  //
  //
  //
  //
  //
  // ----------------------CONTENT---------------------------------------------
  //
  //
  //
  //
  //
  //
  //

  return (
    <div className="mx-auto max-w-4xl rounded-xl p-10">
      {/* 1. ----------------------HEADER------------------------ */}
      <div className="flex items-center justify-between mb-8">
        {/* HOME BTN */}
        {!embedded && (
          <div className="flex">
            <Link to="/dashboard" className={`${ui.button} w-12 h-12`}>
              <House size={18} className="group-hover:hidden" />
              <span className="hidden group-hover:block text-sm font-medium">
                Accueil
              </span>
            </Link>
          </div>
        )}
        {/* PAGE TITLE */}
        <div className="flex flex-row justify-center mx-auto">
          <h2 className={`${styles.h2}`}>Chan</h2>
          <h2 className={`${styles.h2} !font-thin`}>Song</h2>
        </div>
        {!embedded && (
          <div className="flex justify-end gap-4">
            {/* LYRICS BTN */}
            <Link
              to={`/lyrics/${song.id}`}
              className={`${ui.button} w-12 h-12`}
            >
              <NotebookText size={18} className="group-hover:hidden" />
              <span className="hidden group-hover:block text-sm font-medium">
                Chansong
              </span>
            </Link>

            {/* PRINT PAGE BTN*/}
            <a
              href={`/print/${song.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ui.button} w-12 h-12`}
            >
              <Monitor className="group-hover:hidden"></Monitor>
              <span className="hidden group-hover:block text-sm font-medium">
                Edition
              </span>
            </a>
          </div>
        )}
      </div>

      {/* 2. ----------------------BLOCK LIST------------------------ */}
      <div className="space-y-6">
        {blocks.map((block) => {
          const progression = song.progressions.find(
            (p) => p.id === block.progression_id,
          );

          const theme = getTheme(progression?.theme);

          return (
            <div key={block.id} className={`${ui.section} space-y-4 `}>
              {/* Block progression */}
              <div className="flex justify-between items-center">
                {/* POSITION */}
                <div
                  className={`${styles.index} ${theme.badgeColor} select-none px-2`}
                >
                  #{block.position}
                </div>

                {/* NOM PROGRESSION */}
                <select
                  value={block.progression_id}
                  onChange={(e) =>
                    updateBlock(
                      block.id,
                      "progression_id",
                      Number(e.target.value),
                    )
                  }
                  className={`${ui.input} !w-20`}
                >
                  {song.progressions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>

                {/* NOM BADGE */}
                <select
                  value={block.display_label || "short"}
                  onChange={(e) =>
                    updateBlock(block.id, "display_label", e.target.value)
                  }
                  className={`${ui.input} !w-32`}
                >
                  <option value="short">
                    {progression.label?.charAt(0)}
                    {progression.position}
                  </option>

                  <option value="full">{progression.label}</option>
                </select>

                {/* MARGIN BOTTOM */}
                <div className="flex items-center gap-2 text-white">
                  <label>mb :</label>

                  <input
                    type="number"
                    min="0"
                    value={block.mb ?? 4}
                    onChange={(e) =>
                      updateBlock(block.id, "mb", Number(e.target.value))
                    }
                    className={`${ui.input} !w-12 text-black`}
                  />
                </div>

                {/* SHOW CHORDS */}
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={Boolean(Number(block.show_chords))}
                    onChange={(e) =>
                      updateBlock(
                        block.id,
                        "show_chords",
                        e.target.checked ? 1 : 0,
                      )
                    }
                  />
                  Afficher les accords
                </label>

                {/* DELETE BUTTON */}
                <div className="my-auto">
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className={`${ui.buttonSm} w-6 h-6 bg-red-700 hover:bg-red-600`}
                  >
                    <span className="group-hover:hidden">✕</span>
                    <Trash2 size={18} className="hidden group-hover:block" />
                  </button>
                </div>
              </div>

              {/* LYRICS */}
              <textarea
                ref={(el) => {
                  if (el) {
                    el.style.height = "0px";
                    el.style.height = el.scrollHeight + "px";
                  }
                }}
                value={block.content}
                onChange={(e) => {
                  const value = e.target.value;

                  // auto resize while typing
                  e.target.style.height = "0px";
                  e.target.style.height = e.target.scrollHeight + "px";

                  setSong((prev) => {
                    const updated = structuredClone(prev);

                    updated.progressions.forEach((p) => {
                      p.lyricsBlocks?.forEach((b) => {
                        if (b.id === block.id) {
                          b.content = value;
                        }
                      });
                    });

                    return updated;
                  });
                }}
                onBlur={(e) => {
                  fetch(`/api/lyrics-blocks/${block.id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      content: e.target.value,
                    }),
                  });
                }}
                className={`${ui.input} overflow-hidden resize-none`}
                rows={1}
              />
            </div>
          );
        })}

        {/* ADD BLOCK */}
        <div className="flex justify-center">
          <button
            onClick={addBlock}
            className={`${ui.button} w-80 py-2 px-6 m-8 hover:!w-80`}
          >
            + Ajouter un block
          </button>
        </div>
      </div>
    </div>
  );
}
