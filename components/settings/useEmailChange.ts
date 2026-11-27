'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  cancelEmailChangeAction,
  requestEmailChangeAction,
  verifyEmailChangeOtpAction,
} from '@/app/actions/settings';
import type { PendingEmailChangeInfo } from '@/modules/auth/email-change.service';

const RESEND_COOLDOWN_SECONDS = 60;

export function useEmailChange(initialPending: PendingEmailChangeInfo | null) {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState(initialPending?.newEmail || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pending, setPending] = useState<PendingEmailChangeInfo | null>(initialPending);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!pending) return;
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [pending]);

  const expiresInSeconds = pending
    ? Math.max(0, Math.floor((new Date(pending.expiresAt).getTime() - nowMs) / 1000))
    : 0;

  const resendCooldownSeconds = pending
    ? Math.max(0, RESEND_COOLDOWN_SECONDS - Math.floor((nowMs - new Date(pending.createdAt).getTime()) / 1000))
    : 0;

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setFieldErrors({});

    startTransition(async () => {
      const res = await requestEmailChangeAction({ newEmail, currentPassword });
      if (res.success && res.data) {
        setNowMs(Date.now());
        setPending(res.data);
        setOtpCode('');
        setStatusMessage({ type: 'success', text: res.message });
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Gagal mengirim kode OTP' });
        if (res.errors) setFieldErrors(res.errors);
      }
    });
  };

  const handleResendOtp = () => {
    if (!pending || !currentPassword) {
      setStatusMessage({
        type: 'error',
        text: 'Masukkan kembali password saat ini untuk mengirim ulang OTP.',
      });
      return;
    }
    setStatusMessage(null);
    setFieldErrors({});

    startTransition(async () => {
      const res = await requestEmailChangeAction({
        newEmail: pending.newEmail,
        currentPassword,
      });
      if (res.success && res.data) {
        setNowMs(Date.now());
        setPending(res.data);
        setOtpCode('');
        setStatusMessage({ type: 'success', text: res.message });
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Gagal mengirim ulang OTP' });
        if (res.errors) setFieldErrors(res.errors);
      }
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setFieldErrors({});

    startTransition(async () => {
      const res = await verifyEmailChangeOtpAction({ otp: otpCode });
      if (res.success) {
        setPending(null);
        setOtpCode('');
        setNewEmail('');
        setCurrentPassword('');
        setStatusMessage({ type: 'success', text: res.message });
        router.refresh();
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Verifikasi OTP gagal' });
        if (res.errors) setFieldErrors(res.errors);
      }
    });
  };

  const handleCancel = () => {
    setStatusMessage(null);
    setFieldErrors({});

    startTransition(async () => {
      const res = await cancelEmailChangeAction();
      if (res.success) {
        setPending(null);
        setOtpCode('');
        setStatusMessage(null);
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    });
  };

  return {
    newEmail,
    setNewEmail,
    currentPassword,
    setCurrentPassword,
    showPassword,
    setShowPassword,
    otpCode,
    setOtpCode,
    pending,
    statusMessage,
    fieldErrors,
    isPending,
    expiresInSeconds,
    resendCooldownSeconds,
    handleRequestOtp,
    handleResendOtp,
    handleVerifyOtp,
    handleCancel,
  };
}

export function formatCountdown(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
