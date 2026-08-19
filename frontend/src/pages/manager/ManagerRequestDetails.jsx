import { useState } from "react";
import Dialog from "../../components/Dialog";
import { useParams, useNavigate } from "react-router-dom";

const MOCK_REQUEST = {
  photo: null,
  nameAr: "فاطمه محمد عبدالعزيز المحيميد",
  nameEn: "Fatimah Mohameed AlMohaimeed",
  nationalId: "1010223377",
  employeeNumber: "6615933",
  phone: "0596123532",
  nationality: "سعودي",
  department: "امانة منطقة القصيم",
  grade: "14",
  jobTitle: "مطور برامج متقدم أول",
  issueReason: "بدل فاقد",
  status: "جديد",
};

function Field({ label, value }) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-56 shrink-0 text-right text-sm font-medium text-gray-700">
        {label}:
      </span>
      <div className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-sm text-gray-600">
        {value}
      </div>
    </div>
  );
}

export default function ManagerRequestDetails() {
  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 font-arabic">
      <div className="mx-auto max-w-4xl rounded-2xl border-t-4 border-gold-400 bg-cream p-8 shadow-lg">
        <div className="mb-8 border-b border-gray-200 pb-4 text-center">
          <h1 className="text-lg font-bold text-gray-800">بيانات الطلب {id}</h1>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-6">
            <span className="w-56 shrink-0 text-right text-sm font-medium text-gray-700">
              الصورة الشخصية:
            </span>
            <div className="flex h-28 w-28 items-center justify-center rounded-lg border border-gray-300 bg-white">
              <svg viewBox="0 0 100 100" className="h-full w-full text-gray-300" fill="none" stroke="currentColor">
                <rect x="2" y="2" width="96" height="96" />
                <line x1="2" y1="2" x2="98" y2="98" />
                <line x1="98" y1="2" x2="2" y2="98" />
              </svg>
            </div>
          </div>

          <Field label="الاسم الرباعي بالعربي" value={MOCK_REQUEST.nameAr} />
          <Field label="الاسم الرباعي بالأنجليزي" value={MOCK_REQUEST.nameEn} />
          <Field label="السجل المدني" value={MOCK_REQUEST.nationalId} />
          <Field label="الرقم الوظيفي" value={MOCK_REQUEST.employeeNumber} />
          <Field label="رقم الجوال" value={MOCK_REQUEST.phone} />
          <Field label="الجنسية" value={MOCK_REQUEST.nationality} />
          <Field label="جهة العمل" value={MOCK_REQUEST.department} />
          <Field label="المرتبة" value={MOCK_REQUEST.grade} />
          <Field label="المسمى الوظيفي" value={MOCK_REQUEST.jobTitle} />
          <Field label="سبب اصدار بطاقة جديدة" value={MOCK_REQUEST.issueReason} />
          <Field label="حالة الطلب" value={MOCK_REQUEST.status} />
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAccept(true)}
              className="rounded-lg bg-gold px-8 py-2 text-sm font-medium text-white hover:bg-gold-dark"
            >
              قبول
            </button>
            <button
              onClick={() => setShowReject(true)}
              className="rounded-lg bg-gray-300 px-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
            >
              رفض
            </button>
          </div>
          <button
            onClick={() => navigate("/manager")}
            className="text-sm text-gray-500 hover:text-brand-teal-700"
          >
            العودة الى القائمة {">>"}
          </button>
        </div>
      </div>

      <Dialog
        open={showAccept}
        onClose={() => setShowAccept(false)}
        title="هل أنت متأكد من قبول هذا الطلب؟"
        actions={
          <>
            <button
              onClick={() => setShowAccept(false)}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              onClick={() => setShowAccept(false)}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark"
            >
              موافق
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">سيتم إرسال الطلب لإدارة التواصل الداخلي لاستكمال إجراءات إصدار البطاقة.</p>
      </Dialog>

      <Dialog
        open={showReject}
        onClose={() => setShowReject(false)}
        title="الرجاء ادخال البيانات التالية لاكمال رفض الطلب:"
        actions={
          <>
            <button
              onClick={() => setShowReject(false)}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              disabled={!rejectReason.trim()}
              onClick={() => setShowReject(false)}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark disabled:opacity-50"
            >
              موافق
            </button>
          </>
        }
      >
        <label className="mb-2 block text-sm text-gray-600">سبب رفض الطلب:</label>
        <input
          type="text"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-teal-600 focus:outline-none"
        />
      </Dialog>
    </div>
  );
}