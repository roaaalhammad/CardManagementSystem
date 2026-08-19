import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Dialog from "../../components/Dialog";
import FileUpload from "../../components/FileUpload";
import { apiGet, apiPostForm, apiPost, apiGetBlob } from "../../utils/api";

export default function CardDesign() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editPhotoOpen, setEditPhotoOpen] = useState(false);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [photoSrc, setPhotoSrc] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  async function loadPhoto(photoUrl) {
    if (!photoUrl) {
      setPhotoSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }
    try {
      const relativePath = photoUrl.replace(/^\/api/, "");
      const blob = await apiGetBlob(relativePath);
      const objectUrl = URL.createObjectURL(blob);
      setPhotoSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });
    } catch {
      setPhotoSrc(null);
    }
  }

  const loadDesign = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet(`/cardrequests/${id}/design`);
      setCard(data);
      await loadPhoto(data.photoUrl);
    } catch (err) {
      setError(err.message || "تعذر تحميل بيانات البطاقة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDesign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    return () => {
      if (photoSrc) URL.revokeObjectURL(photoSrc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSavePhoto() {
    setSaving(true);
    setActionError("");
    try {
      const formData = new FormData();
      formData.append("nameAr", card.nameAr);
      formData.append("nameEn", card.nameEn);
      formData.append("jobTitle", card.jobTitle);
      if (newPhotoFile) {
        formData.append("photo", newPhotoFile);
      }
      await apiPostForm(`/cardrequests/${id}/design`, formData);
      await loadDesign();
      setEditPhotoOpen(false);
      setNewPhotoFile(null);
    } catch (err) {
      setActionError(err.message || "تعذر حفظ الصورة");
    } finally {
      setSaving(false);
    }
  }

  async function handlePrint() {
    setActionError("");
    try {
      await apiPost(`/cardrequests/${id}/design/lock`, {});
      const blob = await apiGetBlob(`/cardrequests/${id}/design/pdf`);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `card-${id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      await loadDesign();
    } catch (err) {
      setActionError(err.message || "تعذر إتمام الطباعة");
    }
  }

  if (loading) return <p className="p-6 text-center text-sm text-gray-500">جاري التحميل...</p>;
  if (error || !card) return <p className="p-6 text-center text-sm text-red-600">{error || "تعذر تحميل البطاقة"}</p>;

  return (
    <div className="p-6 font-arabic">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 border-b pb-4 text-center text-lg font-bold text-brand-teal-800">طباعة البطاقة</h1>

        <div
          className="relative mx-auto mb-4 w-full overflow-hidden bg-contain bg-top bg-no-repeat"
          style={{
            backgroundImage: "url('/src/assets/card-template.png')",
            aspectRatio: "1370 / 2156",
          }}
        >
          <div
            className="absolute overflow-hidden rounded-full"
            style={{
              top: "38.3%",
              left: "50%",
              width: "42%",
              aspectRatio: "1 / 1",
              transform: "translate(-50%, -50%)",
            }}
          >
            {photoSrc ? (
              <img src={photoSrc} alt="الصورة الشخصية" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-4xl text-gray-300">👤</div>
            )}
          </div>

          <div className="absolute inset-x-0 text-center" style={{ top: "56%" }}>
            <p className="text-base font-bold text-gray-800">{card.nameAr}</p>
            <p className="text-sm text-gray-600">{card.nameEn}</p>
            <p className="mt-2 text-sm font-medium text-gold-700">{card.jobTitle}</p>

            <div className="mt-4 space-y-1.5 text-sm text-gray-700">
              <p>السجل المدني: {card.nationalId}</p>
              <p>الرقم الوظيفي: {card.employeeNumber}</p>
            </div>

            <div className="mt-20 flex items-center justify-between px-2 text-sm text-gray-700">
              <span className="text-white">نسخة: {card.copyNumber}</span>
              <span>{card.department}</span>
            </div>

            <p className="mt-2 px-2 text-right text-xs text-gray-800">
              تاريخ الإصدار: {card.issueDate ? new Date(card.issueDate).toLocaleDateString("en-GB") : "-"}
            </p>
          </div>
        </div>


        {actionError && <p className="mb-4 text-center text-sm text-red-600">{actionError}</p>}

        {!card.isLocked && (
          <>
            <p className="mb-4 text-xs text-black">
              <span className="text-red-500">*</span> ملاحظة: لتعديل الصورة، يرجى استكمال الإجراءات بالضغط على زر "تعديل الصورة" :
            </p>

            <div className="mb-4 flex justify-center">
              <button
                onClick={() => setEditPhotoOpen(true)}
                className="rounded-lg bg-gold px-6 py-2 text-sm font-medium text-white hover:bg-gold-dark"
              >
                تعديل الصورة
              </button>
            </div>
          </>
        )}

        <div className="flex justify-center gap-8">
          <button
            onClick={() => navigate(`/requests/${id}`)}
            className="rounded-lg bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            onClick={handlePrint}
            disabled={card.isLocked}
            className="rounded-lg bg-gold px-6 py-2 text-sm font-medium text-white hover:bg-gold-dark disabled:opacity-50"
          >
            طباعة
          </button>
        </div>

        <button
          onClick={() => navigate(`/requests/${id}`)}
          className="mt-4 block text-right text-sm text-gray-500 hover:text-brand-teal-700"
        >
          العودة الى القائمة {">>"}
        </button>
      </div>

      <Dialog
        open={editPhotoOpen}
        title="تعديل الصورة"
        onClose={() => setEditPhotoOpen(false)}
        actions={
          <>
            <button onClick={() => setEditPhotoOpen(false)} className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
              إلغاء
            </button>
            <button
              disabled={saving}
              onClick={handleSavePhoto}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark disabled:opacity-50"
            >
              حفظ
            </button>
          </>
        }
      >
        <FileUpload currentImageUrl={photoSrc} onFileSelected={(file) => setNewPhotoFile(file)} />
      </Dialog>
    </div>
  );
}
