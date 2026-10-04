import { useEffect, useState } from "react";

export default function useCountdown(initialTime = 120) {
  const [timer, setTimer] = useState(initialTime);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (!resendDisabled || timer <= 0) {
      if (timer <= 0) {
        setResendDisabled(false);
      }

      return;
    }

    const countDown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countDown);
  }, [resendDisabled, timer]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const startCountdown = (seconds = initialTime) => {
    setTimer(seconds);
    setResendDisabled(true);
  };

  return {
    timer,
    resendDisabled,
    formattedTimer: formatTimer(timer),
    startCountdown,
  };
}