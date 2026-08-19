import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";
import backgroundTop from "../../assets/background.png";

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M3.5 21C3.5 16.8579 7.30558 13.5 12 13.5C16.6944 13.5 20.5 16.8579 20.5 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PasswordIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7 shrink-0"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="10"
        width="16"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          d="M2.5 12C4.5 8.5 7.7 6.5 12 6.5C16.3 6.5 19.5 8.5 21.5 12C19.5 15.5 16.3 17.5 12 17.5C7.7 17.5 4.5 15.5 2.5 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        <circle
          cx="12"
          cy="12"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M10.58 10.58C10.21 10.95 10 11.45 10 12C10 13.1 10.9 14 12 14C12.55 14 13.05 13.79 13.42 13.42"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M6.71 6.72C4.91 7.79 3.5 9.52 2.5 12C4.5 15.5 7.7 17.5 12 17.5C13.88 17.5 15.56 17.15 17.03 16.47"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M14.08 5.03C13.43 4.87 12.74 4.79 12 4.79C7.7 4.79 4.5 7.1 2.5 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M19.02 7.03C20.04 8.13 20.88 9.45 21.5 12C20.72 13.36 19.71 14.5 18.48 15.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "يرجى إدخال اسم المستخدم";
    }

    if (!formData.password) {
      newErrors.password = "يرجى إدخال كلمة المرور";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      /*
       * تسجيل الدخول الحقيقي سيتم ربطه مع Login API لاحقًا.
       *
       * حاليًا:
       * إذا كانت البيانات غير فارغة يتم الانتقال إلى Dashboard.
       */

      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-white font-arabic"
    >
      {/* الزخرفة الموجودة أصلًا في المشروع */}
      <img
        src={backgroundTop}
        alt=""
        className="pointer-events-none absolute left-0 top-0 w-[600px] max-w-[55vw]"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
        <section className="w-full max-w-[650px] overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
          <div className="px-8 pb-7 pt-12 sm:px-12 sm:pt-14">
            {/* الشعار */}
            <div className="mb-12 flex justify-center">
              <img
                src={logo}
                alt="وزارة الدفاع - المملكة العربية السعودية"
                className="w-[280px] max-w-[75%] object-contain sm:w-[330px]"
              />
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* اسم المستخدم */}
              <div className="mb-5">
                <div
                  className={`flex h-[70px] items-center gap-5 rounded-xl border bg-white px-4 transition ${
                    errors.username
                      ? "border-red-500"
                      : "border-gray-400 focus-within:border-brand-teal-700"
                  }`}
                >
                  <div className="text-brand-teal-700">
                    <UserIcon />
                  </div>

                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="تسجيل الدخول"
                    autoComplete="username"
                    className="h-full min-w-0 flex-1 bg-transparent text-right text-lg text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>

                {errors.username && (
                  <p className="mt-2 px-2 text-sm text-red-600">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* كلمة المرور */}
              <div className="mb-3">
                <div
                  className={`flex h-[70px] items-center gap-4 rounded-xl border bg-white px-4 transition ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-400 focus-within:border-brand-teal-700"
                  }`}
                >
                  <div className="text-brand-teal-700">
                    <PasswordIcon />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="كلمة المرور"
                    autoComplete="current-password"
                    className="h-full min-w-0 flex-1 bg-transparent text-right text-lg text-gray-800 outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    className="text-gray-500 transition hover:text-brand-teal-700"
                    aria-label={
                      showPassword
                        ? "إخفاء كلمة المرور"
                        : "إظهار كلمة المرور"
                    }
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 px-2 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* نسيت كلمة المرور */}
              <div className="mb-10 flex justify-start">
                <Link
                  to="/forgot-password"
                  className="text-lg font-medium text-gold-dark transition hover:text-gold-700"
                >
                  نسيت كلمة المرور
                </Link>
              </div>

              {/* زر الدخول */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-[72px] w-full items-center justify-center rounded-xl bg-brand-teal-900 text-2xl text-white shadow-md transition hover:bg-brand-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "جاري الدخول..." : "دخول"}
              </button>
            </form>
          </div>

          {/* الخط الذهبي السفلي */}
          <div className="px-5 pb-4">
            <div className="h-2 rounded-full bg-gold" />
          </div>
        </section>
      </div>
    </main>
  );
}