import { useState } from "react";
import Dialog from "./Dialog";
import OtpInput from "./OtpInput";
import { apiPost } from "../utils/api";

export default function OtpDeliveryDialog({ open, onClose, onDelivered, requestId, employeeNationalId }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setOtp("");
    setError("");
    onClose?.();
  }

  async function handleConfirm() {
    if (otp.length !== 4) return;
    setSubmitting(true);
    setError("");
    try {
      await apiPost(`/cardrequests/${requestId}/deliver`, { code: otp });
      setOtp("");
      onDelivered?.();
    } catch (err) {
      setError(err.message || "تعذر تسليم البطاقة");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      actions={
        <>
          <button onClick={handleClose} className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting || otp.length !== 4}
            className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark disabled:opacity-50"
          >
            موافق
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-5xl">📨</span>
        <h2 className="text-lg font-bold text-gray-800">تحقق</h2>
        <p className="text-sm text-gray-600">
          <span className="text-red-500">*</span> يرجى إدخال رمز التحقق المكون من 4 أرقام الذي ظهر عند قبول الطلب
          <br />
          هوية: {employeeNationalId}
        </p>

        <OtpInput length={4} value={otp} onChange={setOtp} />

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Dialog>
  );
}
