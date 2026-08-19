import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPostForm } from "../../utils/api";

/* =========================================================
   Initial Data
========================================================= */

const INITIAL_DATA = {
  nameAr: "فاطمه محمد بن عبدالعزيز المحيميد",
  nameEn: "Fatimah Mohameed AlMohaimeed",
  nationalId: "1010223377",
  employeeNumber: "6615933",
  mobile: "0596123532",
  nationality: "سعودي",
  department: "أمانة منطقة القصيم",
  rank: "14",
  jobTitle: "مطور برامج متقدم أول",

  newJobTitle: "",
  issueReason: "",
  photo: null,
  photoPreview: null,
};

/* =========================================================
   Steps
========================================================= */

const STEPS = [
  {
    number: 1,
    title: "الخطوة الأولى: بيانات الموظف",
  },
  {
    number: 2,
    title: "الخطوة الثانية: إدخال بيانات مطلوبة",
  },
  {
    number: 3,
    title: "الخطوة الثالثة: الموافقة على التعهد اللازم",
  },
];

/* =========================================================
   Issue Reasons
========================================================= */

const ISSUE_REASONS = [
  "جديد",
  "تجديد",
  "تعديل",
  "بدل فاقد",
  "بدل تالف",
];

/* =========================================================
   Icons
========================================================= */

function CardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-12 w-12"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="3"
        width="14"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="12"
        cy="10"
        r="2.2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8.5 17c.8-1.6 2-2.4 3.5-2.4s2.7.8 3.5 2.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PreviousRequestsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-12 w-12"
      aria-hidden="true"
    >
      <path
        d="M8 7h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M6 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M10 11h5M10 15h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IncomingRequestsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-12 w-12"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="5"
        width="17"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="m4.5 7 7.5 6 7.5-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="18"
        cy="17.5"
        r="3"
        fill="currentColor"
      />

      <path
        d="M18 16v3M16.5 17.5h3"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   Request Menu Card
========================================================= */

function RequestMenuCard({
  title,
  icon,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group",
        "flex",
        "h-[225px]",
        "w-[270px]",
        "flex-col",
        "items-center",
        "justify-center",
        "bg-white",
        "shadow-[0_5px_15px_rgba(0,0,0,0.10)]",
        "transition",
        "duration-200",
        "hover:-translate-y-1",
        "hover:shadow-[0_8px_20px_rgba(0,0,0,0.14)]",
        active
          ? "border-b-2 border-t-2 border-gold text-gold-dark"
          : "text-gray-700",
      ].join(" ")}
    >
      <div
        className={[
          "mb-5",
          "transition",
          active
            ? "text-gold"
            : "text-gray-400 group-hover:text-gray-600",
        ].join(" ")}
      >
        {icon}
      </div>

      <span className="text-lg font-medium">
        {title}
      </span>
    </button>
  );
}

/* =========================================================
   Request Menu
========================================================= */

function RequestMenu({
  onNewRequest,
  onPreviousRequests,
  onIncomingRequests,
}) {
  return (
    <div
      dir="rtl"
      className="
        flex
        min-h-[600px]
        items-start
        justify-center
        px-8
        py-16
      "
    >
      <div
        className="
          grid
          grid-cols-1
          gap-14
          md:grid-cols-3
          md:gap-x-14
        "
      >
        {/* طلب إصدار بطاقة */}

        <RequestMenuCard
          title="طلب إصدار بطاقة"
          icon={<CardIcon />}
          active={true}
          onClick={onNewRequest}
        />

        {/* الطلبات السابقة */}

        <RequestMenuCard
          title="الطلبات السابقة"
          icon={<PreviousRequestsIcon />}
          active={false}
          onClick={onPreviousRequests}
        />

        {/* الطلبات الواردة من الموظفين */}

        <RequestMenuCard
          title="الطلبات الواردة من الموظفين"
          icon={<IncomingRequestsIcon />}
          active={false}
          onClick={onIncomingRequests}
        />
      </div>
    </div>
  );
}

/* =========================================================
   Stepper
========================================================= */

