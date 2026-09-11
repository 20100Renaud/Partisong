import { Eraser, ArrowBigRight } from "lucide-react";
import Dropdown_Format from "./Dropdown_Format";
import { styles, ui } from "../styles/styles";
import { formatOptions } from "../constants/page";

export default function LyricsPage_Header({
  toggleFullscreen,
  replaceFormat,
  setReplaceFormat,
  setReplaceConfirmOpen,
  requestStrip,
}) {
  return (
    <>
      {/* PAGE TITLE */}
      <div className="flex flex-col items-center justify-between mb-4">
        <div
          onClick={toggleFullscreen}
          className="flex flex-row justify-center mx-auto cursor-pointer hover:opacity-80 transition"
        >
          <h2 className={styles.h2}>Chan</h2>
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
        <div className="flex justify-center w-full">
          <h3 className={`${styles.h3} !font-thin`}>Mise en forme globale</h3>
        </div>

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

          {/* CLEAR ALL FORMATTING */}
          <button
            type="button"
            title="Supprimer toutes les mises en forme du document"
            onClick={() => requestStrip(null)}
            className={`${ui.buttonSm} h-6 w-10 !rounded-lg`}
          >
            <Eraser size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
