import { useRef } from "react";

export default function OtpInput({ length = 4, value = "", onChange, disabled = false }) {
  const inputsRef = useRef([]);
  const digits = value.split("").slice(0, length);
  while (digits.length < length) digits.push("");

  const handleDigitChange = (index, digit) => {
    const clean = digit.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    onChange?.(next.join(""));

    if (clean && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3" dir="ltr">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleDigitChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="h-12 w-12 rounded-lg border border-gray-300 text-center text-lg font-semibold focus:border-brand-teal-600 focus:outline-none disabled:bg-gray-100"
        />
      ))}
    </div>
  );
}