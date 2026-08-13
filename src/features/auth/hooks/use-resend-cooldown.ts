'use client';

import { useEffect, useState } from 'react';

const RESEND_COOLDOWN_MS = 90_000;

export function useResendCooldown() {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [secondsLeft]);

  function startCooldown() {
    setSecondsLeft(Math.ceil(RESEND_COOLDOWN_MS / 1000));
  }

  return {
    isCooldownActive: secondsLeft > 0,
    secondsLeft,
    startCooldown,
  };
}
