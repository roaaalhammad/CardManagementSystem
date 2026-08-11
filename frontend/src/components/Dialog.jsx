export default function Dialog({ open, title, children, onClose, actions }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-cream p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="mb-4 text-lg font-bold text-brand-teal-800">{title}</h2>
        )}

        <div className="text-sm text-gray-700">{children}</div>

        <div className="mt-6 flex justify-center gap-3">
          {actions ?? (
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              إغلاق
            </button>
          )}
        </div>
      </div>
    </div>
  );
}