import { useNavigate } from "react-router-dom";

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "الطلبات الواردة من الموظفين",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-10 w-10"
        >
          <rect x="1.5" y="5" width="16" height="12" rx="1.5" />
          <path d="M1.5 6l8 6 8-6" />
          <circle cx="18" cy="18" r="5.2" fill="currentColor" stroke="none" />
          <path
            d="M18 15.5v5M15.6 18.3L18 20.7l2.4-2.4"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      path: "/manager/requests",
      active: true,
    },

    {
      title: "الطلبات السابقة",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-10 w-10"
        >
          <path d="M7 3h8l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path d="M15 3v5h4" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>
      ),
      path: "/manager/requests",
      active: false,
    },

    {
      title: "طلب اصدار بطاقة",
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
      active: false,
    },
  ];

  const handleCardClick = (card) => {
    if (card.path && card.path !== "#") {
      navigate(card.path);
    }
  };

  return (
    <main dir="rtl" className="min-h-[650px] bg-white font-arabic">
      <div className="px-8 py-12">
        <section className="mx-auto max-w-[900px]">
          <div className="grid grid-cols-1 gap-x-16 gap-y-16 sm:grid-cols-3">
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
                      card.active ? "text-[#c69b2c]" : "text-gray-500",
                      card.path !== "#" ? "group-hover:text-[#c69b2c]" : "",
                    ].join(" ")}
                  >
                    {card.icon}
                  </div>

                  <span
                    className={[
                      "text-lg font-medium transition-colors duration-200",
                      card.active ? "text-[#c69b2c]" : "text-gray-700",
                      card.path !== "#" ? "group-hover:text-[#c69b2c]" : "",
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