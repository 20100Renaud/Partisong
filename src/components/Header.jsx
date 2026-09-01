import { styles, ui, themes } from "../styles/styles";

// THEMES
const themeMap = Object.fromEntries(themes.map((t) => [t.name, t]));

function getTheme(name) {
  return themeMap[name] || themes[0];
}

const safeParse = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

export default function Header({ song }) {
  const beats = safeParse(song.groove?.beats);
  const pattern = safeParse(song.groove?.pattern);
  const strumming = safeParse(song.groove?.strumming);

  return (
    <section className="flex gap-12">
      {/* LEFT : Names */}
      <div className="flex-1/3 text-shadow-lg ">
        <h1 className="text-4xl font-bold">{song.title}</h1>
        <p className="text-zinc-700 text-right mr-4">{song.artist}</p>
      </div>

      {/* RIGHT : Helper */}
      <div className="flex-2/3">
        <div className="flex border gap-4 justify-around rounded-lg p-6 shadow-lg shadow-zinc-500">
          <div className="flex flex-col ">
            {/* Capo */}
            <div className="font-bold -translate-y-3 text-center px-2">
              <span>⸻</span>
              <span className="border rounded-xl px-1">Capo {song.capo}</span>
              <span>⸻</span>
            </div>

            {/* Groove schema*/}
            <div className="flex-1 flex items-center">
              <div className="font-bold">
                {/* beats */}
                <div className="px-3">
                  <div className="grid grid-cols-8 gap-2 text-center">
                    {beats.map((n) => (
                      <div key={n}>{n}</div>
                    ))}
                  </div>
                </div>

                {/* pattern */}
                <div className="bg-black text-white rounded-lg px-3">
                  <div className="grid grid-cols-8 gap-2 -mb-1 text-center">
                    {pattern.map((v, i) => (
                      <div key={i}>{v}</div>
                    ))}
                  </div>
                </div>

                {/* strumming */}
                <div className="px-3">
                  <div className="grid grid-cols-8 gap-2 text-xl text-center">
                    {strumming.map((v, i) => (
                      <div key={i}>{v}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Progression */}
          <div className="space-y-0 text-left justify-items-start">
            <section>
              {song.progressions
                .filter((row) => row.label !== "Intro")
                .map((row) => {
                  const theme = getTheme(row.theme);
                  return (
                    <div
                      key={row.id}
                      className="grid grid-cols-[100px_1fr] items-center"
                    >
                      <div
                        className={`font-bold text-right mr-4 ${theme.textColor} cursor-pointer`}
                      >
                        {row.label} {row.position}
                      </div>

                      <div className="grid grid-cols-4 text-center gap-4">
                        {row.chords.map((chord) => (
                          <div key={chord.id}>{chord.value}</div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
