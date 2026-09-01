import { themes } from "../styles/styles";

const themeMap = Object.fromEntries(themes.map((t) => [t.name, t]));

function getTheme(name) {
  return themeMap[name] || themes[0];
}

export default function LyricsBlock({ progression, block }) {
  const theme = getTheme(progression.theme);
  return (
    <div className="relative">
      {/* Badge */}
      <div
        className={`
          absolute
          px-1
          rounded-br-lg
          rounded-tl-lg
          ${theme.badgeColor}
          text-white
          text-xs font-bold
          flex items-center justify-center
          z-10
        `}
      >
        {block.display_label === "full"
          ? progression.label
          : `${progression.label?.charAt(0)}${progression.position}`}
      </div>

      {/* Container */}
      <div
        className={`
          border-l-6
          ${theme.borderColor}
          ${theme.bgColor}
          rounded-2xl
          pl-5
        `}
      >
        {/* Chords) */}
        {Number(block.show_chords) === 1 && (
          <div className="flex gap-2 flex-wrap ml-8 ">
            {(progression.chords || []).map((chord, i) => (
              <span key={chord.id ?? i} className="px-2 rounded bg-white/40">
                {typeof chord === "object" ? chord.value : chord}
              </span>
            ))}
          </div>
        )}

        {/* Lyrics */}
        <div
          className="text-sm leading-4 whitespace-pre-wrap leading-5"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      </div>
    </div>
  );
}
