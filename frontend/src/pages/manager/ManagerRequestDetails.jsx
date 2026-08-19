import { useEffect, useState } from "react";
import Dialog from "../../components/Dialog";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPut } from "../../utils/api";

function Field({ label, value }) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-56 shrink-0 text-right text-sm font-medium text-gray-700">{label}:</span>
      <div className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-sm text-gray-600">{value || "-"}</div>
    </div>
  );
}

export default function ManagerRequestDetails() {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadRequest() {
      setLoading(true);
      setError("");
      try {
        const data = await apiGet(`/cardrequests/${id}`);
        setRequest(data);
      } catch (err) {
        setError(err.message || "تعذر تحميل بيانات الطلب");
      } finally {
        setLoading(false);
      }
    }
    loadRequest();
  }, [id]);

  async function handleDecision(decisionValue, notes) {
    setSubmitting(true);
    setActionError("");
    try {
      await apiPut(`/cardrequests/${id}/manager-decision`, { decision: decisionValue, notes });
      setShowAccept(false);
      setShowReject(false);
      navigate("/manager/requests");
    } catch (err) {
      setActionError(err.message || "تعذر تسجيل القرار");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-6 text-center text-sm text-gray-500">جاري التحميل...</p>;
  if (error || !request) return <p className="p-6 text-center text-sm text-red-600">{error || "الطلب غير موجود"}</p>;

  const canDecide = request.status === "قيد المراجعة";

  return (
    <div className="p-6 font-arabic">
      <div className="mx-auto max-w-4xl rounded-2xl border-t-4 border-gold-400 bg-cream p-8 shadow-lg">
        <div className="mb-8 border-b border-gray-200 pb-4 text-center">
          <h1 className="text-lg font-bold text-gray-800">بيانات الطلب {id}</h1>
        </div>

        <div className="flex flex-col gap-5">
          <Field label="الاسم الرباعي بالعربي" value={request.employeeNameAr} />
          <Field label="الاسم الرباعي بالأنجليزي" value={request.employeeNameEn} />
          <Field label="السجل المدني" value={request.employeeNationalId} />
          <Field label="الرقم الوظيفي" value={request.employeeNumber} />
          <Field label="جهة العمل" value={request.department} />
          <Field label="المسمى الوظيفي" value={request.jobTitle} />
          <Field label="نوع الطلب" value={request.requestType} />
          <Field label="حالة الطلب" value={request.status} />
        </div>

        {request.approvals?.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-4">
            <h2 className="mb-3 text-sm font-bold text-gray-700">سجل القرارات</h2>
            <div className="flex flex-col gap-2">
              {request.approvals.map((a, i) => (
                <div key={i} className="rounded-lg bg-gray-100 px-4 py-2 text-xs text-gray-600">
                  {a.approvalStage === "DirectManager" ? "المدير المباشر" : "التواصل الداخلي"}: {a.decision === "Approved" ? "موافقة" : "رفض"}
                  {a.notes ? ` — ${a.notes}` : ""} — {a.approverNameAr}
                </div>
              ))}
            </div>
          </div>
        )}

        {actionError && <p className="mt-4 text-sm text-red-600">{actionError}</p>}

        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {canDecide && (
              <>
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
              </>
            )}
          </div>
          <button onClick={() => navigate("/manager/requests")} className="text-sm text-gray-500 hover:text-brand-teal-700">
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
            <button onClick={() => setShowAccept(false)} className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
              إلغاء
            </button>
            <button
              disabled={submitting}
              onClick={() => handleDecision("Approved", "موافق")}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark disabled:opacity-50"
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
            <button onClick={() => setShowReject(false)} className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
              إلغاء
            </button>
            <button
              disabled={!rejectReason.trim() || submitting}
              onClick={() => handleDecision("Rejected", rejectReason)}
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
