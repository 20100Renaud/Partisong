import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styles, ui } from "../styles/styles";
import { Monitor, NotebookText, Music4 } from "lucide-react";

export default function SongDashboard({ toggleFullscreen }) {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/songs")
      .then((r) => r.json())
      .then(setSongs)
      .catch(console.error);
  }, []);

  // Add new song
  async function addSong() {
    const res = await fetch("/api/songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const newSong = await res.json();

    setSongs((prev) => [...prev, newSong].sort((a, b) => a.id - b.id));
    navigate(`/description/${newSong.id}`);
  }

  // Delete song
  async function deleteSong(id) {
    await fetch(`/api/songs/${id}`, {
      method: "DELETE",
    });

    setSongs((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      {/* CONTENT */}
      <div className="flex items-center justify-center mt-50">
        <div className="mx-auto max-w-2xl bg-black rounded-xl p-10 w-full">
          {/* HEADER */}
          <div>
            <div
              onClick={toggleFullscreen}
              className="flex flex-row justify-center cursor-pointer select-none hover:opacity-80 transition"
            >
              <h1 className={styles.h1}>Parti</h1>
              <h1 className={`${styles.h1} !font-thin`}>Song</h1>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={addSong}
                className={`${ui.button} w-80 py-2 px-6 mb-8 hover:!w-80`}
              >
                + Ajouter une chanson
              </button>
            </div>
          </div>

          {/* LIST */}
          <div className="shadow-[0px_50px_200px_rgba(168,85,247,0.25),inset_0_0_50px_rgba(168,85,247,0.25)] rounded-xl">
            {songs.map((song) => (
              <div
                key={song.id}
                className={`${ui.section} rounded-xl py-2 mb-2 flex justify-between hover:py-4 transition-all duration-200 block items-center !shadow-[0_0_40px_rgba(168,85,247,0.25)]`}
              >
                {/* Title + Artist */}
                <Link
                  to={`/studio/${song.id}`}
                  className="flex flex-2/3 cursor-pointer"
                >
                  <div className="w-1/2">
                    <h3 className={`${styles.h3} flex flex-1/2`}>
                      {song.title}
                    </h3>
                  </div>

                  <div className="w-1/2">
                    <h3 className={`${styles.h3} flex flex-1/2`}>
                      {song.artist}
                    </h3>
                  </div>
                </Link>

                {/* DELETE SONG */}
                <div className="flex w-1/3 gap-2 h-10 justify-end items-center">
                  <button
                    onClick={() => deleteSong(song.id)}
                    className={`${ui.button} w-6 h-6 group`}
                  >
                    <span className="group-hover:hidden">✕</span>
                    <span className="hidden group-hover:block text-sm font-medium">
                      Supprimer
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
