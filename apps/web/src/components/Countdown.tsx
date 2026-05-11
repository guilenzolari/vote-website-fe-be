import { useEffect, useState, useCallback } from "react";

interface CountdownProps {
  targetTime: number; // timestamp quando termina a contagem
  onComplete?: () => void;
}

export const Countdown = ({ targetTime, onComplete }: CountdownProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  const calculateRemaining = useCallback(() => {
    const remaining = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
    setTimeRemaining(remaining);

    if (remaining === 0 && onComplete) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    calculateRemaining();

    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [targetTime, onComplete]);

  const days = Math.floor(timeRemaining / 86400);
  const hours = Math.floor((timeRemaining % 86400) / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="countdown">
      <span className="countdown-value">
        {days > 0 && `${String(days).padStart(2, "0")}d `}
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
};
