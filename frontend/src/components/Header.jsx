export default function Header() {
  return (
    <div className="flex items-center justify-between border-b-2 border-gold-400 bg-white px-10 py-6 font-arabic">
      <img
        src="/src/assets/logo.png"
        alt="أمانة منطقة القصيم"
        className="h-20"
      />

      <h1 className="text-2xl font-bold text-brand-teal-800">
        نظام إدارة طلبات البطاقات
      </h1>

      <button className="flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-white hover:bg-gold-dark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        تسجيل خروج
      </button>
    </div>
  );
}