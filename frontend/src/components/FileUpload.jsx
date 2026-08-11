import { useRef } from "react";

export default function FileUpload({ currentImageUrl, onFileSelected, accept = "image/png,image/jpeg" }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected?.(file);
  };

  return (
    <div className="flex flex-col items-center gap-3 font-arabic">
      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gold-400 bg-gold-50">
        {currentImageUrl ? (
          <img src={currentImageUrl} alt="الصورة الشخصية" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-gray-500">لم يتم اختيار صورة</span>
        )}
      </div>

      <div className="flex gap-2">
        {currentImageUrl && (
            <a  
            href={currentImageUrl}
            download
            className="rounded-lg border border-brand-teal-700 px-3 py-1.5 text-xs font-medium text-brand-teal-700 hover:bg-brand-teal-50"
          >
            تنزيل الصورة الحالية
          </a>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-gold px-3 py-1.5 text-xs font-medium text-white hover:bg-gold-dark"
        >
          رفع صورة بديلة
        </button>
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
