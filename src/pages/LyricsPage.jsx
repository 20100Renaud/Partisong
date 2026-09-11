import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getSong, DEMO_MODE } from "../api";
import LyricsBlockEditor from "../components/LyricsBlockEditor";
import { styles, ui } from "../styles/styles";
import { formatOptions } from "../constants/page";
import { ConfirmModal } from "../components/Modal";
import Dropdown_Format from "../components/Dropdown_Format";
import { Eraser, ArrowBigRight } from "lucide-react";
import { motion } from "framer-motion";


export default function LyricsPage(props) {
  const [localSong, setLocalSong] = useState(null);
  const embedded = props.embedded ?? false;
  const setSong = embedded ? props.setSong : setLocalSong;
  const song = embedded ? props.song : localSong;
  const { id } = useParams();
  const toggleFullscreen = props.toggleFullscreen;
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
    from: "b",
    to: "u",
  });

  const [selectedFormat, setSelectedFormat] = useState("b");

  // Toggle
  useEffect(() => {
    if (embedded) return;

    getSong(id).then(setLocalSong).catch(console.error);
  }, [id, embedded]);

  const toggleBlock = (blockId) => {
    setOpenBlockId((prev) => (prev === blockId ? null : blockId));
  };


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

  function handleContentChange(blockId, value) {
    setSong((prev) =>
      updateBlockInSong(prev, blockId, {
        content: value,
      }),
    );
  }

  async function handleContentBlur(blockId, value) {
    if (DEMO_MODE) return;

    await fetch(`/api/lyrics-blocks/${blockId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: value,
      }),
    });
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

  // CLEAR TEXT FORMATTING
  function requestStrip(blockId = null) {
    setConfirmState({
      open: true,
      blockId,
    });
  }

  // OK btn logic
  async function handleConfirm() {
    setLoading(true);
    await stripHtml(confirmState.blockId);
    setConfirmState({ open: false, blockId: null });
    setLoading(false);
  }

  // CANCEL btn logic
  function handleCancel() {
    setConfirmState({ open: false, blockId: null });
  }

  // TRANSFORM TEXT into html
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

  if (!song) return <div>Loading...</div>;

  // STORE POSITIONS
  const blocks = useMemo(() => {
    return [...song.progressions.flatMap((p) => p.lyricsBlocks || [])].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0),
    );
  }, [song?.progressions]);

  // SWITCH BLOCK
  async function moveBlock(blockId, direction) {
    const currentIndex = blocks.findIndex((block) => block.id === blockId);

    if (currentIndex === -1) return;

    const targetIndex = currentIndex + direction;

    if (targetIndex < 0 || targetIndex >= blocks.length) {
      return;
    }

    const reordered = [...blocks];

    [reordered[currentIndex], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[currentIndex],
    ];

    const updates = reordered.map((block, index) => ({
      id: block.id,
      position: index,
    }));

    const positionMap = new Map(
      updates.map((update) => [update.id, update.position]),
    );

    // Optimistic UI update
    setSong((prev) => ({
      ...prev,
      progressions: prev.progressions.map((p) => ({
        ...p,
        lyricsBlocks: (p.lyricsBlocks || []).map((block) => {
          const position = positionMap.get(block.id);

          return position !== undefined ? { ...block, position } : block;
        }),
      })),
    }));

    if (DEMO_MODE) return;

    try {
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
    } catch (error) {
      console.error("Failed to reorder blocks:", error);
    }
  }





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
    <div className="mx-auto max-w-4xl rounded-xl p-10 max-[650px]:p-4">
      {/* 1. ----------------------HEADER------------------------ */}
      {/* PAGE TITLE */}
      <div className="flex flex-col items-center justify-between mb-4">
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

      {/* GLOBAL FORMAT BAR */}
      <div
        className={`${ui.section} flex max-[650px]:flex-col justify-center items-center py-1 mb-4 w-full rounded-2xl relative z-[70]`}
      >
        {
          <div className="flex justify-center w-full">
            <h3 className={`${styles.h3} !font-thin`}>Mise en forme globale</h3>
          </div>
        }

        {/* Switch formatting */}
        <div className="flex items-center gap-2 text-white max-[650px]:p-2">
          {/* FROM */}
          <Dropdown_Format
            value={replaceFormat.from}
            options={formatOptions}
            onChange={(value) =>
              setReplaceFormat((prev) => ({
                ...prev,
                from: value,
              }))
            }
            className="w-11"
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

          <ArrowBigRight size={16} />

          {/* TO */}
          <Dropdown_Format
            value={replaceFormat.to}
            options={formatOptions}
            onChange={(value) =>
              setReplaceFormat((prev) => ({
                ...prev,
                to: value,
              }))
            }
            className="w-11"
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

          {/* APPLY */}
          <button
            disabled={replaceFormat.from === replaceFormat.to}
            onClick={() => setReplaceConfirmOpen(true)}
            className={`
                ${ui.buttonSm}
                h-6 px-2 !rounded-lg
                hover:bg-purple-500
                disabled:opacity-40
                disabled:cursor-not-allowed
              `}
          >
            Appliquer
          </button>

          {/* BTN CLEAR ALL FORMATTING */}
          <button
            title="Supprimer toutes les mises en forme du document"
            onClick={() => requestStrip(null)}
            className={`${ui.buttonSm} h-6 w-10 !rounded-lg`}
          >
            <Eraser size={20} />
          </button>
        </div>
      </div>

      {/* 2. ----------BLOCK LIST-------------- */}
      <div className={`${ui.section}`}>
          {blocks.map((block, index) => {
            const progression = song.progressions.find(
              (p) => p.id === block.progression_id,
            );

            if (!progression) return null;

            return (
              <motion.div
                key={block.id}
                layout="position"
                transition={{
                  layout: {
                    duration: 0.2,
                    ease: "easeInOut",
                  },
                }}
                className="relative"
                style={{
                  marginBottom: `${(block.mb ?? 0) * 4}px`,
                }}
              >
                <LyricsBlockEditor
                  block={block}
                  progression={progression}
                  song={song}
                  isOpen={openBlockId === block.id}
                  selectedFormat={selectedFormat}
                  onFormatChange={setSelectedFormat}
                  onToggle={toggleBlock}
                  onUpdate={updateBlock}
                  onContentChange={handleContentChange}
                  onContentBlur={handleContentBlur}
                  onRequestStrip={requestStrip}
                  onRequestDelete={(blockId) =>
                    setDeleteConfirm({
                      open: true,
                      blockId,
                    })
                  }
                  onMoveUp={() => moveBlock(block.id, -1)}
                  onMoveDown={() => moveBlock(block.id, 1)}
                  canMoveUp={index > 0}
                  canMoveDown={index < blocks.length - 1}
                />
              </motion.div>
            );
          })}
      </div>

      {/* ADD BLOCK */}
      <div className="flex justify-center">
        <button onClick={addBlock} className={`${ui.button} py-2 px-6 m-8`}>
          + Ajouter un block
        </button>
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
