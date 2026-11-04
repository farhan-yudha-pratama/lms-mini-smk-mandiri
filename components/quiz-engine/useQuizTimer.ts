// components/quiz-engine/useQuizTimer.ts
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseQuizTimerProps {
  attemptId: string;
  timeLimitMinutes?: number | null;
  startedAt?: string | null;
  closeAt?: string | null;
  isActive: boolean;
  onTimeout: () => void;
}

export function useQuizTimer({
  attemptId,
  timeLimitMinutes,
  startedAt,
  closeAt,
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
    // If no limit exists or quiz is not active, do nothing
    const hasTimeLimit = timeLimitMinutes && timeLimitMinutes > 0;
    const hasCloseAt = Boolean(closeAt);
    if ((!hasTimeLimit && !hasCloseAt) || !isActive || !storageKey) {
      return;
    }

    // Determine absolute deadline: sync from server startedAt, capped by closeAt
    let deadline: number;

    const startMs = startedAt ? new Date(startedAt).getTime() : NaN;
    let durationDeadline: number | null = null;
    if (hasTimeLimit) {
      if (!isNaN(startMs)) {
        durationDeadline = startMs + timeLimitMinutes! * 60 * 1000;
      } else {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
          durationDeadline = parseInt(stored, 10);
        } else {
          durationDeadline = Date.now() + timeLimitMinutes! * 60 * 1000;
          sessionStorage.setItem(storageKey, durationDeadline.toString());
        }
      }
    }

    const closeMs = closeAt ? new Date(closeAt).getTime() : NaN;
    const validClose = !isNaN(closeMs) ? closeMs : null;

    if (durationDeadline && validClose) {
      deadline = Math.min(durationDeadline, validClose);
    } else {
      deadline = durationDeadline || validClose || (Date.now() + 60 * 1000);
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
  }, [timeLimitMinutes, startedAt, closeAt, isActive, storageKey, clearTimer]);

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
