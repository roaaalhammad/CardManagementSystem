import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Dialog from "../../components/Dialog";
import FileUpload from "../../components/FileUpload";
import cardTemplate from "../../assets/card-template.png";

const MOCK_CARD = {
  nameAr: "فاطمة محمد بن عبدالعزيز المحيميد",
  nameEn: "Fatimah mohameed AlMohaimeed",
  jobTitle: "مطور برامج متقدم أول",
  nationalId: "1010223377",
  employeeNumber: "6615933",
  department: "الادارة العامة لتقنية المعلومات",
  issueDate: "30/10/2024",
  copyNumber: "3",
  photoUrl: null,
};

export default function CardDesign() {
  const [card, setCard] = useState(MOCK_CARD);
  const [editPhotoOpen, setEditPhotoOpen] = useState(false);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  function handleSavePhoto() {
    if (newPhotoFile) {
      setCard((c) => ({ ...c, photoUrl: URL.createObjectURL(newPhotoFile) }));
    }
    setEditPhotoOpen(false);
    setNewPhotoFile(null);
  }

  return (
    <div className="p-6 font-arabic">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 border-b pb-4 text-center text-lg font-bold text-brand-teal-800">
          طباعة البطاقة
        </h1>

        <div className="relative mx-auto mb-4 aspect-[685/1078] w-full overflow-hidden rounded-xl border border-gold-200">
          <img src={cardTemplate} alt="قالب البطاقة" className="absolute inset-0 h-full w-full object-cover" />

          <div className="absolute left-1/2 top-[25%] w-[40%] -translate-x-1/2">
            <div className="aspect-square w-full overflow-hidden rounded-full">
              {card.photoUrl ? (
                <img src={card.photoUrl} alt="الصورة الشخصية" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-4xl text-gray-300">
                  👤
                </div>
              )}
            </div>
          </div>

          <div className="absolute left-1/2 top-[58%] w-[88%] -translate-x-1/2 text-center">
            <p className="text-base font-bold text-gray-800">{card.nameAr}</p>
            <p className="text-sm text-gray-600">{card.nameEn}</p>
            <p className="mt-2 text-sm font-medium text-gold-700">{card.jobTitle}</p>

            <div className="mt-4 space-y-1.5 text-sm text-gray-700">
              <p>السجل المدني: {card.nationalId}</p>
              <p>الرقم الوظيفي: {card.employeeNumber}</p>
            </div>
          </div>

          <div className="absolute bottom-[5%] right-[2%] text-[10px] font-medium text-white">
            <p>نسخة: {card.copyNumber}</p>
          </div>

          <div className="absolute bottom-[5%] left-[27%] text-[10px] font-medium text-black">
            <p>{card.department}</p>
          </div>

          <div className="absolute bottom-[1%] right-[8%] w-[60%] text-right text-[10px] text-gray-600">
            <p>تاريخ إصدار البطاقة: {card.issueDate}</p>
          </div>
        </div>

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

        <div className="flex justify-center gap-8">
          <button className="rounded-lg bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
            إلغاء
          </button>
          <button className="rounded-lg bg-gold px-6 py-2 text-sm font-medium text-white hover:bg-gold-dark">
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
            <button
              onClick={() => setEditPhotoOpen(false)}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              onClick={handleSavePhoto}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark"
            >
              حفظ
            </button>
          </>
        }
      >
        <FileUpload
          currentImageUrl={card.photoUrl}
          onFileSelected={(file) => setNewPhotoFile(file)}
        />
      </Dialog>
    </div>
  );
}