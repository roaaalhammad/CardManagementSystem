import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable";
import StatusTimeline from "../../components/StatusTimeline";
import OtpDeliveryDialog from "../../components/OtpDeliveryDialog";

const TABS = ["الطلبات الجديدة", "الطلبات تحت الإجراء", "الطلبات السابقة"];

const MOCK_REQUESTS = [
  {
    id: 418,
    type: "تعديل بطاقة",
    name: "ياسر بن عبدالرحمن سليمان الحميضي",
    nationalId: 1133667799,
    employeeNumber: 1234,
    status: "تم تسليم البطاقة",
    isFinal: true,
    stages: ["done", "done", "done"],
    date: "29/10/2024",
  },
  {
    id: 417,
    type: "طلب بطاقة جديدة",
    name: "فاطمه محمد بن عبدالعزيز المحيميد",
    nationalId: 1010223377,
    employeeNumber: 1234,
    status: "قيد الإجراء",
    isFinal: false,
    stages: ["progress", "none", "none"],
    date: "29/10/2024",
  },
  {
    id: 415,
    type: "طلب بطاقة جديدة",
    name: "عادل علي بن محمد المطلق",
    nationalId: 1010304050,
    employeeNumber: 1234,
    status: "جاهزة للتسليم",
    isFinal: false,
    readyForDelivery: true,
    stages: ["done", "done", "done"],
    date: "24/10/2024",
  },
  {
    id: 408,
    type: "طلب بطاقة بدل فاقد",
    name: "عبدالعزيز محمد بن عبدالعزيز المحيميد",
    nationalId: 1133445566,
    employeeNumber: 1234,
    status: "تم رفض الطلب",
    isFinal: true,
    stages: ["done", "none", "none"],
    date: "25/10/2024",
  },
];

export default function RequestsList() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [otpRequest, setOtpRequest] = useState(null);
  const navigate = useNavigate();

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "type", header: "نوع الطلب" },
    { key: "name", header: "اسم الموظف" },
    { key: "nationalId", header: "السجل المدني" },
    { key: "employeeNumber", header: "الرقم الوظيفي" },
    {
      key: "status",
      header: "حالة الطلب",
      align: "center",
      render: (row) =>
        row.isFinal ? (
          <span className="block text-center text-xs text-gray-700">{row.status}</span>
        ) : (
          <StatusTimeline stages={row.stages} />
        ),
    },
    { key: "date", header: "التاريخ" },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.readyForDelivery && (
            <button
              onClick={() => setOtpRequest(row)}
              className="rounded-lg bg-gray-500 px-3 py-1 text-xs font-medium text-white hover:bg-gray-600"
            >
              تسليم
            </button>
          )}
          <button
            onClick={() => navigate(`/requests/${row.id}`)}
            className="rounded-lg bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
          >
            عرض
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 font-arabic">
      <h1 className="mb-4 text-xl font-bold text-brand-teal-800">جميع الطلبات</h1>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="بحث..."
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-teal-600 focus:outline-none"
          />
          <select className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm">
            <option>حالة الطلب</option>
          </select>
        </div>

        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium ${
                activeTab === tab
                  ? "bg-gold text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} rows={MOCK_REQUESTS} />

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>١ - ١٠ من اصل ٢٥</span>
          <div className="flex items-center gap-2" dir="ltr">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
              ‹
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
              3
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
              2
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-white">
              1
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-200">
              ›
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full border-2 border-gray-300 bg-white" /> لم تبدأ بعد
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full border-2 border-blue-500 bg-white" /> تحت الإجراء
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full border-2 border-green-500 bg-green-500" /> تم الموافقة
          </span>
        </div>
      </div>

      <OtpDeliveryDialog
        open={!!otpRequest}
        onClose={() => setOtpRequest(null)}
        onConfirm={() => setOtpRequest(null)}
        employeeNationalId={otpRequest?.nationalId}
      />
    </div>
  );
}