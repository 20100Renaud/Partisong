import { useRef, useEffect } from "react";
import { themes, ui } from "../styles/styles";
import { formatOptions } from "../constants/page";
import { sanitizeLyricsHtml } from "../utils/sanitizeHtml";
import Dropdown_Progression from "./Dropdown_Progression";
import Dropdown_Format from "./Dropdown_Format";
import {
  Music4,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Eraser,
  RemoveFormatting,
  Trash2,
  ListChevronsUpDown,
  ListChevronsDownUp,
  X,
} from "lucide-react";

export default function LyricsBlockEditor({
  block,
  progression,
  song,
  isOpen,
  selectedFormat,
  onFormatChange,
  onToggle,
  onUpdate,
  onContentChange,
  onContentBlur,
  onRequestStrip,
  onRequestDelete,
}) {
  const textareaRef = useRef(null);

  const themeMap = Object.fromEntries(themes.map((t) => [t.name, t]));
  const theme = themeMap[progression?.theme] || themes[0];

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [block.content, isOpen]);

  // TEXT FORMATTING
  function wrapSelection(tag) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    let adjustedEnd = end;

    if (end > start && textarea.value[end - 1] === " ") {
      adjustedEnd = end - 1;
    }

    const selected = textarea.value.slice(start, adjustedEnd);
    if (!selected) return;

    const wrapped = `<${tag}>${selected}</${tag}>`;

    const newValue =
      textarea.value.slice(0, start) +
      wrapped +
      textarea.value.slice(adjustedEnd);

    onUpdate(block.id, {
      content: newValue,
    });

    requestAnimationFrame(() => {
      textarea.focus();

      const offset = wrapped.length - selected.length;

      textarea.selectionStart = start;
      textarea.selectionEnd = adjustedEnd + offset;
    });
  }

  // CLEAR SELECTED TEXT FORMATTING
  function stripTags(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || "";
  }

  function clearSelectionFormatting() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    let adjustedEnd = end;

    if (end > start && textarea.value[end - 1] === " ") {
      adjustedEnd = end - 1;
    }

    const selected = textarea.value.slice(start, adjustedEnd);
    if (!selected) return;

    const cleaned = stripTags(selected);

    const newValue =
      textarea.value.slice(0, start) +
      cleaned +
      textarea.value.slice(adjustedEnd);

    // Update block
    onUpdate(block.id, {
      content: newValue,
    });

    // Restore selection
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = start + cleaned.length;
    });
  }

  return (
    <div className={`${ui.innerSection}`}>
      <div className="relative">
        {/* VISIBLE BAR */}
        <div className="flex gap-4 w-full items-center justify-between">
          {/* BLOCK 1 */}
          <div className="flex gap-2 w-20 items-center">
            {/* PROGRESSION */}
            <Dropdown_Progression
              value={block.progression_id}
              options={song.progressions}
              displayLabel={block.display_label}
              theme={theme}
              onChange={(progressionId) =>
                onUpdate(block.id, {
                  progression_id: progressionId,
                })
              }
            />

            {/* LABEL SIZE */}
            <div className="flex items-center">
              {(() => {
                const defaultIsFull =
                  progression?.label === "Intro" ||
                  progression?.label === "Final";

                const isFull =
                  block.display_label != null
                    ? block.display_label === "full"
                    : defaultIsFull;

                return (
                  <button
                    type="button"
                    title={
                      isFull
                        ? "Afficher le nom court"
                        : "Afficher le nom complet"
                    }
                    onClick={() =>
                      onUpdate(block.id, {
                        display_label: isFull ? "short" : "full",
                      })
                    }
                    className={`
                      flex items-center justify-left
                      w-6 h-7 rounded
                      text-white text-xs
                      cursor-pointer
                      transition-all duration-150
                      hover:text-purple-400
                      hover:font-bold
                    `}
                  >
                    {isFull ? "Abc" : "A"}
                  </button>
                );
              })()}
            </div>
          </div>

          {/* EXPAND TOGGLE + PREVIEW LYRICS */}
          <button
            type="button"
            onClick={() => onToggle(block.id)}
            className="
                  flex flex-1 items-center min-w-0 min-[650px]:ml-4
                  text-white/50 text-left
                  hover:text-purple-400
                  hover:font-bold
                  cursor-pointer
                "
          >
            <span className="shrink-0">
              {isOpen ? <ChevronDown /> : <ChevronRight />}
            </span>
            <span
              className={`
                truncate
                whitespace-nowrap overflow-hidden
                transition-opacity duration-150
                ${isOpen ? "opacity-0" : "opacity-100"}
              `}
              dangerouslySetInnerHTML={{
                __html: sanitizeLyricsHtml(block.content),
              }}
            />
          </button>

          {/* BLOCK 2: Show chords + Mb */}
          <div className="flex gap-4">
            <div className="flex">
              {/* CHORDS */}
              <div className="pt-1">
                <div
                  title={
                    block.show_chords
                      ? "Cacher les accords"
                      : "Montrer les accords"
                  }
                  onClick={() =>
                    onUpdate(block.id, {
                      show_chords: block.show_chords ? 0 : 1,
                    })
                  }
                  className={`
                    flex items-center justify-center
                    w-7 h-7
                    cursor-pointer select-none
                    transition-colors duration-150
                    ${
                      block.show_chords
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-purple-400 hover:text-purple-300"
                    }
                  `}
                >
                  {block.show_chords ? (
                    <Music4 size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </div>
              </div>
              {/* Mb toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  title={
                    (block.mb ?? 0) === 4
                      ? "Réduire l'espace après ce block"
                      : "Augmenter l'espace après ce block"
                  }
                  onClick={() =>
                    onUpdate(block.id, {
                      mb: (block.mb ?? 0) === 4 ? 0 : 4,
                    })
                  }
                  className={`
                  flex items-center justify-center
                  w-7 h-7
                  cursor-pointer
                  transition-colors duration-150
                  ${(block.mb ?? 0) === 4 ? "text-amber-400" : "text-green-400"}
                `}
                >
                  {(block.mb ?? 0) === 4 ? (
                    <ListChevronsDownUp size={18} />
                  ) : (
                    <ListChevronsUpDown size={18} />
                  )}
                </button>
              </div>
            </div>
            {/* BLOCK 3 : DELETE */}
            <button
              title="Supprimer le block définitivement"
              onClick={() => onRequestDelete(block.id)}
              className="group text-red-500 transition-colors duration-150 cursor-pointer"
            >
              <Trash2 size={18} className="group-hover:hidden " />
              <X size={18} className="hidden group-hover:block " />
            </button>
          </div>
        </div>

        {/* HIDDEN PART */}
        {isOpen && (
          <div className="flex max-[650px]:flex-col gap-2 mb-4 -ml-2 w-full max-[650px]:items-center">
            {/* LYRICS */}
            <div className="flex flex-1 w-full">
              <textarea
                ref={textareaRef}
                value={block.content}
                onChange={(e) => {
                  onContentChange(block.id, e.target.value);
                }}
                onBlur={(e) => onContentBlur(block.id, e.target.value)}
                className={`${ui.input} leading-tight py-2`}
                rows={1}
              />
            </div>

            {/* TEXT FORMATTING */}
            <div className="flex w-fit items-center text-white h-6 mt-1 gap-2">
              {/* Format btn */}
              <Dropdown_Format
                value={selectedFormat}
                options={formatOptions}
                onChange={onFormatChange}
                onApply={() => wrapSelection(selectedFormat)}
                getOptionValue={(option) => option.value}
                renderValue={(format) => {
                  const Icon = format?.icon;
                  return Icon ? <Icon size={16} /> : null;
                }}
                renderOption={(format) => {
                  const Icon = format.icon;

                  return (
                    <>
                      <Icon size={16} />
                      <span>{format.label}</span>
                    </>
                  );
                }}
              />

              {/* Clear selection */}
              <button
                type="button"
                title="Supprimer la mise en forme sélectionnée"
                onMouseDown={(e) => {
                  e.preventDefault();
                  clearSelectionFormatting();
                }}
                className={`${ui.buttonSm} w-6 h-full !rounded-sm`}
              >
                <RemoveFormatting size={16} />
              </button>

              {/* Clear block */}
              <button
                type="button"
                title="Supprimer la mise en forme du block"
                onClick={() => onRequestStrip(block.id)}
                className={`${ui.buttonSm} w-6 h-full !rounded-sm`}
              >
                <Eraser size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
