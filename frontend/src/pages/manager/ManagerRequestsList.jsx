import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "../../components/DataTable";
import StatusTimeline from "../../components/StatusTimeline";
import { apiGet } from "../../utils/api";

const TABS = ["الطلبات الجديدة", "الطلبات تحت الإجراء", "الطلبات السابقة"];

const STAGES_BY_STATUS = {
  "قيد المراجعة": ["progress", "none", "none"],
  "قيد مراجعة التواصل الداخلي": ["done", "progress", "none"],
  "بانتظار التسليم": ["done", "done", "progress"],
  "تم التسليم": ["done", "done", "done"],
  "مرفوض من المدير المباشر": ["done", "none", "none"],
  "مرفوض من التواصل الداخلي": ["done", "done", "none"],
};

const FINAL_STATUSES = ["تم التسليم", "مرفوض من المدير المباشر", "مرفوض من التواصل الداخلي"];

function formatDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("ar-SA", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function ManagerRequestsList() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRequests() {
      setLoading(true);
      setError("");
      try {
        const data = await apiGet("/cardrequests");
        if (cancelled) return;

        setRequests(
          data.map((r) => ({
            id: r.requestId,
            type: r.requestType,
            name: r.employeeNameAr,
            nationalId: r.employeeNationalId,
            employeeNumber: r.employeeNumber,
            status: r.status,
            date: formatDate(r.submittedAt),
            isFinal: FINAL_STATUSES.includes(r.status),
            stages: STAGES_BY_STATUS[r.status] || ["none", "none", "none"],
          }))
        );
      } catch (err) {
        if (!cancelled) setError(err.message || "تعذر تحميل الطلبات");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadRequests();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRequests = useMemo(() => {
    if (activeTab === "الطلبات الجديدة") {
      return requests.filter((r) => r.status === "قيد المراجعة");
    }
    if (activeTab === "الطلبات تحت الإجراء") {
      return requests.filter((r) => r.status === "قيد مراجعة التواصل الداخلي" || r.status === "بانتظار التسليم");
    }
    if (activeTab === "الطلبات السابقة") {
      return requests.filter((r) => r.isFinal);
    }
    return requests;
  }, [requests, activeTab]);

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
          return <span className="block text-center text-xs text-gray-700">{row.status}</span>;
        }
        return <StatusTimeline stages={row.stages} />;
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

  return (
    <div dir="rtl" className="p-6 font-arabic">
      <h1 className="mb-4 text-xl font-bold text-brand-teal-800">جميع الطلبات</h1>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="بحث..."
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-brand-teal-600"
          />
          <select className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none">
            <option>حالة الطلب</option>
            <option>قيد المراجعة</option>
            <option>قيد مراجعة التواصل الداخلي</option>
            <option>بانتظار التسليم</option>
            <option>تم التسليم</option>
          </select>
        </div>

        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                activeTab === tab ? "bg-gold text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="py-8 text-center text-sm text-gray-500">جاري التحميل...</p>}
      {!loading && error && <p className="py-8 text-center text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <DataTable columns={columns} rows={filteredRequests} />

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>
              {filteredRequests.length > 0
                ? `١ - ${filteredRequests.length} من اصل ${filteredRequests.length}`
                : "٠ طلب"}
            </span>

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
        </>
      )}
    </div>
  );
}
