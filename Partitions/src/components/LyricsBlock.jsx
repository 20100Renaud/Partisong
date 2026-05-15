export default function LyricsBlock({ progression, block }) {
  return (
    <div className="relative">
      {/* Label */}
      <div
        className={`
          absolute
          px-1.5
          rounded-br-lg
          rounded-tl-lg
          rounded-bl-lg
          ${progression.badgeColor}
          text-white
          text-sm font-bold
          flex items-center justify-center
          z-10
        `}
      >
        {progression.label}
      </div>

      {/* Container */}
      <div
        className={`
          border-l-6
          ${progression.borderColor}
          ${progression.bgColor}
          rounded-2xl
          pl-4
          my-1
        `}
      >
        {/* Chords) */}
        {Number(block.show_chords) === 1 && (
          <div className="flex gap-2 flex-wrap ml-6 mb-2">
            {(progression.chords || []).map((chord, i) => (
              <span
                key={chord.id ?? i}
                className="px-2 py-1 rounded bg-white/40"
              >
                {typeof chord === "object" ? chord.value : chord}
              </span>
            ))}
          </div>
        )}

        {/* Lyrics */}
        <div className="text-sm leading-5 whitespace-pre-wrap">
          {block.content}
        </div>
      </div>
    </div>
  );
}
