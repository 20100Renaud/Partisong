export const styles = {
  h1: "text-3xl font-bold uppercase text-white text-center",
  h2: "text-2xl font-bold mt-6 mb-2 text-white ml-12",
  h3: "text-lg font-bold text-purple-500 m-2",
  index:
    "text-3xl font-bold text-purple-600 bg-purple-600/50\
    rounded-tl-xl rounded-br-xl h-10",
};

export const ui = {
  section:
    "border border-purple-700/40 rounded-xl p-6 bg-black/50 " +
    "shadow-[0_0_150px_rgba(168,85,247,0.6)] " +
    "inset-shadow-[0_0_25px_rgba(168,85,247,0.8)] gap-4",
  subSection: "mb-4",
  input: "border rounded-xl px-3 py-2 w-full bg-white",
  grid: "bg-white border rounded-xl w-max",
  item: "w-10 h-10 border-r text-center",
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
};
