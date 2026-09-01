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
            disabled={loading} // disabled ={DEMO_MODE} :cursor-not-allowed
            className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50"
          >
            {loading ? "..." : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
