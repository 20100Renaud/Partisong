import { useEffect, useState } from "react";
import { styles, ui } from "../styles/styles";
import { DEMO_MODE } from "../api";

export default function DescriptionPage_Header({
  song,
  toggleFullscreen,
  setSong,
  setBeats,
  updatePattern,
  updateStrum,
}) {
  const [capoInput, setCapoInput] = useState(String(song.capo ?? ""));
  const grooveItemWidth = song.groove.beats.length === 4 ? "w-10" : "w-5";
  const getGrooveItemClass = (index) =>
    `${ui.item} ${grooveItemWidth} ${
      index === song.groove.beats.length - 1 ? "border-r-0" : ""
    }`;

  // INITIATE CAPO
  useEffect(() => {
    setCapoInput(String(song.capo ?? ""));
  }, [song.capo]);

  // UPDATE SONG
  async function updateSong(field, value) {
    setSong((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (DEMO_MODE) return;

    try {
      const res = await fetch(`/api/songs/${song.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [field]: value,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (error) {
      console.error(`Failed to update song ${field}:`, error);
    }
  }

  // SWITCH GROOVE STYLE
  const getGrooveToggleClass = (value, index) => {
    const active = song.groove?.beats?.length === value;

    return `
    ${ui.input}
    !rounded-none
    transition
    ${index === 0 ? "!rounded-tl-lg !rounded-br-lg" : ""}
    ${index === 1 ? "!rounded-tr-lg !rounded-bl-lg" : ""}
    ${
      active
        ? "bg-purple-600 text-white border-purple-500"
        : "bg-purple-300 text-black/60 hover:opacity-100 cursor-pointer"
    }
  `;
  };

  return (
    <>
      {/* PAGE HEADER */}
      <div className="flex flex-col items-center justify-between mb-8">
        <div
          onClick={toggleFullscreen}
          className="flex flex-row justify-center mx-auto cursor-pointer hover:opacity-80 transition"
        >
          <h2 className={styles.h2}>Descrip</h2>
          <h2 className={`${styles.h2} !font-thin`}>Song</h2>
        </div>

        <div>
          <h3 className={`${styles.h3} !font-thin`}>
            Structure et pattern de la chanson
          </h3>
        </div>
      </div>

      {/* SONG DESCRIPTION */}
      <section
        className={`${ui.section} flex max-[650px]:flex-col gap-4 max-[650px]:gap-0 w-full justify-center`}
      >
        {/* COL 1: TITLE + ARTIST */}
        <div className="flex flex-col max-[650px]:flex-row gap-2 justify-center">
          {/* TITLE */}
          <div>
            <h3 className={styles.h3}>Titre</h3>

            <input

              value={song.title}
              onChange={(e) => updateSong("title", e.target.value)}
              className={`${ui.input} !w-40 ${
                DEMO_MODE ? "cursor-default opacity-80" : ""
              }`}
            />
          </div>

          {/* ARTIST */}
          <div>
            <h3 className={styles.h3}>Artiste</h3>

            <input

              value={song.artist}
              onChange={(e) => updateSong("artist", e.target.value)}
              className={`${ui.input} !w-40 ${
                DEMO_MODE ? "cursor-default opacity-80" : ""
              }`}
            />
          </div>
        </div>

        {/* COL 2: [GROOVE + CAPO] + [PATTERN + STRUMMING] */}
        <div className="flex gap-4 justify-between">
          {/* CAPO + GROOVE */}
          <div className="flex flex-col max-[650px]:flex-row gap-2 items-center justify-between flex-1">
            {/* CAPO */}
            <div className="w-8">
              <h3 className={`${styles.h3} !pl-0 text-center`}>Capo</h3>

              <input

                type="number"
                min="0"
                value={capoInput}
                onChange={(e) => {
                  const value = e.target.value;

                  setCapoInput(value);

                  if (value === "") return;

                  const numberValue = Number(value);

                  if (Number.isFinite(numberValue) && numberValue >= 0) {
                    updateSong("capo", numberValue);
                  }
                }}
                onBlur={() => {
                  if (capoInput === "") {
                    setCapoInput(String(song.capo ?? 0));
                  }
                }}
                className={`${ui.input} text-center ${
                  DEMO_MODE ? "cursor-default opacity-80" : ""
                }`}
              />
            </div>

            {/* GROOVE */}
            <div className="w-15 max-[650px]:w-12">
              <h3 className={`${styles.h3} !pl-0 text-center`}>Groove</h3>

              <div className="flex">
                {[4, 8].map((value, index) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setBeats(value)}
                    className={getGrooveToggleClass(value, index)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PATTERN + STRUMMING */}
          <div className="flex flex-col gap-2">
            {/* PATTERN */}
            <div>
              <h3 className={styles.h3}>Pattern</h3>
              <div className={`${ui.input} !px-0`}>
                {song.groove.beats.map((beat, i) => (
                  <input
                    key={i}
                    value={song.groove.pattern[i]}
                    onChange={(e) => updatePattern(i, e.target.value)}
                    className={getGrooveItemClass(i)}
                  />
                ))}
              </div>
            </div>

            {/* STRUMMING */}
            <div className="max-[650px]:hidden">
              <h3 className={styles.h3}>Rythmique</h3>
              <div className={`${ui.input} !px-0`}>
                {song.groove.beats.map((beat, i) => (
                  <input
                    key={i}
                    value={song.groove.strumming[i]}
                    onChange={(e) => updateStrum(i, e.target.value)}
                    className={getGrooveItemClass(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
