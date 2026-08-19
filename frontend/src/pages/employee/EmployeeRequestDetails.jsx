import { useNavigate, useParams } from "react-router-dom";

/* =========================================================
   بيانات الطلبات السابقة
   ========================================================= */

const PREVIOUS_REQUESTS = [
  {
    id: 418,
    requestNumber: 418,
    type: "تعديل بطاقة",

    arabicName: "فاطمه محمد عبدالعزيز المحيميد",
    englishName: "Fatimah Mohammed AlMohaimeed",

    nationalId: "1010223377",
    employeeNumber: "6615933",
    mobile: "0596123532",

    nationality: "سعودي",
    workplace: "أمانة منطقة القصيم",
    rank: "14",
    jobTitle: "مطور برامج متقدم أول",

    reason: "بدل فاقد",
    status: "جديد",
    copyNumber: "3",

    date: "29/10/2024",
  },

  {
    id: 417,
    requestNumber: 417,
    type: "طلب بطاقة جديدة",

    arabicName: "فاطمه محمد عبدالعزيز المحيميد",
    englishName: "Fatimah Mohammed AlMohaimeed",

    nationalId: "1010223377",
    employeeNumber: "6615933",
    mobile: "0596123532",

    nationality: "سعودي",
    workplace: "أمانة منطقة القصيم",
    rank: "14",
    jobTitle: "مطور برامج متقدم أول",

    reason: "إصدار بطاقة جديدة",
    status: "تم تسليم البطاقة",
    copyNumber: "2",

    date: "29/10/2024",
  },

  {
    id: 408,
    requestNumber: 408,
    type: "طلب بطاقة بدل فاقد",

    arabicName: "فاطمه محمد عبدالعزيز المحيميد",
    englishName: "Fatimah Mohammed AlMohaimeed",

    nationalId: "1010223377",
    employeeNumber: "6615933",
    mobile: "0596123532",

    nationality: "سعودي",
    workplace: "أمانة منطقة القصيم",
    rank: "14",
    jobTitle: "مطور برامج متقدم أول",

    reason: "بدل فاقد",
    status: "تم تسليم البطاقة",
    copyNumber: "1",

    date: "25/10/2024",
  },

  {
    id: 407,
    requestNumber: 407,
    type: "طلب بطاقة جديدة",

    arabicName: "فاطمه محمد عبدالعزيز المحيميد",
    englishName: "Fatimah Mohammed AlMohaimeed",

    nationalId: "1010223377",
    employeeNumber: "6615933",
    mobile: "0596123532",

    nationality: "سعودي",
    workplace: "أمانة منطقة القصيم",
    rank: "14",
    jobTitle: "مطور برامج متقدم أول",

    reason: "إصدار بطاقة جديدة",
    status: "تم رفض الطلب",
    copyNumber: "1",

    date: "24/10/2024",
  },

  {
    id: 404,
    requestNumber: 404,
    type: "تعديل بطاقة",

    arabicName: "فاطمه محمد عبدالعزيز المحيميد",
    englishName: "Fatimah Mohammed AlMohaimeed",

    nationalId: "1010223377",
    employeeNumber: "6615933",
    mobile: "0596123532",

    nationality: "سعودي",
    workplace: "أمانة منطقة القصيم",
    rank: "14",
    jobTitle: "مطور برامج متقدم أول",

    reason: "تعديل بيانات",
    status: "تم تسليم البطاقة",
    copyNumber: "1",

    date: "23/10/2024",
  },

  {
    id: 405,
    requestNumber: 405,
    type: "طلب بطاقة بدل فاقد",

    arabicName: "فاطمه محمد عبدالعزيز المحيميد",
    englishName: "Fatimah Mohammed AlMohaimeed",

    nationalId: "1010223377",
    employeeNumber: "6615933",
    mobile: "0596123532",

    nationality: "سعودي",
    workplace: "أمانة منطقة القصيم",
    rank: "14",
    jobTitle: "مطور برامج متقدم أول",

    reason: "بدل فاقد",
    status: "تم تسليم البطاقة",
    copyNumber: "1",

    date: "23/10/2024",
  },

  {
    id: 406,
    requestNumber: 406,
    type: "تجديد بطاقة",

    arabicName: "فاطمه محمد عبدالعزيز المحيميد",
    englishName: "Fatimah Mohammed AlMohaimeed",

    nationalId: "1010223377",
    employeeNumber: "6615933",
    mobile: "0596123532",

    nationality: "سعودي",
    workplace: "أمانة منطقة القصيم",
    rank: "14",
    jobTitle: "مطور برامج متقدم أول",

    reason: "تجديد",
    status: "تم تسليم البطاقة",
    copyNumber: "1",

    date: "23/10/2024",
  },

  {
    id: 403,
    requestNumber: 403,
    type: "طلب بطاقة بدل فاقد",

    arabicName: "فاطمه محمد عبدالعزيز المحيميد",
    englishName: "Fatimah Mohammed AlMohaimeed",

    nationalId: "1010223377",
    employeeNumber: "6615933",
    mobile: "0596123532",

    nationality: "سعودي",
    workplace: "أمانة منطقة القصيم",
    rank: "14",
    jobTitle: "مطور برامج متقدم أول",

    reason: "بدل فاقد",
    status: "تم تسليم البطاقة",
    copyNumber: "1",

    date: "23/10/2024",
  },

  {
    id: 402,
    requestNumber: 402,
    type: "تجديد بطاقة",

    arabicName: "فاطمه محمد عبدالعزيز المحيميد",
    englishName: "Fatimah Mohammed AlMohaimeed",

    nationalId: "1010223377",
    employeeNumber: "6615933",
    mobile: "0596123532",

    nationality: "سعودي",
    workplace: "أمانة منطقة القصيم",
    rank: "14",
    jobTitle: "مطور برامج متقدم أول",

    reason: "تجديد",
    status: "تم تسليم البطاقة",
    copyNumber: "1",

    date: "23/10/2024",
  },

  {
    id: 401,
    requestNumber: 401,
    type: "طلب بطاقة جديدة",

    arabicName: "فاطمه محمد عبدالعزيز المحيميد",
    englishName: "Fatimah Mohammed AlMohaimeed",

    nationalId: "1010223377",
    employeeNumber: "6615933",
    mobile: "0596123532",

    nationality: "سعودي",
    workplace: "أمانة منطقة القصيم",
    rank: "14",
    jobTitle: "مطور برامج متقدم أول",

    reason: "إصدار بطاقة جديدة",
    status: "تم تسليم البطاقة",
    copyNumber: "1",

    date: "23/10/2024",
  },
];

