import React, { useEffect, useState, useCallback } from "react";

// Renders mm:ss and calls onExpire exactly once when the window closes.
const CountdownTimer = ({ expiresAt, onExpire }) => {
  const calc = useCallback(() => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  }, [expiresAt]);

  const [secondsLeft, setSecondsLeft] = useState(calc);

  useEffect(() => {
    setSecondsLeft(calc());
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = calc();
        if (next <= 0) {
          clearInterval(id);
          onExpire && onExpire();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [calc, onExpire]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const isUrgent = secondsLeft <= 60;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-sm tabular-nums ${
        isUrgent
          ? "border-crimson/60 bg-crimson/10 text-crimson animate-pulse"
          : "border-gold/40 bg-gold/10 text-gold"
      }`}
      role="timer"
      aria-live="polite"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {mm}:{ss} left to pay
    </div>
  );
};

export default CountdownTimer;
