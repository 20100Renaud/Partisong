export const progression = [
  {
    id: "Intro",
    label: "Intro",
    textColor: "text-black",
    borderColor: "border-red-500",
    chords: ["C", "Em", "C", "Em", "Am", "G", "G"],
  },
  {
    id: "1",
    label: "Verse",
    textColor: "text-red-500",
    borderColor: "border-red-500",
    chords: ["C", "Em", "Am", "G"],
  },
  {
    id: "2",
    label: "Verse",
    textColor: "text-green-600",
    borderColor: "border-green-600",
    chords: ["Dm", "G", "Am", "G"],
  },
  {
    id: "3",
    label: "Bridge",
    textColor: "text-blue-500",
    borderColor: "border-blue-500",
    chords: ["Am", "Em", "Am", "Em"],
  },
  {
    id: "4",
    label: "Outro",
    textColor: "text-purple-500",
    borderColor: "border-purple-500",
    chords: ["Dm", "G", "G", "GG"],
  },
];

const colorMap = {
  "border-red-500": "bg-red-500",
  "border-green-600": "bg-green-600",
  "border-blue-500": "bg-blue-500",
  "border-purple-500": "bg-purple-500",
};

export const getProgression = (id) => progression.find((p) => p.id === id);
export { colorMap };
