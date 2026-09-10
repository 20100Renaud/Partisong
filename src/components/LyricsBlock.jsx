import { themes } from "../styles/styles";

const themeMap = Object.fromEntries(themes.map((t) => [t.name, t]));

function getTheme(name) {
  return themeMap[name] || themes[0];
}

export default function LyricsBlock({ progression, block }) {
  const theme = getTheme(progression.theme);

  const defaultIsFull =
    progression.label === "Intro" || progression.label === "Final";

  const isFull =
    block.display_label != null
      ? block.display_label === "full"
      : defaultIsFull;

  const match = progression.label?.match(/\d+$/);
  const number = match?.[0];

  const first = progression.label?.charAt(0).toUpperCase() ?? "";

  const badgeLabel = isFull
    ? progression.label
    : number
      ? `${first}${number}`
      : `\u00A0${first}\u00A0`;




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
        {badgeLabel}
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
        {/* Chords */}
        {Number(block.show_chords) === 1 && (
          <div className="flex gap-2 flex-wrap ml-8">
            {(progression.chords || []).map((chord, i) => (
              <span key={chord.id ?? i} className="px-2 rounded bg-white/40">
                {typeof chord === "object" ? chord.value : chord}
              </span>
            ))}
          </div>
        )}

        {/* Lyrics */}
        <div
          className="text-sm whitespace-pre-wrap leading-5"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      </div>
    </div>
  );
}
