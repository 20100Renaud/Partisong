import { useEffect, useLayoutEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getSong, DEMO_MODE } from "../api";

import {
  Music4,
  EyeOff,
  Trash2,
  Plus,
  Minus,
  ChevronDown,
  ChevronRight,
  Eraser,
  Bold,
  Italic,
  Underline,
  Highlighter,
  GripVertical,
} from "lucide-react";

import { styles, ui, themes } from "../styles/styles";
import { ConfirmModal } from "../components/Modal";

export default function LyricsPage(props) {
  const [localSong, setLocalSong] = useState(null);
  const embedded = props.embedded ?? false;
  const setSong = embedded ? props.setSong : setLocalSong;
  const song = embedded ? props.song : localSong;
  const { id } = useParams();
  const toggleFullscreen = props.toggleFullscreen;

  const textareaRefs = useRef({});
  const blockRefs = useRef({});
  const dragStateRef = useRef(null);
  const previousRectsRef = useRef({});
  const [blockTransforms, setBlockTransforms] = useState({});


  const [draggedBlockId, setDraggedBlockId] = useState(null);
  const [dragPreviewOrder, setDragPreviewOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replaceConfirmOpen, setReplaceConfirmOpen] = useState(false);
  const [openBlockId, setOpenBlockId] = useState(null);
  const [confirmState, setConfirmState] = useState({
    open: false,
    blockId: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    blockId: null,
  });
  const [replaceFormat, setReplaceFormat] = useState({
    from: "u",
    to: "b",
  });

  const formatOptions = [
    { label: "Bold", value: "b" },
    { label: "Italic", value: "i" },
    { label: "Underline", value: "u" },
    { label: "Highlight", value: "mark" },
  ];

  // Toggle
  useEffect(() => {
    if (embedded) return;

    getSong(id).then(setLocalSong).catch(console.error);
  }, [id, embedded]);

  const toggleBlock = (blockId) => {
    setOpenBlockId((prev) => (prev === blockId ? null : blockId));
  };

  // THEMES
  const themeMap = Object.fromEntries(themes.map((t) => [t.name, t]));

  function getTheme(name) {
    return themeMap[name] || themes[0];
  }

  // ADD BLOCK
  const allBlocks =
    song?.progressions?.flatMap((p) => p.lyricsBlocks || []) || [];

  const nextPosition =
    allBlocks.length > 0
      ? Math.max(...allBlocks.map((b) => b.position ?? 0)) + 1
      : 0;

  async function addBlock() {
    if (DEMO_MODE) return;

    const response = await fetch(`/api/lyrics-blocks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        song_id: song?.id,
        progression_id: song?.progressions?.[0]?.id || null,
        content: "",
        show_chords: 0,
        position: nextPosition,
        mb: 4,
      }),
    });

    const newBlock = await response.json();

    setSong((prev) => ({
      ...prev,
      progressions: prev.progressions.map((p) => {
        if (p.id === newBlock.progression_id) {
          return {
            ...p,
            lyricsBlocks: [...(p.lyricsBlocks || []), newBlock],
          };
        }

        return p;
      }),
    }));
    setOpenBlockId(newBlock.id);
  }

  // UPDATE HELPER
  function updateBlockInSong(song, blockId, patch) {
    return {
      ...song,
      progressions: song.progressions.map((p) => ({
        ...p,
        lyricsBlocks: (p.lyricsBlocks || []).map((b) =>
          b.id === blockId ? { ...b, ...patch } : b,
        ),
      })),
    };
  }

  // UPDATE LYRICS BLOCK
  async function updateBlock(id, patch) {
    setSong((prev) => updateBlockInSong(prev, id, patch));

    if (DEMO_MODE) return;

    await fetch(`/api/lyrics-blocks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  // DELETE BLOCK
  async function deleteBlock(id) {
    if (DEMO_MODE) return;

    await fetch(`/api/lyrics-blocks/${id}`, {
      method: "DELETE",
    });

    if (DEMO_MODE) return;

    setSong((prev) => ({
      ...prev,
      progressions: prev.progressions.map((p) => ({
        ...p,
        lyricsBlocks: (p.lyricsBlocks || []).filter((b) => b.id !== id),
      })),
    }));
  }

  // TEXT FORMATTING
  function wrapSelection(blockId, tag) {
    const textarea = textareaRefs.current[blockId];
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

    updateBlock(blockId, { content: newValue });

    requestAnimationFrame(() => {
      textarea.focus();
      const offset = wrapped.length - selected.length;
      textarea.selectionStart = start;
      textarea.selectionEnd = adjustedEnd + offset;
    });
  }
  // CLEAR TEXT FORMATTING
  function requestStrip(blockId = null) {
    setConfirmState({
      open: true,
      blockId,
    });
  }

  async function handleConfirm() {
    setLoading(true);
    await stripHtml(confirmState.blockId);
    setConfirmState({ open: false, blockId: null });
    setLoading(false);
  }

  function handleCancel() {
    setConfirmState({ open: false, blockId: null });
  }

  async function stripHtml(blockId = null) {
    const isAll = !blockId;

    const strip = (html = "") => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || "";
    };

    let updates = [];

    setSong((prev) => {
      const updated = structuredClone(prev);

      updated.progressions.forEach((p) => {
        p.lyricsBlocks?.forEach((b) => {
          if (isAll || b.id === blockId) {
            const clean = strip(b.content);
            b.content = clean;

            updates.push({
              id: b.id,
              content: clean,
            });
          }
        });
      });

      return updated;
    });

    if (DEMO_MODE) return;

    await Promise.all(
      updates.map((u) =>
        fetch(`/api/lyrics-blocks/${u.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: u.content,
          }),
        }),
      ),
    );
  }

  // CLEAR SELECTED TEXT FORMATTING
  function stripTags(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || "";
  }

  function clearSelectionFormatting(blockId) {
    const textarea = textareaRefs.current[blockId];
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

    updateBlock(blockId, { content: newValue });

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = start + cleaned.length;
    });
  }

  // SWITCH TEXT FORMATTING
  function getFormatLabel(value) {
    return formatOptions.find((f) => f.value === value)?.label || value;
  }

  async function replaceFormattingTags(fromTag, toTag) {
    const openRegex = new RegExp(`<${fromTag}>`, "g");
    const closeRegex = new RegExp(`</${fromTag}>`, "g");

    let updates = [];

    setSong((prev) => {
      const updated = structuredClone(prev);

      updated.progressions.forEach((p) => {
        p.lyricsBlocks?.forEach((b) => {
          const newContent = b.content
            .replace(openRegex, `<${toTag}>`)
            .replace(closeRegex, `</${toTag}>`);

          if (newContent !== b.content) {
            b.content = newContent;

            updates.push({
              id: b.id,
              content: newContent,
            });
          }
        });
      });

      return updated;
    });

    if (DEMO_MODE) return;

    await Promise.all(
      updates.map((u) =>
        fetch(`/api/lyrics-blocks/${u.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: u.content,
          }),
        }),
      ),
    );
  }

  // DRAG AND DROP
  function getBlockOrder() {
    return [...song.progressions]
      .flatMap((p) => p.lyricsBlocks || [])
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }

  function moveItem(order, fromIndex, toIndex) {
    const next = [...order];
    const [item] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, item);
    return next;
  }

  function getPreviewOrderFromPointer(clientY) {
    const dragState = dragStateRef.current;

    if (!dragState) return;

    const currentOrder =
      dragState.previewOrder || getBlockOrder().map((b) => b.id);

    const draggedId = dragState.blockId;

    const otherIds = currentOrder.filter((id) => id !== draggedId);

    let targetIndex = otherIds.length;

    for (let i = 0; i < otherIds.length; i++) {
      const element = blockRefs.current[otherIds[i]];

      if (!element) continue;

      const rect = element.getBoundingClientRect();
      const middle = rect.top + rect.height / 2;

      if (clientY < middle) {
        targetIndex = i;
        break;
      }
    }

    const reordered = [...otherIds];

    reordered.splice(targetIndex, 0, draggedId);

    if (JSON.stringify(reordered) === JSON.stringify(dragState.previewOrder)) {
      return;
    }

    dragState.previewOrder = reordered;
    setDragPreviewOrder(reordered);
  }

  function handlePointerMove(e) {
    const dragState = dragStateRef.current;

    if (!dragState) return;

    e.preventDefault();

    getPreviewOrderFromPointer(e.clientY);
  }

  async function handlePointerUp() {
    const dragState = dragStateRef.current;

    if (!dragState) return;

    const finalOrder = dragState.previewOrder;

    dragStateRef.current = null;

    setDraggedBlockId(null);
    setDragPreviewOrder(null);
    setBlockTransforms({});
    previousRectsRef.current = {};

    if (!finalOrder || finalOrder.length === 0) return;

    const originalOrder = getBlockOrder().map((b) => b.id);

    if (JSON.stringify(originalOrder) === JSON.stringify(finalOrder)) {
      return;
    }

    await persistBlockOrder(finalOrder);
  }

  async function persistBlockOrder(order) {
    const updates = order.map((id, index) => ({
      id,
      position: index,
    }));

    setSong((prev) => ({
      ...prev,
      progressions: prev.progressions.map((p) => ({
        ...p,
        lyricsBlocks: (p.lyricsBlocks || []).map((block) => {
          const update = updates.find((u) => u.id === block.id);

          return update
            ? {
                ...block,
                position: update.position,
              }
            : block;
        }),
      })),
    }));

    if (DEMO_MODE) return;

    await Promise.all(
      updates.map((update) =>
        fetch(`/api/lyrics-blocks/${update.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            position: update.position,
          }),
        }),
      ),
    );
  }

  function handlePointerDown(e, blockId) {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    e.preventDefault();

    previousRectsRef.current = {};
    setBlockTransforms({});

    const order = getBlockOrder().map((b) => b.id);

    dragStateRef.current = {
      blockId,
      previewOrder: order,
    };

    setDraggedBlockId(blockId);
    setDragPreviewOrder(order);

    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerCancel() {
    dragStateRef.current = null;
    setDraggedBlockId(null);
    setDragPreviewOrder(null);
    setBlockTransforms({});
    previousRectsRef.current = {};
  }


  if (!song) return <div>Loading...</div>;

  const blocks = useMemo(() => {
    return [...song.progressions.flatMap((p) => p.lyricsBlocks || [])].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0),
    );
  }, [song?.progressions]);

  const displayBlocks = useMemo(() => {
    if (!dragPreviewOrder) return blocks;

    const blockMap = new Map(blocks.map((block) => [block.id, block]));

    return dragPreviewOrder.map((id) => blockMap.get(id)).filter(Boolean);
  }, [blocks, dragPreviewOrder]);

  useLayoutEffect(() => {
    if (!displayBlocks.length) return;

    const previousRects = previousRectsRef.current;
    const nextRects = {};

    displayBlocks.forEach((block) => {
      const el = blockRefs.current[block.id];

      if (el) {
        nextRects[block.id] = el.getBoundingClientRect();
      }
    });

    if (!Object.keys(previousRects).length) {
      previousRectsRef.current = nextRects;
      return;
    }

    const transforms = {};

    displayBlocks.forEach((block) => {
      const previous = previousRects[block.id];
      const current = nextRects[block.id];

      if (!previous || !current) return;

      const deltaY = previous.top - current.top;

      if (Math.abs(deltaY) > 1) {
        transforms[block.id] = deltaY;
      }
    });

    previousRectsRef.current = nextRects;

    if (Object.keys(transforms).length === 0) return;

    setBlockTransforms(transforms);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setBlockTransforms({});
      });
    });
  }, [displayBlocks]);



  //
  //
  //
  //
  //
  //
  // ----------------------CONTENT---------------------------------------------
  //
  //
  //
  //
  //
  //
  //

  return (
    <div className="mx-auto max-w-4xl rounded-xl p-10">
      {/* 1. ----------------------HEADER------------------------ */}
      <div className="flex flex-col items-center justify-between mb-4">
        {/* PAGE TITLE */}
        <div
          onClick={toggleFullscreen}
          className="flex flex-row justify-center mx-auto cursor-pointer hover:opacity-80 transition"
        >
          <h2 className={`${styles.h2}`}>Chan</h2>
          <h2 className={`${styles.h2} !font-thin`}>Song</h2>
        </div>
        <div>
          <h3 className={`${styles.h3} !font-thin`}>Couplets et paroles</h3>
        </div>
      </div>

      {/* MAIN BAR */}
      <div className={`${ui.section} flex justify-end py-1 mb-4 w-full gap-4`}>
        {/* Switch formatting */}
        <div className="flex items-center gap-2">
          {/* From */}
          <div className="w-26">
            <select
              value={replaceFormat.from}
              onChange={(e) =>
                setReplaceFormat((prev) => ({
                  ...prev,
                  from: e.target.value,
                }))
              }
              className={`${ui.input}`}
            >
              {formatOptions.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <span className="text-white text-sm">→</span>

          {/* To */}
          <div className="w-26">
            <select
              value={replaceFormat.to}
              onChange={(e) =>
                setReplaceFormat((prev) => ({
                  ...prev,
                  to: e.target.value,
                }))
              }
              className={ui.input}
            >
              {formatOptions.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Apply */}
          <button
            disabled={replaceFormat.from === replaceFormat.to}
            onClick={() => setReplaceConfirmOpen(true)}
            className={`
              ${ui.buttonSm} h-6 px-2 !rounded-lg hover:bg-purple-500
              disabled:opacity-40
              disabled:cursor-not-allowed
            `}
          >
            Apply
          </button>
        </div>

        {/* Btn clear all formatting */}
        <button
          title="Supprimer toutes les mises en forme du document"
          onClick={() => requestStrip(null)}
          className={`${ui.buttonSm} h-6 w-10 !rounded-lg`}
        >
          <Eraser size={20} />
        </button>
      </div>

      {/* 2. ----------BLOCK LIST-------------- */}
      <div className="space-y-2 w-full">
        {displayBlocks.map((block) => {
          const progression = song?.progressions.find(
            (p) => p.id === block.progression_id,
          );

          const theme = getTheme(progression?.theme);

          return (
            <div
              key={block.id}
              ref={(el) => {
                blockRefs.current[block.id] = el;
              }}
              data-block-id={block.id}
              style={{
                transform: `
                  translate3d(
                    ${draggedBlockId === block.id ? "1rem" : "0px"},
                    ${blockTransforms[block.id] ?? 0}px,
                    0
                  )
                  ${draggedBlockId === block.id ? "scale(1.02)" : "scale(1)"}
                `,
                transition:
                  blockTransforms[block.id] !== undefined
                    ? "none"
                    : "transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
              className={`
                ${ui.section}
                py-1
                w-full
                relative
                overflow-hidden
                ${
                  draggedBlockId === block.id
                    ? `
                      opacity-90
                      z-50
                      shadow-2xl
                      shadow-purple-500/30
                      ring-1
                      ring-purple-400/40
                    `
                    : `
                      opacity-100
                    `
                }
              `}
            >
              <div className="relative z-10">
                {/* DRAG HANDLE */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, block.id)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  className={`
                    absolute
                    left-1
                    top-1/2
                    -translate-y-1/2
                    p-1
                    rounded
                    select-none
                    touch-none
                    transition-all
                    duration-150
                    ${
                      draggedBlockId === block.id
                        ? `
                          text-purple-200
                          bg-purple-500/30
                          scale-110
                          cursor-grabbing
                        `
                        : `
                          text-purple-400
                          cursor-grab
                          hover:bg-white/5
                          hover:text-purple-200
                        `
                    }
                  `}
                  title="Déplacer le block"
                >
                  <GripVertical size={18} />
                </div>

                {/* ---------VISIBLE BAR-------------- */}

                <div className="flex gap-4 w-full items-center justify-between pl-6">
                  {/* BLOCK 1 */}
                  <div className="flex gap-4 w-136">
                    {/* BTN TOGGLE */}
                    <div className="flex">
                      <button
                        onClick={() => toggleBlock(block.id)}
                        className="text-white hover:text-purple-400 cursor-pointer"
                      >
                        {openBlockId === block.id ? (
                          <ChevronDown />
                        ) : (
                          <ChevronRight />
                        )}
                      </button>
                    </div>

                    {/* BADGE */}
                    <div
                      className={`
                    ${styles.index}
                    ${theme.badgeColor}
                    relative
                    overflow-hidden
                    w-22
                  `}
                    >
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/30" />

                      {/* Content */}
                      <span className="relative z-10 select-none">
                        {block.display_label === "full"
                          ? progression.label
                          : `${progression.label?.charAt(0)}${progression.position}`}
                      </span>
                    </div>

                    {/* PROGRESSION */}
                    <div className="w-28">
                      <select
                        value={block.progression_id}
                        onChange={(e) =>
                          updateBlock(block.id, {
                            progression_id: Number(e.target.value),
                          })
                        }
                        className={`${ui.input}`}
                      >
                        {song.progressions.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label} {p.position}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* LABEL SIZE */}
                    <div className="w-28">
                      <select
                        value={block.display_label || "short"}
                        onChange={(e) =>
                          updateBlock(block.id, {
                            display_label: e.target.value,
                          })
                        }
                        className={`${ui.input} `}
                      >
                        <option value="short">Court</option>

                        <option value="full">Entier</option>
                      </select>
                    </div>
                  </div>

                  {/* BLOCK 2 */}
                  <div className="flex gap-4 ">
                    {/* CHORDS */}
                    <div className="flex items-center gap-4 text-white pt-1">
                      {/* Show */}
                      <button
                        title="Montrer les accords"
                        onClick={() =>
                          updateBlock(block.id, { show_chords: 1 })
                        }
                        className={`hover:text-blue-400
                        ${block.show_chords ? "text-blue-400" : "text-zinc-500"}
                      `}
                      >
                        <Music4 size={18} className="cursor-pointer" />
                      </button>

                      {/* Hide */}
                      <button
                        title="Cacher les accords"
                        onClick={() =>
                          updateBlock(block.id, { show_chords: 0 })
                        }
                        className={`
                        hover:text-purple-400
                        ${
                          !block.show_chords
                            ? "text-purple-400"
                            : "text-zinc-500"
                        }
                      `}
                      >
                        <EyeOff size={18} className="cursor-pointer" />
                      </button>
                    </div>

                    {/* MB */}
                    <div className="flex items-center p-1 text-white gap-2 border border-purple-300 rounded-lg">
                      {/* - */}
                      <button
                        title="Réduire l'espace après ce block"
                        onClick={() =>
                          updateBlock(block.id, {
                            mb: Math.max(0, (block.mb ?? 0) - 4),
                          })
                        }
                        className="hover:text-red-400 leading-none"
                      >
                        <Minus size={16} className=" cursor-pointer" />
                      </button>

                      {/* Value */}
                      <div className="relative h-4 w-6 overflow-hidden">
                        <div
                          key={block.mb}
                          className="absolute inset-0 flex items-center justify-center animate-slide-up"
                        >
                          {block.mb ?? 0}
                        </div>
                      </div>

                      {/* + */}
                      <button
                        title="Augmenter l'espace après ce block"
                        onClick={() =>
                          updateBlock(block.id, {
                            mb: (block.mb ?? 0) + 4,
                          })
                        }
                        className="hover:text-green-400 leading-none"
                      >
                        <Plus size={16} className=" cursor-pointer" />
                      </button>
                    </div>
                  </div>

                  {/* BLOCK 3 : DELETE */}
                  <div className="text-white flex">
                    <button
                      title="Supprimer le block définitivement"
                      onClick={() =>
                        setDeleteConfirm({
                          open: true,
                          blockId: block.id,
                        })
                      }
                      className="hover:text-red-500 leading-none"
                    >
                      <Trash2 size={18} className="cursor-pointer" />
                    </button>
                  </div>
                </div>

                {/* ---------HIDDEN PART-------------- */}
                {openBlockId === block.id && (
                  <div className="flex gap-4 my-4">
                    {/* LYRICS */}
                    <div className="flex w-136 ">
                      <textarea
                        ref={(el) => {
                          textareaRefs.current[block.id] = el;
                          if (el) {
                            el.style.height = "0px";
                            el.style.height = el.scrollHeight + "px";
                          }
                        }}
                        value={block.content}
                        onChange={(e) => {
                          const value = e.target.value;

                          e.target.style.height = "0px";
                          e.target.style.height = e.target.scrollHeight + "px";

                          setSong((prev) =>
                            updateBlockInSong(prev, block.id, {
                              content: value,
                            }),
                          );
                        }}
                        onBlur={(e) => {
                          if (DEMO_MODE) return;

                          fetch(`/api/lyrics-blocks/${block.id}`, {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              content: e.target.value,
                            }),
                          });
                        }}
                        className={`${ui.input} resize-none overflow-hidden leading-tight py-2 !bg-purple-300 !text-black`}
                        rows={1}
                      />
                    </div>

                    {/* TEXT FORMATTING */}
                    <div className="flex flex-1 justify-around items-center text-white h-6 mt-2">
                      <button
                        title="Gras"
                        onClick={() => wrapSelection(block.id, "b")}
                        className={`${ui.buttonSm} w-6 h-full !rounded-sm`}
                      >
                        <Bold size={16} />
                      </button>

                      <button
                        title="Italique"
                        onClick={() => wrapSelection(block.id, "i")}
                        className={`${ui.buttonSm} w-6 h-full !rounded-sm`}
                      >
                        <Italic size={16} />
                      </button>

                      <button
                        title="Souligner"
                        onClick={() => wrapSelection(block.id, "u")}
                        className={`${ui.buttonSm} w-6 h-full !rounded-sm`}
                      >
                        <Underline size={16} />
                      </button>

                      <button
                        title="Surligner"
                        onClick={() => wrapSelection(block.id, "mark")}
                        className={`${ui.buttonSm} w-6 h-full !rounded-sm`}
                      >
                        <Highlighter size={16} />
                      </button>

                      <button
                        title="Supprimer la mise en forme du block"
                        onClick={() => requestStrip(block.id)}
                        className={`${ui.buttonSm} w-6 h-full !rounded-sm`}
                      >
                        <Eraser size={16} />
                      </button>

                      <button
                        title="Supprimer la mise en forme sélectionnée"
                        onClick={() => clearSelectionFormatting(block.id)}
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
        })}

        {/* ADD BLOCK */}
        <div className="flex justify-center">
          <button
            onClick={addBlock}
            className={`${ui.button} w-80 py-2 px-6 m-8 hover:!w-80`}
          >
            + Ajouter un block
          </button>
        </div>
      </div>

      {/* CONFIRMATION MODALS */}
      <ConfirmModal
        open={confirmState.open}
        title="Attention"
        message={
          confirmState.blockId
            ? "Supprimer la mise en forme de ce block ?"
            : "Supprimer la mise en forme de tous les blocks ?"
        }
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={loading}
      />

      <ConfirmModal
        open={replaceConfirmOpen}
        title="Attention"
        message={`
          Remplace tous les ${getFormatLabel(replaceFormat.from)}
          par ${getFormatLabel(replaceFormat.to)}
          dans tous les blocks?
          `}
        onCancel={() => setReplaceConfirmOpen(false)}
        onConfirm={async () => {
          await replaceFormattingTags(replaceFormat.from, replaceFormat.to);

          setReplaceConfirmOpen(false);
        }}
      />

      <ConfirmModal
        open={deleteConfirm.open}
        title="Attention"
        message="Supprimer ce block définitivement ?"
        onCancel={() =>
          setDeleteConfirm({
            open: false,
            blockId: null,
          })
        }
        onConfirm={async () => {
          await deleteBlock(deleteConfirm.blockId);

          setDeleteConfirm({
            open: false,
            blockId: null,
          });
        }}
      />
    </div>
  );
}
