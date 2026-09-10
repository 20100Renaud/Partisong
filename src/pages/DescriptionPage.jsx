import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { styles, ui, themes } from "../styles/styles";
import { ConfirmModal } from "../components/Modal";
import { getSong, DEMO_MODE } from "../api";

export default function DescriptionPage(props) {
  const [animatingId, setAnimatingId] = useState(null);
  const embedded = props.embedded ?? false;
  const [localSong, setLocalSong] = useState(null);
  const setSong = embedded ? props.setSong : setLocalSong;
  const { id } = useParams();
  const toggleFullscreen = props.toggleFullscreen;
  const song = embedded ? props.song : localSong;
  const [openThemeId, setOpenThemeId] = useState(null);

  const [confirmState, setConfirmState] = useState({
    open: false,
    progressionId: null,
  });

  useEffect(() => {
    if (embedded) return;

    getSong(id).then(setLocalSong).catch(console.error);
  }, [id, embedded]);

  const groove = song?.groove || {
    beats: [],
    pattern: [],
    strumming: [],
  };

  // THEMES
  const themeMap = Object.fromEntries(themes.map((t) => [t.name, t]));

  function getTheme(name) {
    return themeMap[name] || themes[0];
  }

  useEffect(() => {
    function handleClick() {
      setOpenThemeId(null);
    }

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  // UPDATE PROGRESSION
  function updateProgression(id, field, value) {
    setSong((prev) => {
      const updated = structuredClone(prev);
      const p = updated.progressions.find((x) => x.id === id);
      if (p) p[field] = value;
      return updated;
    });

    if (DEMO_MODE) return;

    fetch(`/api/progressions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  }

  // UPDATE CHORD
  function updateChord(progressionId, chordId, value) {
    setSong((prev) => {
      const updated = structuredClone(prev);
      const prog = updated.progressions.find((p) => p.id === progressionId);
      if (!prog) return prev;

      const chord = prog.chords.find((c) => c.id === chordId);
      if (chord) chord.value = value;
      return updated;
    });

    if (DEMO_MODE) return;

    fetch(`/api/chords/${chordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
  }

  // ADD PROGRESSION
  async function addProgression() {
    if (DEMO_MODE) return;

    const res = await fetch(`/api/progressions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        song_id: song.id,
        label: "Nom",
        position: song.progressions?.length ?? 0,
        theme: "red",
        chordCount: Math.floor((song.groove?.beats?.length ?? 8) / 2),
      }),
    });

    const newProg = await res.json();

    setSong((prev) => ({
      ...prev,
      progressions: [
        ...(prev.progressions ?? []),
        {
          ...newProg,
          chords: newProg.chords ?? [],
        },
      ],
    }));
  }

  useEffect(() => {
    if (!song) return;
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

  // UPDATE PATTERN
  function updatePattern(index, value) {
    const updated = structuredClone(song);
    updated.groove.pattern[index] = value;
    setSong(updated);
  }

  // UPDATE STRUMMING
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

  // DELETE SONG
  async function deleteProgression(id) {
    if (DEMO_MODE) return;

    await fetch(`/api/progressions/${id}`, {
      method: "DELETE",
    });

    setSong((prev) => ({
      ...prev,
      progressions: prev.progressions.filter((p) => p.id !== id),
    }));
  }

  function requestDeleteProgression(progressionId) {
    setConfirmState({
      open: true,
      progressionId,
    });
  }

  async function handleConfirmDelete() {
    await deleteProgression(confirmState.progressionId);

    setConfirmState({
      open: false,
      progressionId: null,
    });
  }

  function handleCancelDelete() {
    setConfirmState({
      open: false,
      progressionId: null,
    });
  }

  if (!song) return <div>Loading...</div>;

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
    <div className="mx-auto max-w-2xl rounded-xl p-10 max-[650px]:p-4">
      {/* 1. ----------------------HEADER------------------------ */}
      <div className="flex flex-col items-center justify-between mb-8">
        {/* PAGE TITLE */}
        <div
          onClick={toggleFullscreen}
          className="flex flex-row justify-center mx-auto cursor-pointer hover:opacity-80 transition"
        >
          <h2 className={`${styles.h2}`}>Descrip</h2>
          <h2 className={`${styles.h2} !font-thin`}>Song</h2>
        </div>
        <div>
          <h3 className={`${styles.h3} !font-thin`}>
            Structure et pattern de la chanson
          </h3>
        </div>
      </div>

      {/* ----------------------SONG------------------------ */}
      <section
        className={`${ui.section} flex max-[640px]:flex-col gap-4 max-[640px]:gap-0 w-full`}
      >
        {/* COL 1: Title + Artist*/}
        <div className="max-[640px]:flex gap-4">
          {/* Title */}
          <div className="mb-2">
            <h3 className={styles.h3}>Titre</h3>
            <input
              readOnly={DEMO_MODE}
              value={song.title}
              onChange={(e) =>
                setSong({
                  ...song,
                  title: e.target.value,
                })
              }
              className={`${ui.input} ${
                DEMO_MODE ? "cursor-default opacity-80" : ""
              }`}
            />
          </div>

          {/* Artist */}
          <div className="">
            <h3 className={styles.h3}>Artiste</h3>
            <input
              readOnly={DEMO_MODE}
              value={song.artist}
              onChange={(e) =>
                setSong({
                  ...song,
                  artist: e.target.value,
                })
              }
              className={`${ui.input} ${
                DEMO_MODE ? "cursor-default opacity-80" : ""
              }`}
            />
          </div>
        </div>

        {/* COL 2 [Groove + Capo] + [Patterne + Strumming] */}
        <div className="flex gap-4 justify-between">
          {/* [Groove + Capo] */}
          <div className="w-15">
            {/* Groove */}
            <div className="mb-2">
              <h3 className={styles.h3}>Groove</h3>
              <input
                readOnly={DEMO_MODE}
                type="number"
                min="4"
                max="8"
                value={song.groove?.beats?.length || 8}
                onChange={(e) => setBeats(Number(e.target.value))}
                className={`${ui.input} ${
                  DEMO_MODE ? "cursor-default opacity-80" : ""
                }`}
              />
            </div>
            {/* Capo */}
            <div className="">
              <h3 className={styles.h3}>Capo</h3>
              <input
                readOnly={DEMO_MODE}
                type="number"
                value={song.capo}
                onChange={(e) =>
                  setSong({
                    ...song,
                    capo: Number(e.target.value),
                  })
                }
                className={`${ui.input} ${
                  DEMO_MODE ? "cursor-default opacity-80" : ""
                }`}
              />
            </div>
          </div>

          {/* [Patterne + Strumming] */}
          <div className="">
            {/* Pattern */}
            <div className="mb-2">
              <h3 className={styles.h3}>Pattern</h3>
              <div className={`${ui.grid} w-max`}>
                {song.groove.beats.map((beat, i) => (
                  <input
                    readOnly={DEMO_MODE}
                    key={i}
                    value={song.groove.pattern[i]}
                    onChange={(e) => updatePattern(i, e.target.value)}
                    className={`${ui.item} ${i === song.groove.beats.length - 1 ? "border-r-0" : ""}`}
                  />
                ))}
              </div>
            </div>

            {/* Strumming */}
            <div className="">
              <h3 className={styles.h3}>Rythmique</h3>
              <div className={`${ui.grid} w-max`}>
                {song.groove.beats.map((beat, i) => (
                  <input
                    readOnly={DEMO_MODE}
                    key={i}
                    value={song.groove.strumming[i]}
                    onChange={(e) => updateStrum(i, e.target.value)}
                    className={`${ui.item} ${i === song.groove.beats.length - 1 ? "border-r-0" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ------------PROGRESSIONS ------------*/}

      <section className={`${ui.section} space-y-4 mt-6 mx-auto shadow-xl`}>
        {song.progressions.map((progression, progIndex) => {
          const theme = getTheme(progression.theme);
          const isOpen = openThemeId === progression.id;

          return (
            <div
              key={progIndex}
              className={`border rounded-2xl p-2 flex ${theme.borderColor} ${theme.bgColorDescription}`}
            >
              <div className="flex flex-1 items-stretch justify-between w-full">
                {/* COL.1: BADGE + PROGRESSION NAME */}
                <div className="relative flex items-stretch gap-4 max-[650px]:gap-1">
                  {/* Badge: Open btn */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      const isOpen = openThemeId === progression.id;
                      setOpenThemeId(isOpen ? null : progression.id);

                      if (!isOpen) {
                        setAnimatingId(progression.id);
                        setTimeout(() => {
                          setAnimatingId(null);
                        }, 200);
                      }
                    }}
                    className={`

                        ${theme.badgeColor}
                        min-w-6 max-[650px]:min-w-4 cursor-pointer
                        rounded-l-xl rounded-br-xl
                      `}
                  ></button>

                  {/* Popover */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`
                              absolute z-50 p-2
                              top-1/2 -translate-y-1/2 -left-2
                              rounded-2xl border border-zinc-700
                              bg-zinc-900 shadow-2xl
                              origin-left
                              will-change-transform
                              transition-all duration-500
                              ease-[cubic-bezier(0.4,1.4,0.64,1)]
                              ${
                                isOpen
                                  ? "opacity-100 scale-x-100 scale-y-100\
                                    translate-x-0 pointer-events-auto"
                                  : "opacity-0 scale-x-0 scale-y-95\
                                    -translate-x-2 pointer-events-none select-none"
                              }
                            `}
                  >
                    {/* Colors */}
                    <div className="flex gap-3">
                      {themes.map((t) => (
                        <button
                          key={t.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateProgression(progression.id, "theme", t.name);
                            setOpenThemeId(null);
                          }}
                          className={`
                                    relative cursor-pointer
                                    w-6 h-6 max-[650px]:h-4 max-[650px]:w-4 rounded-l-xl rounded-br-xl
                                    border-2
                                    transition duration-150
                                    hover:scale-110
                                    ${t.borderColor}
                                    ${t.bgColor}

                                  `}
                        >
                          {/* Active indicator */}
                          {progression.theme === t.name && (
                            <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                              ✓
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PROGRESSION NAME */}

                  <input
                    value={progression.label}
                    onChange={(e) =>
                      updateProgression(progression.id, "label", e.target.value)
                    }
                    className={`${ui.input} !w-24 max-[650px]:!w-18 `}
                  />
                </div>

                {/* CHORDS */}
                <div className={`${ui.grid} inline-flex`}>
                  {progression.chords.map((chord) => (
                    <input
                      key={chord.id}
                      value={chord.value}
                      onChange={(e) =>
                        updateChord(progression.id, chord.id, e.target.value)
                      }
                      className={`${ui.item} !w-14 max-[650px]:!w-10`}
                    />
                  ))}
                </div>

                {/* COL.2: DELETE BUTTON */}
                <div className="flex text-purple-500">
                  <button
                    title="Supprimer la progression définitivement"
                    onClick={() => requestDeleteProgression(progression.id)}
                    className="hover:text-red-500 leading-none"
                  >
                    <Trash2 size={18} className="cursor-pointer" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Add progression */}
      <div className="flex justify-center">
        <button
          onClick={addProgression}
          className={`${ui.button} py-2 px-6 m-8`}
        >
          + Ajouter une progression
        </button>
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        open={confirmState.open}
        title="Attention"
        message="Supprimer cette progression définitivement?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
