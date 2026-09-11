export const styles = {
  h1: "text-5xl font-bold uppercase text-white",
  h2: "text-4xl font-bold uppercase text-white",
  h3: "text-sm text-purple-500 pl-2",
  index: "font-bold rounded-l-xl rounded-br-xl px-2",
};

export const ui = {
  section:
    "p-6 max-[650px]:p-2 max-[650px]:pb-4 rounded-xl\
    shadow-purple-900\
    shadow-[0_0_150px_rgba(168,85,247,0.6)] \
    inset-shadow-[0_0_10px_rgba(168,85,247,0.8)]",
  innerSection:
    "py-1 max-[650px]:py-0 p-2 \
    w-full relative overflow-visible \
    border border-purple-900 \
    rounded-lg bg-black",
  input:
    "rounded-tl-lg rounded-br-lg px-2\
    w-full bg-purple-50 \
    resize-none overflow-hidden \
    focus:outline-none",
  item: "border-r text-center rounded-tl-lg rounded-br-lg",
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
    transition-all duration-150\
    cursor-pointer",
  buttonSm:
    "group flex items-center justify-center\
    rounded-lg \
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

export const dropdownStyles = {
  menu: `
    overflow-hidden
    rounded-lg rounded-tl-none border border-purple-400/30
    bg-zinc-900 shadow-xl shadow-black/40
  `,

  option: `
    w-full px-2 py-1.5
    text-left text-sm
    transition-colors duration-100
    cursor-pointer
  `,

  selected: `
    text-white
    hover:bg-purple-500/20
    hover:text-purple-100
  `,

  hover: `
    bg-purple-500/30
    text-purple-200
  `,
};
