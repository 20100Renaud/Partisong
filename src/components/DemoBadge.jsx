import { useState } from "react";
import { InfoModal } from "./Modal";

export default function DemoBadge() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          fixed top-14 mt-1 left-1/2 -translate-x-1/2 z-[9999]
          rounded-full
          bg-purple-500/20
          border border-purple-500/40
          px-4 py-2
          text-xs text-purple-300
          backdrop-blur
          cursor-pointer
          hover:bg-purple-500/30
          transition-colors
        "
      >
        Demo · Lecture seule
      </button>

      <InfoModal
        open={open}
        onClose={() => setOpen(false)}
        title="Mode démo"
        message="Vous pouvez tester l'application librement. Les modifications sont temporaires et seront perdues si vous rechargez la page."
      />
    </>
  );
}