function Stepper({
  currentStep,
}) {
  return (
    <div className="mx-auto mb-12 w-full max-w-[650px]">
      <div className="relative">

        {/* الخط الواصل */}

        <div className="absolute left-[11%] right-[11%] top-[24px] h-[2px] bg-gray-300" />

        <div className="relative flex items-start justify-between">

          {STEPS.map((step) => {
            const active =
              step.number === currentStep;

            const completed =
              step.number < currentStep;

            return (
              <div
                key={step.number}
                className="flex w-1/3 flex-col items-center text-center"
              >
                <div
                  className={[
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#fbfaf5] text-xl font-bold",
                    active || completed
                      ? "border-[4px] border-gold text-gold"
                      : "border-2 border-gray-300 text-gray-500",
                  ].join(" ")}
                >
                  {step.number}
                </div>

                <p
                  className={[
                    "mt-3 max-w-[175px] text-[11px] leading-5",
                    active
                      ? "font-semibold text-gray-800"
                      : "text-gray-600",
                  ].join(" ")}
                >
                  {step.title}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Read Only Field
========================================================= */

function ReadOnlyField({
  label,
  value,
}) {
  return (
    <div className="grid grid-cols-[170px_1fr] items-center gap-4">

      <label className="text-right text-sm font-semibold text-gray-800">
        {label}:
      </label>

      <div
        className="
          flex
          h-[42px]
          items-center
          rounded-xl
          bg-[#e5e5e7]
          px-4
          text-sm
          text-gray-600
        "
      >
        {value}
      </div>

    </div>
  );
}

/* =========================================================
   Step One
========================================================= */

function StepOne({
  formData,
}) {
  return (
    <div className="space-y-4">

      <ReadOnlyField
        label="الاسم الرباعي بالعربي"
        value={formData.nameAr}
      />

      <ReadOnlyField
        label="الاسم الرباعي بالإنجليزي"
        value={formData.nameEn}
      />

      <ReadOnlyField
        label="السجل المدني"
        value={formData.nationalId}
      />

      <ReadOnlyField
        label="الرقم الوظيفي"
        value={formData.employeeNumber}
      />

      <ReadOnlyField
        label="رقم الجوال"
        value={formData.mobile}
      />

      <ReadOnlyField
        label="الجنسية"
        value={formData.nationality}
      />

      <ReadOnlyField
        label="جهة العمل"
        value={formData.department}
      />

      <ReadOnlyField
        label="المرتبة"
        value={formData.rank}
      />

      <ReadOnlyField
        label="المسمى الوظيفي"
        value={formData.jobTitle}
      />

    </div>
  );
}

/* =========================================================
   Step Two
========================================================= */

function StepTwo({
  formData,
  onChange,
  onPhotoChange,
}) {
  const fileInputRef =
    useRef(null);

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    onPhotoChange(file);

    event.target.value = "";
  };

  return (
    <div className="space-y-9">

      {/* العنوان الأحمر */}

      <div className="text-right">
        <p className="text-base font-bold text-red-500">
          <span className="ml-1">
            *
          </span>

          لإكمال الطلب يرجى إدخال البيانات التالية:
        </p>
      </div>

      {/* المسمى الوظيفي */}

      <div className="grid grid-cols-[170px_1fr] items-center gap-4">

        <label className="text-right text-sm font-semibold text-gray-800">
          المسمى الوظيفي:
        </label>

        <input
          type="text"
          name="newJobTitle"
          value={formData.newJobTitle}
          onChange={onChange}
          placeholder='الرجاء إدخال المسمى الوظيفي "للمدير"'
          className="
            h-[42px]
            w-full
            rounded-xl
            border-2
            border-gray-200
            bg-white
            px-4
            text-right
            text-sm
            text-gray-700
            outline-none
            transition
            focus:border-gold
          "
        />

      </div>

      {/* سبب إصدار البطاقة */}

      <div className="grid grid-cols-[170px_1fr] items-start gap-4">

        <label className="pt-3 text-right text-sm font-semibold text-gray-800">
          سبب إصدار بطاقة جديدة:
        </label>

        <select
          name="issueReason"
          value={formData.issueReason}
          onChange={onChange}
          className="
            h-[42px]
            w-full
            rounded-xl
            border-2
            border-gold
            bg-white
            px-4
            text-right
            text-sm
            text-gray-600
            outline-none
          "
        >

          <option value="">
            سبب اصدار بطاقة
          </option>

          {ISSUE_REASONS.map(
            (reason) => (
              <option
                key={reason}
                value={reason}
              >
                {reason}
              </option>
            )
          )}

        </select>

      </div>

      {/* الصورة الشخصية */}

      <div className="grid grid-cols-[170px_1fr] items-start gap-4">

        <label className="pt-2 text-right text-sm font-semibold text-gray-800">
          إرفاق صورة شخصية:
        </label>

        <div>

          {/* التعليمات */}

          <div className="mb-3 text-right text-[11px] leading-5 text-gray-500">

            <p>
              <span className="text-red-500">
                *
              </span>

              تعليمات: يجب إرفاق صورة حديثة، ملونة بخلفية بيضاء، بمقاس الصورة
              (6 × 4).
            </p>

            <p>
              <span className="text-red-500">
                *
              </span>

              ملاحظة: يجب أن تكون بصيغة الصورة

              <span className="mx-1 font-medium">
                png, jpg, jpeg
              </span>

              .
            </p>

          </div>

          {/* اختيار الصورة */}

          <div
            className="
              flex
              h-[42px]
              w-full
              items-center
              overflow-hidden
              rounded-xl
              border-2
              border-gray-200
              bg-white
            "
          >

            <button
              type="button"
              onClick={handleChoosePhoto}
              className="
                h-full
                min-w-[125px]
                bg-[#d1d3da]
                px-4
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-400
              "
            >
              اختر صورة
            </button>

            <span className="flex-1 truncate px-3 text-right text-xs text-gray-500">
              {formData.photo
                ? formData.photo.name
                : "لم يتم اختيار أي صورة"}
            </span>

          </div>

          {/* input مخفي */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* معاينة الصورة */}

          {formData.photoPreview && (
            <div className="mt-4 flex justify-end">

              <div className="overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-1">

                <img
                  src={formData.photoPreview}
                  alt="معاينة الصورة الشخصية"
                  className="h-28 w-24 object-cover"
                />

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   Agreement Checkbox
========================================================= */

function AgreementCheckbox({
  checked,
  onChange,
  children,
  large = false,
}) {
  return (
    <label
      className={[
        "flex cursor-pointer items-start gap-3 rounded-xl bg-[#f0f0eb] px-4",
        large
          ? "py-4"
          : "py-3",
      ].join(" ")}
    >

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
        className="
          mt-1
          h-5
          w-5
          shrink-0
          cursor-pointer
          appearance-none
          rounded-full
          border-2
          border-gold
          bg-white
          checked:bg-gold
        "
      />

      <span className="flex-1 text-right text-xs leading-5 text-gray-700">
        {children}
      </span>

    </label>
  );
}

/* =========================================================
   Step Three
========================================================= */

function StepThree({
  agreementOne,
  agreementTwo,
  onAgreementOneChange,
  onAgreementTwoChange,
  onSubmit,
  onCancel,
}) {
  const canAgree =
    agreementOne &&
    agreementTwo;

  return (
    <div className="flex min-h-[470px] flex-col">

      {/* عنوان التعهد */}

      <div className="mb-14 text-right">

        <h2 className="text-lg font-bold text-gray-800">
          تعهد:
        </h2>

      </div>

      {/* التنبيه */}

      <p className="mb-8 text-center text-xs font-medium leading-6 text-red-500">
        * يرجى الموافقة على التعهد المرفق لتتم متابعة إجراءات إصدار البطاقة الجديدة
      </p>

      {/* التعهد الأول */}

      <AgreementCheckbox
        checked={agreementOne}
        onChange={onAgreementOneChange}
      >
        أتعهد بأن جميع المعلومات أعلاه صحيحة و مطابقة للواقع
      </AgreementCheckbox>

      <div className="h-4" />

      {/* التعهد الثاني */}

      <AgreementCheckbox
        checked={agreementTwo}
        onChange={onAgreementTwoChange}
        large
      >
        أتعهد بالمحافظة على هذه البطاقة وعدم إساءة استخدامها، وفي حالة
        فقدانها أو إتلافها إبلاغ إدارة التواصل الداخلي كما أتعهد بإعادة
        البطاقة بعد انتهاء خدمتي أو عند طلبها من الجهة المختصة، وفي حالة
        مخالفة ما ورد أعلاه فإني أقر أنني أتحمل كافة الإجراءات التي تتخذ
        بحقي من قبل جهة الاختصاص.
      </AgreementCheckbox>

      {/* الأزرار */}

      <div className="mt-auto flex items-center justify-center gap-14 pt-14">

        {/* موافق */}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canAgree}
          className="
            min-w-[140px]
            rounded-xl
            bg-gold
            px-8
            py-3
            text-sm
            font-bold
            text-white
            transition
            hover:bg-gold-dark
            disabled:cursor-not-allowed
            disabled:bg-[#ded19d]
          "
        >
          موافق
        </button>

        {/* إلغاء */}

        <button
          type="button"
          onClick={onCancel}
          className="
            min-w-[140px]
            rounded-xl
            bg-gray-400
            px-8
            py-3
            text-sm
            font-bold
            text-white
            transition
            hover:bg-gray-500
          "
        >
          إلغاء
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   Card Request Form
========================================================= */

function CardRequestForm({
  currentStep,
  formData,
  agreementOne,
  agreementTwo,
  onAgreementOneChange,
  onAgreementTwoChange,
  onChange,
  onPhotoChange,
  onNext,
  onBack,
  onSubmit,
  onCancel,
}) {
  return (
    <div
      dir="rtl"
      className="px-6 py-8 md:px-8 md:py-10"
    >

      <section
        className="
          mx-auto
          w-full
          max-w-[790px]
          rounded-2xl
          bg-[#fbfaf5]
          px-7
          py-8
          shadow-sm
          md:px-10
        "
      >

        {/* العنوان */}

        <h1 className="mb-5 text-center text-xl font-bold text-gray-700">
          إصدار بطاقة
        </h1>

        {/* الخط الفاصل */}

        <div className="mx-auto mb-10 h-[2px] w-[78%] bg-gray-400" />

        {/* Stepper */}

        <Stepper
          currentStep={currentStep}
        />

        {/* =================================================
            Step 1
        ================================================= */}

        {currentStep === 1 && (
          <StepOne
            formData={formData}
          />
        )}

        {/* =================================================
            Step 2
        ================================================= */}

        {currentStep === 2 && (
          <StepTwo
            formData={formData}
            onChange={onChange}
            onPhotoChange={onPhotoChange}
          />
        )}

        {/* =================================================
            Step 3
        ================================================= */}

        {currentStep === 3 && (
          <StepThree
            agreementOne={agreementOne}
            agreementTwo={agreementTwo}
            onAgreementOneChange={
              onAgreementOneChange
            }
            onAgreementTwoChange={
              onAgreementTwoChange
            }
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        )}

        {/* =================================================
            Bottom Navigation - Steps 1 & 2
        ================================================= */}

        {currentStep !== 3 && (
          <div className="mt-12 flex items-center justify-between">

            {/* عودة */}

            <button
              type="button"
              onClick={onBack}
              className="
                text-sm
                font-semibold
                text-gray-500
                transition
                hover:text-gray-800
              "
            >
              &lt;&lt; عودة
            </button>

            {/* التالي */}

            <button
              type="button"
              onClick={onNext}
              className="
                text-sm
                font-bold
                text-gold
                transition
                hover:text-gold-dark
              "
            >
              التالي &gt;&gt;
            </button>

          </div>
        )}

        {/* =================================================
            Bottom Navigation - Step 3
        ================================================= */}

        {currentStep === 3 && (
          <div className="mt-8 flex justify-start">

            <button
              type="button"
              onClick={onBack}
              className="
                text-sm
                font-semibold
                text-gray-500
                transition
                hover:text-gray-800
              "
            >
              &lt;&lt; عودة
            </button>

          </div>
        )}

      </section>

    </div>
  );
}

/* =========================================================
   Main Component
========================================================= */

export default function CardRequest() {
  const navigate =
    useNavigate();

  /*
    menu:
    الواجهة التي تحتوي على:

    - طلب إصدار بطاقة
    - الطلبات السابقة
    - الطلبات الواردة من الموظفين

    form:
    نموذج إصدار البطاقة ذو الخطوات الثلاث.
  */

  const [view, setView] =
    useState("menu");

  const [currentStep, setCurrentStep] =
    useState(1);

  const [formData, setFormData] =
    useState(INITIAL_DATA);

  const [agreementOne, setAgreementOne] =
    useState(false);

  const [agreementTwo, setAgreementTwo] =
    useState(false);

  /* =======================================================
     تنظيف Object URL
  ======================================================= */

  useEffect(() => {
    return () => {
      if (
        formData.photoPreview
      ) {
        URL.revokeObjectURL(
          formData.photoPreview
        );
      }
    };
  }, [
    formData.photoPreview,
  ]);

  /* =======================================================
     فتح طلب إصدار بطاقة
  ======================================================= */

  const handleNewRequest = () => {
    setView("form");
    setCurrentStep(1);
  };

  /* =======================================================
     فتح الطلبات السابقة
  ======================================================= */

  const handlePreviousRequests = () => {
    /*
      هذا هو المسار الصحيح لصفحة
      الطلبات السابقة للموظف.
    */

    navigate(
      "/employee/requests"
    );
  };

  /* =======================================================
     فتح الطلبات الواردة
  ======================================================= */

  const handleIncomingRequests = () => {
    navigate(
      "/employee/incoming-requests"
    );
  };

  /* =======================================================
     تغيير الحقول
  ======================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /* =======================================================
     اختيار الصورة
  ======================================================= */

  const handlePhotoChange = (
    file
  ) => {
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (
      !validTypes.includes(
        file.type
      )
    ) {
      alert(
        "يرجى اختيار صورة بصيغة JPG أو JPEG أو PNG."
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "حجم الصورة يجب ألا يتجاوز 5MB."
      );

      return;
    }

    const previewUrl =
      URL.createObjectURL(
        file
      );

    setFormData(
      (previous) => {

        if (
          previous.photoPreview
        ) {
          URL.revokeObjectURL(
            previous.photoPreview
          );
        }

        return {
          ...previous,
          photo: file,
          photoPreview:
            previewUrl,
        };
      }
    );
  };

  /* =======================================================
     التالي
  ======================================================= */

  const handleNext = () => {

    /*
      الخطوة الأولى
    */

    if (
      currentStep === 1
    ) {
      setCurrentStep(2);
      return;
    }

    /*
      الخطوة الثانية
    */

    if (
      currentStep === 2
    ) {

      if (
        !formData.newJobTitle.trim()
      ) {
        alert(
          "يرجى إدخال المسمى الوظيفي."
        );

        return;
      }

      if (
        !formData.issueReason
      ) {
        alert(
          "يرجى اختيار سبب إصدار البطاقة."
        );

        return;
      }

      if (
        !formData.photo
      ) {
        alert(
          "يرجى إرفاق الصورة الشخصية."
        );

        return;
      }

      setCurrentStep(3);
    }
  };

  /* =======================================================
     العودة
  ======================================================= */

  const handleBack = () => {

    /*
      إذا كانت الخطوة الثانية أو الثالثة
      نرجع للخطوة السابقة.
    */

    if (
      currentStep > 1
    ) {
      setCurrentStep(
        (previous) =>
          previous - 1
      );

      return;
    }

    /*
      إذا كنا في الخطوة الأولى
      نرجع إلى واجهة الاختيارات.
    */

    setView("menu");
  };

  /* =======================================================
     إلغاء الطلب
  ======================================================= */

  const handleCancel = () => {
    setView("menu");
    setCurrentStep(1);
  };

  /* =======================================================
     إرسال الطلب
  ======================================================= */

  const REQUEST_TYPE_MAP = {
    "جديد": "إصدار جديد",
    "تجديد": "تجديد",
    "تعديل": "تعديل بيانات",
    "بدل فاقد": "بدل فاقد",
    "بدل تالف": "بدل تالف",
  };

  const handleSubmit = async () => {

    if (
      !agreementOne ||
      !agreementTwo
    ) {
      alert(
        "يرجى الموافقة على جميع التعهدات قبل إرسال الطلب."
      );

      return;
    }

    try {
      const submitData = new FormData();
      submitData.append(
        "requestType",
        REQUEST_TYPE_MAP[formData.issueReason] || formData.issueReason || "إصدار جديد"
      );
      if (formData.photo) {
        submitData.append("photo", formData.photo);
      }

      await apiPostForm("/cardrequests", submitData);

      alert(
        "تم إرسال طلب إصدار البطاقة بنجاح."
      );

      /*
        بعد الإرسال نعود إلى
        واجهة خيارات البطاقات.
      */

      setView("menu");
      setCurrentStep(1);

      /*
        إعادة التعهدات للوضع الافتراضي.
      */

      setAgreementOne(false);
      setAgreementTwo(false);
    } catch (err) {
      alert(err.message || "تعذر إرسال الطلب، حاول مرة أخرى.");
    }
  };

  /* =======================================================
     Render
  ======================================================= */

  return (
    <main
      dir="rtl"
      className="
        min-h-[700px]
        bg-white
        font-arabic
      "
    >

      {/* =================================================
          Main Content
      ================================================= */}

      {view === "menu" && (
        <RequestMenu
          onNewRequest={
            handleNewRequest
          }
          onPreviousRequests={
            handlePreviousRequests
          }
          onIncomingRequests={
            handleIncomingRequests
          }
        />
      )}

      {view === "form" && (
        <CardRequestForm
          currentStep={
            currentStep
          }
          formData={
            formData
          }
          agreementOne={
            agreementOne
          }
          agreementTwo={
            agreementTwo
          }
          onAgreementOneChange={
            setAgreementOne
          }
          onAgreementTwoChange={
            setAgreementTwo
          }
          onChange={
            handleChange
          }
          onPhotoChange={
            handlePhotoChange
          }
          onNext={
            handleNext
          }
          onBack={
            handleBack
          }
          onSubmit={
            handleSubmit
          }
          onCancel={
            handleCancel
          }
        />
      )}

    </main>
  );
}