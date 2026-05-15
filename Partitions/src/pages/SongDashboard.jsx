import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styles, ui } from "../styles/styles";
import { Save, House, Info, Monitor, NotebookText } from "lucide-react";

export default function SongDashboard() {
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
      body: JSON.stringify({
        title: "Titre",
        artist: "",
        capo: 0,
      }),
    });

    const newSong = await res.json();

    setSongs((prev) => [...prev, newSong].sort((a, b) => a.id - b.id));
    navigate(`/description/${newSong.id}`);
  }

  return (
    <div className="bg-gradient-to-tr from-purple-900 to-pink-900 py-10 min-h-screen">
      <div className="mx-auto max-w-5xl bg-black rounded-xl p-10">
        <h1 className={styles.h1}>partitions</h1>
        <h2 className={styles.h2}>Liste des chansons</h2>

        <div className="flex justify-center">
          <button
            onClick={addSong}
            className={`${ui.button} w-80 py-2 px-6 mb-8 hover:!w-80`}
          >
            + Ajouter une chanson
          </button>
        </div>

        <div className={`${ui.section}`}>
          {songs.map((song) => (
            <div
              key={song.id}
              className="rounded-xl p-6 flex justify-between items-center"
            >
              <div className="flex flex-1/3">
                <h3 className={`${styles.h3} flex flex-1/2`}>{song.title}</h3>
              </div>

              <div className="flex flex-1/3">
                <h3 className={`${styles.h3} flex flex-1/2`}>{song.artist}</h3>
              </div>

              <div className="flex flex-1/3 gap-2 h-10 justify-end">
                <Link
                  to={`/description/${song.id}`}
                  className={`${ui.button} w-10`}
                >
                  <Info size={18} className="group-hover:hidden" />
                  <span className="hidden group-hover:block text-sm font-medium">
                    Infos
                  </span>
                </Link>

                <Link to={`/lyrics/${song.id}`} className={`${ui.button} w-10`}>
                  <NotebookText size={18} className="group-hover:hidden" />
                  <span className="hidden group-hover:block text-sm font-medium">
                    Paroles
                  </span>
                </Link>

                <Link
                  to={`/print/${song.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${ui.button} w-10`}
                >
                  <Monitor size={18} className="group-hover:hidden" />
                  <span className="hidden group-hover:block text-sm font-medium">
                    Imprimer
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
