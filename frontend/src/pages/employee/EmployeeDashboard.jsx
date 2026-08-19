import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "إصدار بطاقة",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-10 w-10"
        >
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <circle cx="12" cy="9" r="2.2" />
          <path d="M8.5 16c.8-1.7 2-2.5 3.5-2.5s2.7.8 3.5 2.5" />
        </svg>
      ),
      path: "/card-request",
      active: true,
    },

    {
      title: "إصدار تعريف",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-10 w-10"
        >
          <path d="M12 3l1.8 5.1L19 9.2l-4 3.5 1.2 5.2-4.2-2.8-4.2 2.8L9 12.7 5 9.2l5.2-1.1L12 3z" />
        </svg>
      ),
      path: "#",
      active: false,
    },

    {
      title: "البيانات المالية",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-10 w-10"
        >
          <path d="M4 19h16" />
          <path d="M6 17v-5" />
          <path d="M10 17V8" />
          <path d="M14 17v-3" />
          <path d="M18 17V5" />
          <path d="M5 8l4-3 4 2 5-4" />
        </svg>
      ),
      path: "#",
      active: false,
    },

    {
      title: "تحقق من تعريف",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-10 w-10"
        >
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      path: "#",
      active: false,
    },
  ];

  const handleCardClick = (card) => {
    if (card.path && card.path !== "#") {
      navigate(card.path);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-[650px] bg-white font-arabic"
    >
      <div className="px-8 py-12">
        <section className="mx-auto max-w-[900px]">
          <div className="grid grid-cols-1 gap-x-16 gap-y-16 sm:grid-cols-2">
            {cards.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => handleCardClick(card)}
                className={[
                  "group flex h-[235px] items-center justify-center",
                  "border bg-white shadow-sm transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-[#c69b2c]/40",
                  card.active
                    ? "border-t-2 border-[#c69b2c] border-x-transparent border-b-transparent"
                    : "border-transparent",
                  card.path !== "#"
                    ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg"
                    : "cursor-default",
                ].join(" ")}
              >
                <div className="flex flex-col items-center justify-center gap-7">
                  <div
                    className={[
                      "transition-colors duration-200",
                      card.active
                        ? "text-[#c69b2c]"
                        : "text-gray-500",
                      card.path !== "#"
                        ? "group-hover:text-[#c69b2c]"
                        : "",
                    ].join(" ")}
                  >
                    {card.icon}
                  </div>

                  <span
                    className={[
                      "text-lg font-medium transition-colors duration-200",
                      card.active
                        ? "text-[#c69b2c]"
                        : "text-gray-700",
                      card.path !== "#"
                        ? "group-hover:text-[#c69b2c]"
                        : "",
                    ].join(" ")}
                  >
                    {card.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}