/* =========================================================
   مكوّن عرض قيمة
========================================================= */

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[180px_1fr] items-center gap-6">
      <div className="text-right text-sm font-bold text-gray-800">
        {label}:
      </div>

      <div
        className="
          min-h-[42px]
          rounded-xl
          bg-gray-100
          px-5
          py-2.5
          text-right
          text-sm
          text-gray-700
        "
      >
        {value || "-"}
      </div>
    </div>
  );
}

/* =========================================================
   Employee Request Details
========================================================= */

export default function EmployeeRequestDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  /* البحث عن الطلب المحدد */
  const request = PREVIOUS_REQUESTS.find(
    (item) => String(item.id) === String(id)
  );

  /* في حال عدم العثور على الطلب */
  if (!request) {
    return (
      <div
        dir="rtl"
        className="
          min-h-[600px]
          bg-white
          px-6
          py-16
          font-arabic
        "
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-xl font-bold text-gray-700">
            الطلب غير موجود
          </h1>

          <button
            type="button"
            onClick={() => navigate("/employee/requests")}
            className="
              mt-8
              text-sm
              font-bold
              text-[#c69b2c]
              transition
              hover:text-[#a98222]
            "
          >
            &lt;&lt; العودة إلى القائمة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="
        min-h-[700px]
        bg-white
        px-6
        py-10
        font-arabic
      "
    >
      {/* =================================================
          عنوان الصفحة
         ================================================= */}

      <div className="mx-auto max-w-5xl">
        <div
          className="
            rounded-[20px]
            bg-[#fcfbf5]
            px-10
            py-8
            shadow-sm
          "
        >
          {/* عنوان الطلب */}

          <h1
            className="
              mb-5
              text-center
              text-xl
              font-bold
              text-gray-700
            "
          >
            بيانات الطلب {request.requestNumber}
          </h1>

          {/* الخط الفاصل */}

          <div className="mb-8 h-px w-full bg-gray-400" />

          {/* =================================================
              الصورة الشخصية
             ================================================= */}

          <div className="mb-8 grid grid-cols-[180px_1fr] items-start gap-6">
            <div className="text-right text-sm font-bold text-gray-800">
              الصورة الشخصية:
            </div>

            <div className="flex justify-start">
              <div
                className="
                  flex
                  h-[120px]
                  w-[100px]
                  items-center
                  justify-center
                  border
                  border-gray-300
                  bg-gray-100
                "
              >
                <span className="text-xs text-gray-400">
                  الصورة
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              بيانات الموظف
             ================================================= */}

          <div className="space-y-5">
            <DetailRow
              label="الاسم الرباعي بالعربي"
              value={request.arabicName}
            />

            <DetailRow
              label="الاسم الرباعي بالإنجليزي"
              value={request.englishName}
            />

            <DetailRow
              label="السجل المدني"
              value={request.nationalId}
            />

            <DetailRow
              label="الرقم الوظيفي"
              value={request.employeeNumber}
            />

            <DetailRow
              label="رقم الجوال"
              value={request.mobile}
            />

            <DetailRow
              label="الجنسية"
              value={request.nationality}
            />

            <DetailRow
              label="جهة العمل"
              value={request.workplace}
            />

            <DetailRow
              label="المرتبة"
              value={request.rank}
            />

            <DetailRow
              label="المسمى الوظيفي"
              value={request.jobTitle}
            />

            <DetailRow
              label="سبب إصدار بطاقة جديدة"
              value={request.reason}
            />

            <DetailRow
              label="حالة الطلب"
              value={request.status}
            />

            <DetailRow
              label="رقم النسخة"
              value={request.copyNumber}
            />
          </div>

          {/* =================================================
              العودة إلى القائمة
              
              لا توجد أزرار قبول أو رفض
             ================================================= */}

          <div className="mt-16">
            <button
              type="button"
              onClick={() => navigate("/employee/requests")}
              className="
                text-sm
                font-bold
                text-gray-500
                transition
                hover:text-[#c69b2c]
              "
            >
              &lt;&lt; العودة إلى القائمة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}