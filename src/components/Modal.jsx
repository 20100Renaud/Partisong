import { TriangleAlert } from "lucide-react";

export function ConfirmModal({
  open,
  title = "Confirm action",
  message,
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/60">
      <div className="w-96 rounded-xl border border-zinc-700 bg-zinc-900 p-5 shadow-xl">
        <div className="flex items-center gap-2 text-yellow-400 mb-3">
          <TriangleAlert size={18} />
          <h3 className="text-white font-semibold">{title}</h3>
        </div>

        <p className="text-sm text-zinc-300 mb-5">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50"
          >
            {loading ? "..." : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function InfoModal({ open, title = "Information", message, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-purple-400 mb-3">
          <TriangleAlert size={18} />

          <h3 className="text-white font-semibold">{title}</h3>
        </div>

        <p className="text-sm leading-relaxed text-zinc-300 mb-5">{message}</p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
