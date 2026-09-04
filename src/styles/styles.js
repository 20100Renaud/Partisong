export const styles = {
  h1: "text-5xl font-bold uppercase text-white",
  h2: "text-4xl font-bold uppercase text-white",
  h3: "text-sm text-purple-500 pl-2",
  index:
    "text-xl font-bold rounded-l-xl rounded-br-xl px-2",
};

export const ui = {
  section:
    "p-6\
    shadow-purple-900\
    shadow-[0_0_150px_rgba(168,85,247,0.6)] \
    inset-shadow-[0_0_10px_rgba(168,85,247,0.8)]",
  input:
    "border rounded-l-xl rounded-br-xl px-2 w-full bg-purple-600 border-none text-white",
  grid: "bg-white border rounded-l-xl rounded-br-xl",
  item: "w-6 border-r text-center rounded-tl-lg rounded-br-lg",
  button:
    "group flex items-center justify-center\
    rounded-full\
    bg-gradient-to-b from-purple-500 to-purple-800\
    text-white\
    shadow-[0_6px_12px_rgba(0,0,0,0.5)]\
    hover:shadow-[0_8px_18px_rgba(168,85,247,0.5)]\
    border border-purple-300/30\
    before:absolute\
    before:inset-[2px]\
    before:rounded-full\
    before:bg-gradient-to-b\
    before:from-white/20\
    before:to-transparent\
    relative overflow-hidden\
    active:translate-y-[2px]\
    active:shadow-[0_2px_6px_rgba(0,0,0,0.5)]\
    hover:w-20\
    transition-all duration-150\
    cursor-pointer",
  buttonSm:
    "group flex items-center justify-center\
    rounded-xl \
    bg-gradient-to-b from-purple-500 to-purple-800\
    text-white\
    shadow-[0_6px_12px_rgba(0,0,0,0.5)]\
    hover:shadow-[0_8px_18px_rgba(168,85,247,0.5)]\
    cursor-pointer",
};

export const themes = [
  {
    name: "red",
    textColor: "text-red-500",
    borderColor: "border-red-500",
    bgColor: "bg-red-500/0",
    bgColorDescription: "bg-red-500/20",
    badgeColor: "bg-red-500",
  },
  {
    name: "yellow",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
    bgColor: "bg-yellow-500/0",
    bgColorDescription: "bg-yellow-500/20",
    badgeColor: "bg-yellow-500",
  },
  {
    name: "green",
    textColor: "text-green-600",
    borderColor: "border-green-600",
    bgColor: "bg-green-600/0",
    bgColorDescription: "bg-green-600/20",
    badgeColor: "bg-green-600",
  },
  {
    name: "blue",
    textColor: "text-blue-500",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-500/0",
    bgColorDescription: "bg-blue-500/20",
    badgeColor: "bg-blue-500",
  },
  {
    name: "purple",
    textColor: "text-purple-500",
    borderColor: "border-purple-500",
    bgColor: "bg-purple-500/0",
    bgColorDescription: "bg-purple-500/20",
    badgeColor: "bg-purple-500",
  },
];