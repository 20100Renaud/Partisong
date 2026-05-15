import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Info, House } from "lucide-react";
import { styles, ui } from "../styles/styles";

export default function LyricsPage() {
  const [song, setSong] = useState(null);
  const [toasts, setToasts] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/songs/${id}`)
      .then((r) => r.json())
      .then(setSong);
  }, [id]);


  // TOAST
  function addToast(message, type = "info", duration = 2000) {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
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

  if (!song) return <div>Loading...</div>;

  const blocks = song.progressions
    .flatMap((p) => p.lyricsBlocks || [])
    .sort((a, b) => a.position - b.position);

  return (
    <div className="bg-gradient-to-tr from-purple-900 to-pink-900 py-10">
      {/* ---------------- TOAST STACK ---------------- */}
      <div className="fixed top-6 right-6 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-4 py-2 rounded-xl shadow-lg text-white
              transition-all
              ${
                toast.type === "loading"
                  ? "bg-yellow-500"
                  : toast.type === "success"
                    ? "bg-green-600"
                    : "bg-red-600"
              }
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* ---------------- MAIN CONTAINER ---------------- */}
      <div className="mx-auto max-w-5xl bg-black rounded-xl p-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-20 flex">
            <Link to="/dashboard" className={`${ui.button} w-12 h-12`}>
              <House size={18} className="group-hover:hidden" />
              <span className="hidden group-hover:block text-sm font-medium">
                Accueil
              </span>
            </Link>
          </div>

          <h1 className={`${styles.h1} flex-1`}>Paroles</h1>

          <div className="w-20 flex justify-end">
            <Link
              to={`/description/${song.id}`}
              className={`${ui.button} w-12 h-12`}
            >
              <Info size={18} className="group-hover:hidden" />
              <span className="hidden group-hover:block text-sm font-medium">
                Infos
              </span>
            </Link>
          </div>
        </div>

        {/* BLOCK LIST */}
        <div className="space-y-6">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="border border-purple-900 rounded-xl p-4 space-y-3"
            >
              {/* PROGRESSION */}
              <select
                value={block.progression_id}
                onChange={(e) =>
                  updateBlock(
                    block.id,
                    "progression_id",
                    Number(e.target.value),
                  )
                }
                className={ui.input}
              >
                {song.progressions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>

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

              {/* TEXT */}
              <textarea
                value={block.content}
                onChange={(e) =>
                  updateBlock(block.id, "content", e.target.value)
                }
                className={ui.input}
              />

              <div className="text-xs text-gray-400">
                position: {block.position}
              </div>
            </div>
          ))}
        </div>

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
