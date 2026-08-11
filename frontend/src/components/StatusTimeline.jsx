const STAGE_STYLES = {
  none: "border-gray-300 bg-white",
  progress: "border-blue-500 bg-white",
  done: "border-green-500 bg-green-500",
};

const LABELS = ["المدير المباشر", "التواصل الداخلي", "مدير التواصل الداخلي"];

export default function StatusTimeline({ stages }) {
  return (
    <div className="flex items-center justify-center">
      {stages.map((stage, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <span className={`h-3 w-3 rounded-full border-2 ${STAGE_STYLES[stage]}`} />
            <span className="whitespace-nowrap text-[10px] text-gray-500">{LABELS[i]}</span>
          </div>
          {i < stages.length - 1 && (
            <span className="mx-1 mt-[-14px] h-px w-8 bg-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}