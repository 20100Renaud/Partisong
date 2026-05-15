import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Save, House, NotebookText, Eye, Monitor, ScanEye } from "lucide-react";
import { styles, ui } from "../styles/styles";

export default function DescriptionPage() {
  const [song, setSong] = useState(null);
  const [toasts, setToasts] = useState([]);

  function addToast(message, type = "info", duration = 2000) {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }

  const { id } = useParams();

  const groove = song?.groove || {
    beats: [],
    pattern: [],
    strumming: [],
  };

  useEffect(() => {
    fetch(`/api/songs/${id}`)
      .then((r) => r.json())
      .then(setSong);
  }, []);

  // UPDATE PROGRESSION
  function updateProgression(id, field, value) {
    setSong((prev) => {
      const updated = structuredClone(prev);
      const p = updated.progressions.find((x) => x.id === id);
      if (p) p[field] = value;
      return updated;
    });

    fetch(`/api/progressions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  }

  // UPDATE CHORD
  function updateChord(progressionId, chordId, value) {
    console.log("UPDATE CHORD:", { progressionId, chordId, value });
    setSong((prev) => {
      const updated = structuredClone(prev);
      const prog = updated.progressions.find((p) => p.id === progressionId);
      if (!prog) return prev;

      const chord = prog.chords.find((c) => c.id === chordId);
      console.log("BEFORE:", chord);
      if (chord) chord.value = value;
      console.log("AFTER:", chord);
      return updated;
    });

    fetch(`/api/chords/${chordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
  }

  // ADD PROGRESSION
  async function addProgression() {
    const res = await fetch(`/api/progressions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        song_id: song.id,
        label: "New",
        position: song.progressions.length, // want length/2
        textColor: "text-black",
        borderColor: "border-zinc-400",
        bgColor: "bg-zinc-200/10",
        badgeColor: "bg-zinc-400",
        chordCount: song.groove?.beats?.length || 8,
      }),
    });

    const newProg = await res.json();

    setSong((prev) => ({
      ...prev,
      progressions: [
        ...prev.progressions,
        {
          ...newProg,
          chords: newProg.chords,
        },
      ],
    }));
  }

  useEffect(() => {
    if (!song) return;

    console.log("PROGRESSIONS:", song.progressions);
    console.log("FIRST CHORD:", song.progressions?.[0]?.chords?.[0]);
  }, [song]);
  
  // SET BEATS
  function setBeats(n) {
    const beats = Array.from({ length: n }, (_, i) => (i + 1).toString());

    setSong({
      ...song,
      groove: {
        ...song.groove,
        beats,
        accents: Array(n).fill(""),
        strumming: Array(n).fill("↓"),
      },
    });
  }

  // UPDATE GROOVE PATTERN
  function updatePattern(index, value) {
    const updated = structuredClone(song);
    updated.groove.pattern[index] = value;
    setSong(updated);
  }

  // UPDATE GROOVE STRUMMING
  function updateStrum(index, value) {
    const updated = structuredClone(song);
    updated.groove.strumming[index] = value;
    setSong(updated);
  }

  // UPDATE LYRICS
  function updateLyrics(index, value) {
    const updated = structuredClone(song);

    updated.progressions[index].lyrics = value;

    setSong(updated);
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

  // SAVE SONG
  async function saveSong() {
    const response = await fetch(`/api/songs/${song.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: song.title,
        artist: song.artist,
        capo: song.capo,
      }),
    });

    return response.json();
  }

  async function handleSave() {
    addToast("Saving...", "loading", 1500);

    try {
      await saveSong();

      addToast("✓ Saved successfully", "success", 2000);
    } catch (err) {
      addToast("Something went wrong", "error", 2000);
    }
  }

  const fields = [
    { key: "textColor", label: "Texte" },
    { key: "borderColor", label: "Bordure" },
    { key: "bgColor", label: "Fond" },
    { key: "badgeColor", label: "Badge" },
  ];

  if (!song) return <div>Loading...</div>;

  return (
    <div className="bg-gradient-to-tr from-purple-900 to-pink-900 py-10">
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

      <div className="mx-auto max-w-5xl bg-black rounded-xl p-10">
        <div className="flex items-center justify-between mb-8">
          {/* Dashboard header*/}
          <div className="w-20 flex">
            <Link to="/dashboard" className={`${ui.button} w-12 h-12`}>
              <House size={18} className="group-hover:hidden" />
              <span className="hidden group-hover:block text-sm font-medium">
                Accueil
              </span>
            </Link>
          </div>

          <h1 className={`${styles.h1} flex-1`}>Description</h1>

          <div className="w-20 flex justify-end">
            <Link
              to={`/lyrics/${song.id}`}
              className={`${ui.button} w-12 h-12`}
            >
              <NotebookText size={18} className="group-hover:hidden" />
              <span className="hidden group-hover:block text-sm font-medium">
                Paroles
              </span>
            </Link>
          </div>
        </div>

        {/* 1. SONG */}
        <h2 className={styles.h2}>Chanson</h2>
        <section className={`${ui.section} flex`}>
          {/* 1.1 SONG COL 1 */}
          <div className="flex-1">
            {/* 1.1.1 Title */}
            <div className={ui.subSection}>
              <h3 className={styles.h3}>Titre</h3>
              <input
                value={song.title}
                onChange={(e) =>
                  setSong({
                    ...song,
                    title: e.target.value,
                  })
                }
                className={ui.input}
              />
            </div>

            {/* 1.1.2 Artist */}
            <div className={ui.subSection}>
              <h3 className={styles.h3}>Artiste</h3>
              <input
                value={song.artist}
                onChange={(e) =>
                  setSong({
                    ...song,
                    artist: e.target.value,
                  })
                }
                className={ui.input}
              />
            </div>
          </div>

          {/* 1.3 SONG COL 2 */}
          <div className="w-15">
            {/* GROOVE */}
            <div className={ui.subSection}>
              <h3 className={styles.h3}>Groove</h3>
              <input
                type="number"
                min="4"
                max="8"
                value={song.groove?.beats?.length || 8}
                onChange={(e) => setBeats(Number(e.target.value))}
                className={ui.input}
              />
            </div>

            {/* CAPO */}
            <div className={ui.subSection}>
              <h3 className={styles.h3}>Capo</h3>
              <input
                type="number"
                value={song.capo}
                onChange={(e) =>
                  setSong({
                    ...song,
                    capo: Number(e.target.value),
                  })
                }
                className={ui.input}
              />
            </div>
          </div>

          {/* 1.2 SONG COL 3 */}
          <div className="flex flex-col w-80">
            {/* PATTERN */}
            <div className={ui.subSection}>
              <h3 className={styles.h3}>Pattern</h3>
              <div className={ui.grid}>
                {song.groove.beats.map((beat, i) => (
                  <input
                    key={i}
                    value={song.groove.pattern[i]}
                    onChange={(e) => updatePattern(i, e.target.value)}
                    className={ui.item}
                  />
                ))}
              </div>
            </div>

            {/* STRUMMING */}
            <div className={ui.subSection}>
              <h3 className={styles.h3}>Rythmique</h3>
              <div className={ui.grid}>
                {song.groove.beats.map((beat, i) => (
                  <input
                    key={i}
                    value={song.groove.strumming[i]}
                    onChange={(e) => updateStrum(i, e.target.value)}
                    className={ui.item}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. PROGRESSIONS */}
        <h2 className={styles.h2}>Progression</h2>
        <section className={`${ui.section}`}>
          {song.progressions.map((progression, progIndex) => (
            <div
              key={progIndex}
              className={`${ui.subSection} border border-purple-900 shadow-lg shadow-purple-900 rounded-2xl m-6 p-2`}
            >
              {/* 2.1 Row 1 */}
              <div className="flex gap-2">
                {/* 2.1.1 Position */}
                <div className={`${styles.index} px-2 mr-13`}>#{progIndex}</div>

                {/* 2.2.2 Details */}
                <div>
                  <div className="flex">
                    {/* LABEL */}
                    <div className={`${ui.subSection} w-20`}>
                      <h3 className={`${styles.h3}`}>Type</h3>
                      <input
                        value={progression.label}
                        onChange={(e) =>
                          updateProgression(
                            progression.id,
                            "label",
                            e.target.value,
                          )
                        }
                        className={`${ui.input}`}
                      />
                    </div>
                  </div>
                </div>

                {/* CHORDS */}
                <div className={`${ui.subSection}`}>
                  <h3 className={`${styles.h3} w-50`}>Accords</h3>
                  <div className={ui.grid}>
                    {progression.chords.map((chord) => (
                      <input
                        key={chord.id}
                        value={chord.value}
                        onChange={(e) =>
                          updateChord(progression.id, chord.id, e.target.value)
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <div className="group flex flex-1 justify-end w-10">
                  <button
                    onClick={handleSave}
                    className={`${ui.button} w-8 h-8 hover:!w-8`}
                  >
                    <Save size={18} />
                  </button>
                </div>
              </div>

              {/* 2.2 Row 2 */}
              <div className="flex gap-2">
                {/* Colors */}
                <h3 className={`${styles.h3} flex w-25 items-center mt-6`}>
                  Couleurs :
                </h3>
                <div className={`${ui.subSection} w-180 flex`}>
                  {fields.map(({ key, label }) => (
                    <div key={key} className="flex flex-col">
                      <h3 className={styles.h3}>{label}</h3>
                      <input
                        value={progression[key]}
                        onChange={(e) =>
                          updateProgression(progIndex, key, e.target.value)
                        }
                        className={ui.input}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Add progression */}
        <div className="flex justify-center">
          <button
            onClick={addProgression}
            className={`${ui.button} w-80 py-2 px-6 mt-8 hover:!w-80`}
          >
            + Ajouter une progression
          </button>
        </div>
      </div>
    </div>
  );
}
