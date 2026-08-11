const STATUS_STYLES = {
  "جديد": "bg-gray-100 text-gray-700",
  "قيد مراجعة المدير المباشر": "bg-gold-100 text-gold-700",
  "مرفوض من المدير المباشر": "bg-red-100 text-red-700",
  "قيد مراجعة إدارة التواصل الداخلي": "bg-gold-100 text-gold-700",
  "مرفوض من إدارة التواصل الداخلي": "bg-red-100 text-red-700",
  "قيد إعداد البطاقة": "bg-blue-100 text-blue-700",
  "قيد الاعتماد النهائي": "bg-gold-100 text-gold-700",
  "مرفوض نهائيًا": "bg-red-100 text-red-700",
  "بانتظار التسليم": "bg-blue-100 text-blue-700",
  "تم التسليم": "bg-brand-teal-100 text-brand-teal-800",
  "معاد العهدة": "bg-gray-200 text-gray-700",
  "ملغي": "bg-gray-200 text-gray-500",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium font-arabic ${style}`}>
      {status}
    </span>
  );
}