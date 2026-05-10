import { getProgression, colorMap } from "./progression";

export default function LyricsBlock({ id, children }) {
  const section = getProgression(id);

  if (!section) return null;

  return (
    <div className="relative ">
      {/* ID badge */}
      {section.id && (
        <div
          className={`
          absolute
          px-1.5
          rounded-br-lg
          rounded-tl-lg
          rounded-bl-lg
          ${colorMap[section.borderColor]}
          text-white
          text-sm font-bold
          flex items-center justify-center
          z-10
        `}
        >
          {section.id}
        </div>
      )}
      {/* Colored left border */}
      <div
        className={`
          border-l-6
          ${section.borderColor}
          rounded-2xl
          pl-4
          my-1
        `}
      >
        {/* Intro chords */}
        {section.id === "Intro" && (
          <div className="flex gap-2 flex-wrap ml-8 -mb-2">
            {section.chords.map((chord, i) => (
              <span key={i} className=" pl-2 py-1 rounded">
                {chord}
              </span>
            ))}
          </div>
        )}

        {/* lyrics */}
        <div className="text-sm leading-5">{children}</div>
      </div>
    </div>
  );
}
