import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "../../components/DataTable";
import StatusTimeline from "../../components/StatusTimeline";

const STORAGE_KEY = "cardRequests";

const TABS = [
  "الطلبات الجديدة",
  "الطلبات تحت الإجراء",
  "الطلبات السابقة",
];

/* =========================================================
   بيانات تجريبية
========================================================= */

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
    employeeNumber: 6615933,
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

/* =========================================================
   Component
========================================================= */

export default function ManagerRequestsList() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [requests, setRequests] = useState([]);

  /* =======================================================
     قراءة الطلبات من localStorage
  ======================================================= */

  const loadRequests = () => {
    try {
      const savedRequests = localStorage.getItem(STORAGE_KEY);

      if (!savedRequests) {
        setRequests(MOCK_REQUESTS);
        return;
      }

      const parsedRequests = JSON.parse(savedRequests);

      if (!Array.isArray(parsedRequests)) {
        setRequests(MOCK_REQUESTS);
        return;
      }

      /*
       * الطلبات الجديدة من الموظف
       * تظهر أولاً ثم الطلبات التجريبية
       */

      setRequests([
        ...parsedRequests,
        ...MOCK_REQUESTS.filter(
          (mock) =>
            !parsedRequests.some(
              (request) => Number(request.id) === Number(mock.id)
            )
        ),
      ]);
    } catch (error) {
      console.error("تعذر تحميل الطلبات:", error);
      setRequests(MOCK_REQUESTS);
    }
  };

  /* =======================================================
     عند فتح الصفحة
  ======================================================= */

  useEffect(() => {
    loadRequests();
  }, []);

  /* =======================================================
     تحديث القائمة عند العودة للصفحة
  ======================================================= */

  useEffect(() => {
    const handleStorage = () => {
      loadRequests();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  /* =======================================================
     تصفية الطلبات حسب التبويب
  ======================================================= */

  const filteredRequests = useMemo(() => {
    if (activeTab === "الطلبات الجديدة") {
      return requests.filter(
        (request) =>
          request.status === "طلب جديد" ||
          request.status === "قيد الإجراء" ||
          request.status === "جاهزة للتسليم" ||
          !request.isFinal
      );
    }

    if (activeTab === "الطلبات تحت الإجراء") {
      return requests.filter(
        (request) =>
          request.status === "قيد الإجراء" ||
          (!request.isFinal && request.status !== "جاهزة للتسليم")
      );
    }

    if (activeTab === "الطلبات السابقة") {
      return requests.filter((request) => request.isFinal === true);
    }

    return requests;
  }, [requests, activeTab]);

  /* =======================================================
     أعمدة الجدول
  ======================================================= */

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
      render: (row) => {
        if (row.isFinal) {
          return (
            <span className="block text-center text-xs text-gray-700">
              {row.status}
            </span>
          );
        }

        return (
          <StatusTimeline
            stages={row.stages || ["none", "none", "none"]}
          />
        );
      },
    },
    { key: "date", header: "التاريخ" },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/manager/requests/${row.id}`)}
            className="rounded-lg bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
          >
            عرض
          </button>
        </div>
      ),
    },
  ];

  /* =======================================================
     Render
  ======================================================= */

  return (
    <div dir="rtl" className="p-6 font-arabic">
      {/* العنوان */}
      <h1 className="mb-4 text-xl font-bold text-brand-teal-800">
        جميع الطلبات
      </h1>

      {/* ===================================================
          البحث + التبويبات
      =================================================== */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {/* البحث */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="بحث..."
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-brand-teal-600"
          />

          <select className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none">
            <option>حالة الطلب</option>
            <option>طلب جديد</option>
            <option>قيد الإجراء</option>
            <option>جاهزة للتسليم</option>
            <option>تم تسليم البطاقة</option>
            <option>تم رفض الطلب</option>
          </select>
        </div>

        {/* التبويبات */}
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
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

      {/* ===================================================
          الجدول
      =================================================== */}
      <DataTable columns={columns} rows={filteredRequests} />

      {/* ===================================================
          أسفل الجدول
      =================================================== */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>
            {filteredRequests.length > 0
              ? `١ - ${filteredRequests.length} من اصل ${filteredRequests.length}`
              : "٠ طلب"}
          </span>

          <div className="flex items-center gap-2" dir="ltr">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            >
              ‹
            </button>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-white"
            >
              1
            </button>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-200"
            >
              ›
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full border-2 border-gray-300 bg-white" />
            لم تبدأ بعد
          </span>

          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full border-2 border-blue-500 bg-white" />
            تحت الإجراء
          </span>

          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full border-2 border-green-500 bg-green-500" />
            تم الموافقة
          </span>
        </div>
      </div>
    </div>
  );
}