import { demoSongs } from "./data/demoSong";

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

function clone(data) {
  return structuredClone(data);
}

export async function getSongs() {
  if (DEMO_MODE) {
    return clone(demoSongs);
  }

  const response = await fetch("/api/songs");

  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }

  return response.json();
}

export async function getSong(id) {
  if (DEMO_MODE) {
    const song = demoSongs.find((s) => s.id === Number(id));

    if (!song) {
      throw new Error("Demo song not found");
    }

    return clone(song);
  }

  const response = await fetch(`/api/songs/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch song");
  }

  return response.json();
}
