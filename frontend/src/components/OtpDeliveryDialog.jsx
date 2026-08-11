import { useState } from "react";
import Dialog from "./Dialog";
import OtpInput from "./OtpInput";

export default function OtpDeliveryDialog({ open, onClose, onConfirm, employeeNationalId }) {
  const [otp, setOtp] = useState("");

  function handleResend() {
    setOtp("");
    // TODO: نادي API إعادة إرسال OTP لما يجهز الباك اند
  }

  function handleConfirm() {
    if (otp.length === 4) {
      onConfirm?.(otp);
      setOtp("");
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      actions={
        <>
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            onClick={handleResend}
            className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark"
          >
            ارسال الرمز
          </button>
          <button
            onClick={handleConfirm}
            disabled={otp.length !== 4}
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
         <span className="text-red-500">*</span> لتسليم البطاقة، يرجى إدخال الرمز المكون من 4 أرقام الذي تم إرساله للموظف
          <br />
          هوية: {employeeNationalId}
            </p>
        
        <OtpInput length={4} value={otp} onChange={setOtp} />
      </div>
    </Dialog>
  );
}