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
          ? "border-b-2 border-t-2 border-black text-black hover:border-gold hover:text-gold-dark"
          : "text-gray-700",
      ].join(" ")}
    >
      <div
        className={[
          "mb-5",
          "transition",
          active
            ? "text-black group-hover:text-gold"
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