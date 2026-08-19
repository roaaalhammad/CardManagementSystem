import { useRef } from "react";

export default function FileUpload({
  currentImageUrl,
  selectedFileName,
  onFileSelected,
  accept = "image/png,image/jpeg",
}) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected?.(file);
  };

  return (
    <div className="flex flex-col gap-6 font-arabic">
      <div>
        <p className="mb-2 text-sm font-bold text-gray-800">تنزيل الصورة:</p>
        {currentImageUrl ? (
          <a href={currentImageUrl} download className="inline-block rounded-lg bg-gold px-6 py-2 text-sm font-medium text-white hover:bg-gold-dark">
            تنزيل الصورة
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-block cursor-not-allowed rounded-lg bg-gray-200 px-6 py-2 text-sm font-medium text-gray-400"
          >
            تنزيل الصورة
          </button>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-bold text-gray-800">ارفاق صورة الشخصية الجديدة:</p>
        <div className="flex items-center justify-between overflow-hidden rounded-lg border border-gray-300">
          <span className="flex-1 px-3 py-2 text-right text-sm text-gray-500">
            {selectedFileName || "لم يتم اختيار اي صورة"}
          </span>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="whitespace-nowrap bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            اختر صورة
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}