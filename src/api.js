export async function getSongs() {
  const response = await fetch("/api/songs");
  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }
  
  return response.json();
}
