import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styles, ui } from "../styles/styles";
import { ConfirmModal } from "../components/Modal";
import { Trash2 } from "lucide-react";

export default function SongDashboard({ toggleFullscreen }) {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  const [confirmState, setConfirmState] = useState({
    open: false,
    song: null,
  });

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
    navigate(`/studio/${newSong.id}`);
  }

  // Delete song
  async function deleteSong(id) {
    await fetch(`/api/songs/${id}`, {
      method: "DELETE",
    });

    setSongs((prev) => prev.filter((s) => s.id !== id));
  }

  function requestDeleteSong(song) {
    setConfirmState({
      open: true,
      song,
    });
  }

  async function handleConfirmDelete() {
    await deleteSong(confirmState.song.id);

    setConfirmState({
      open: false,
      song: null,
    });
  }

  function handleCancelDelete() {
    setConfirmState({
      open: false,
      songId: null,
    });
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black flex items-center">
      {/* CONTENT */}
      <div className="mx-auto max-w-2xl bg-black rounded-xl p-10 w-full">
        {/* HEADER */}
        <div>
          <div
            onClick={toggleFullscreen}
            className="flex flex-row justify-center cursor-pointer hover:opacity-80 transition"
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
        <div className="">
          {songs.map((song) => (
            <div key={song.id} className="relative group">
              {/* ------CONTENT------ */}
              <div className="py-2 mb-2 flex justify-between">
                {/* Title + Artist */}
                <div className="flex">
                  <Link
                    to={`/studio/${song.id}`}
                    className="flex cursor-pointer"
                  >
                    <div className="w-1/2">
                      <h3 className={`${styles.h3}`}>{song.title}</h3>
                    </div>

                    <div className="w-1/2">
                      <h3 className={`${styles.h3}`}>{song.artist}</h3>
                    </div>
                  </Link>
                </div>

                {/* DELETE */}
                <div className="flex flex-1 gap-2 justify-end text-purple-500">
                  <button
                    title="Supprimer la chanson définitivement"
                    onClick={() => requestDeleteSong(song)}
                    className="hover:text-red-500 leading-none"
                  >
                    <Trash2 size={18} className="cursor-pointer" />
                  </button>
                </div>
              </div>

              {/* -----OVERLAY---- */}
              <div
                className={`
                  ${ui.section} rounded-xl py-2 mb-2 -mx-20
                  absolute inset-0 transition-all duration-300
                  group-hover:scale-x-105
                  pointer-events-none
                `}
              ></div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 left-0 flex w-full items-center justify-center sm:p-4 opacity-25 text-xs text-white">
          <p>© 2026 LUN-e · Lien d’Univers Numériques</p>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        open={confirmState.open}
        title="Attention"
        message={
          <>
            Supprimer la chanson{" "}
            <b>{confirmState.song?.title || "Chanson inconnue"}</b> de{" "}
            <b>{confirmState.song?.artist || "Artiste inconnu"}</b>{" "}
            définitivement ?`
          </>
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
