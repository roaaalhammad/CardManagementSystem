import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_REQUESTS = [
  {
    id: 418,
    type: "تعديل بطاقة",
    name: "فاطمه محمد بن عبدالعزيز المحيميد",
    nationalId: "1010223377",
    employeeNumber: "6615933",
    status: "تم تسليم البطاقة",
    statusType: "approved",
    date: "29/10/2024",
  },
  {
    id: 417,
    type: "طلب بطاقة جديدة",
    name: "فاطمه محمد بن عبدالعزيز المحيميد",
    nationalId: "1010223377",
    employeeNumber: "6615933",
    status: "قيد الإجراء",
    statusType: "progress",
    date: "29/10/2024",
  },
  {
    id: 408,
    type: "طلب بطاقة بدل فاقد",
    name: "فاطمه محمد بن عبدالعزيز المحيميد",
    nationalId: "1010223377",
    employeeNumber: "6615933",
    status: "تم رفض الطلب",
    statusType: "rejected",
    date: "25/10/2024",
  },
  {
    id: 407,
    type: "طلب بطاقة جديدة",
    name: "فاطمه محمد بن عبدالعزيز المحيميد",
    nationalId: "1010223377",
    employeeNumber: "6615933",
    status: "تم رفض الطلب",
    statusType: "rejected",
    date: "24/10/2024",
  },
  {
    id: 404,
    type: "تعديل بطاقة",
    name: "فاطمه محمد بن عبدالعزيز المحيميد",
    nationalId: "1010223377",
    employeeNumber: "6615933",
    status: "تم تسليم البطاقة",
    statusType: "approved",
    date: "23/10/2024",
  },
  {
    id: 405,
    type: "طلب بطاقة بدل فاقد",
    name: "فاطمه محمد بن عبدالعزيز المحيميد",
    nationalId: "1010223377",
    employeeNumber: "6615933",
    status: "تم تسليم البطاقة",
    statusType: "approved",
    date: "23/10/2024",
  },
  {
    id: 406,
    type: "تجديد بطاقة",
    name: "فاطمه محمد بن عبدالعزيز المحيميد",
    nationalId: "1010223377",
    employeeNumber: "6615933",
    status: "تم تسليم البطاقة",
    statusType: "approved",
    date: "23/10/2024",
  },
  {
    id: 403,
    type: "طلب بطاقة بدل فاقد",
    name: "فاطمه محمد بن عبدالعزيز المحيميد",
    nationalId: "1010223377",
    employeeNumber: "6615933",
    status: "تم تسليم البطاقة",
    statusType: "approved",
    date: "23/10/2024",
  },
  {
    id: 402,
    type: "تجديد بطاقة",
    name: "فاطمه محمد بن عبدالعزيز المحيميد",
    nationalId: "1010223377",
    employeeNumber: "6615933",
    status: "تم تسليم البطاقة",
    statusType: "approved",
    date: "23/10/2024",
  },
  {
    id: 401,
    type: "طلب بطاقة جديدة",
    name: "فاطمه محمد بن عبدالعزيز المحيميد",
    nationalId: "1010223377",
    employeeNumber: "6615933",
    status: "تم تسليم البطاقة",
    statusType: "approved",
    date: "23/10/2024",
  },
];

const TABS = [
  {
    key: "new",
    label: "الطلبات الجديدة",
  },
  {
    key: "progress",
    label: "الطلبات تحت الإجراء",
  },
  {
    key: "previous",
    label: "الطلبات السابقة",
  },
];

function StatusIndicator({ type }) {
  if (type === "progress") {
    return (
      <div className="flex items-center justify-center gap-5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-blue-500 bg-white" />
          <span className="text-[11px] text-gray-600">مدير المباشر</span>
        </div>

        <span className="h-px w-8 bg-gray-300" />

        <div className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-green-500 bg-white" />
          <span className="text-[11px] text-gray-600">التواصل الداخلي</span>
        </div>

        <span className="h-px w-8 bg-gray-300" />

        <div className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 bg-white" />
          <span className="text-[11px] text-gray-600">مدير التواصل الداخلي</span>
        </div>
      </div>
    );
  }

  return (
    <span className="text-xs font-medium text-gray-700">
      {type === "rejected" ? "تم رفض الطلب" : "تم تسليم البطاقة"}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[170px] items-center justify-center rounded-xl border border-gray-200 bg-white">
      <p className="text-sm text-gray-500">لا توجد بيانات لعرضها</p>
    </div>
  );
}

