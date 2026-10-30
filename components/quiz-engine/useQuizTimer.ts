// components/quiz-engine/useQuizTimer.ts
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseQuizTimerProps {
  attemptId: string;
  timeLimitMinutes?: number | null;
  isActive: boolean;
  onTimeout: () => void;
}

export function useQuizTimer({
  attemptId,
  timeLimitMinutes,
  isActive,
  onTimeout,
}: UseQuizTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const storageKey = attemptId ? `quiz_deadline_${attemptId}` : null;
  const timeoutTriggeredRef = useRef(false);

  // Clear storage helper
  const clearTimer = useCallback(() => {
    if (typeof window !== 'undefined' && storageKey) {
      try {
        sessionStorage.removeItem(storageKey);
      } catch (e) {
        console.error('Failed to clear quiz deadline from storage:', e);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    // If no time limit or quiz is not yet active, do nothing
    if (!timeLimitMinutes || timeLimitMinutes <= 0 || !isActive || !storageKey) {
      return;
    }

    // Determine or retrieve absolute deadline timestamp (in ms)
    let deadline: number;
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        deadline = parseInt(stored, 10);
      } else {
        deadline = Date.now() + timeLimitMinutes * 60 * 1000;
        sessionStorage.setItem(storageKey, deadline.toString());
      }
    } catch {
      deadline = Date.now() + timeLimitMinutes * 60 * 1000;
    }

    const checkTime = () => {
      const diffMs = deadline - Date.now();
      const secondsLeft = Math.max(0, Math.ceil(diffMs / 1000));
      setTimeRemaining(secondsLeft);

      if (secondsLeft <= 0 && !timeoutTriggeredRef.current) {
        timeoutTriggeredRef.current = true;
        clearTimer();
        onTimeoutRef.current();
      }
    };

    // Initial check
    checkTime();

    // 1-second interval
    const interval = setInterval(checkTime, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeLimitMinutes, isActive, storageKey, clearTimer]);

  // Format seconds into MM:SS
  const formattedTime = timeRemaining !== null
    ? `${Math.floor(timeRemaining / 60)
        .toString()
        .padStart(2, '0')}:${(timeRemaining % 60).toString().padStart(2, '0')}`
    : null;

  const isWarning = timeRemaining !== null && timeRemaining <= 60;

  return {
    timeRemaining,
    formattedTime,
    isWarning,
    clearTimer,
  };
}