export default function EmployeeRequests() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("previous");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRequests = useMemo(() => {
    let result = [...MOCK_REQUESTS];

    if (activeTab === "new") {
      result = result.filter((request) => request.statusType === "progress");
    }

    if (activeTab === "progress") {
      result = result.filter((request) => request.statusType === "progress");
    }

    if (activeTab === "previous") {
      result = result.filter(
        (request) =>
          request.statusType === "approved" ||
          request.statusType === "rejected",
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (request) => request.statusType === statusFilter,
      );
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((request) => {
        return (
          String(request.id).includes(query) ||
          request.type.toLowerCase().includes(query) ||
          request.name.toLowerCase().includes(query) ||
          request.nationalId.includes(query) ||
          request.employeeNumber.includes(query)
        );
      });
    }

    return result;
  }, [activeTab, search, statusFilter]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  return (
    <main dir="rtl" className="min-h-[650px] bg-white font-arabic">
      <div className="px-6 py-8">
        <section className="mx-auto w-full max-w-[1100px]">
          <h1 className="mb-10 text-right text-xl font-bold text-gray-700">
            جميع الطلبات
          </h1>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            {/* البحث والفلاتر */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="بحث..."
                  className="h-10 w-[210px] rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none transition focus:border-[#c69b2c]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="h-10 w-[140px] rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none focus:border-[#c69b2c]"
              >
                <option value="all">حالة الطلب</option>
                <option value="approved">تم الموافقة</option>
                <option value="progress">تحت الإجراء</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>

            {/* التبويبات */}
            <div className="flex items-center gap-2">
              {TABS.map((tab) => {
                const active = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabChange(tab.key)}
                    className={[
                      "rounded-lg px-5 py-2 text-xs font-medium transition",
                      active
                        ? "bg-[#c69b2c] text-white shadow-sm"
                        : "bg-[#f1f1f3] text-gray-600 hover:bg-gray-200",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* الجدول */}
          {filteredRequests.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-right">
                  <thead>
                    <tr className="bg-[#f5f5f7] text-[#c69b2c]">
                      <th className="px-4 py-4 text-xs font-bold">
                        رقم الطلب
                      </th>

                      <th className="px-4 py-4 text-xs font-bold">
                        نوع الطلب
                      </th>

                      <th className="px-4 py-4 text-xs font-bold">
                        اسم الموظف
                      </th>

                      <th className="px-4 py-4 text-xs font-bold">
                        السجل المدني
                      </th>

                      <th className="px-4 py-4 text-xs font-bold">
                        الرقم الوظيفي
                      </th>

                      <th className="px-4 py-4 text-xs font-bold">
                        حالة الطلب
                      </th>

                      <th className="px-4 py-4 text-xs font-bold">
                        التاريخ
                      </th>

                      <th className="px-4 py-4 text-xs font-bold">
                        عرض
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr
                        key={request.id}
                        className="border-t border-gray-100 transition hover:bg-gray-50"
                      >
                        <td className="px-4 py-4 text-center text-xs text-gray-700">
                          {request.id}
                        </td>

                        <td className="px-4 py-4 text-center text-xs text-gray-700">
                          {request.type}
                        </td>

                        <td className="px-4 py-4 text-center text-xs font-medium text-gray-700">
                          {request.name}
                        </td>

                        <td className="px-4 py-4 text-center text-xs text-gray-700">
                          {request.nationalId}
                        </td>

                        <td className="px-4 py-4 text-center text-xs text-gray-700">
                          {request.employeeNumber}
                        </td>

                        <td className="min-w-[260px] px-4 py-4 text-center">
                          <StatusIndicator type={request.statusType} />
                        </td>

                        <td className="px-4 py-4 text-center text-xs text-gray-600">
                          {request.date}
                        </td>

                        <td className="px-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/employee/requests/${request.id}`)
                            }
                            className="rounded-full bg-gray-200 px-4 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-300"
                          >
                            عرض
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* أسفل الجدول */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 px-5 py-4">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 bg-white" />
                    لم تبدأ بعد
                  </span>

                  <span className="flex items-center gap-1">
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-blue-500 bg-white" />
                    تحت الإجراء
                  </span>

                  <span className="flex items-center gap-1">
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-green-500 bg-green-500" />
                    تم الموافقة
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    ١ - {filteredRequests.length} من اصل ٢٥
                  </span>

                  <div className="flex items-center gap-1" dir="ltr">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 disabled:opacity-50"
                    >
                      ‹
                    </button>

                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c69b2c] text-xs text-white"
                    >
                      1
                    </button>

                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-600 hover:bg-gray-200"
                    >
                      2
                    </button>

                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-600 hover:bg-gray-200"
                    >
                      3
                    </button>

                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}