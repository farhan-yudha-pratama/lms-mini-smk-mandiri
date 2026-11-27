import dns from 'node:dns/promises';
import nodemailer from 'nodemailer';

function getMailConfig() {
  const host = process.env.MAIL_HOST || 'smtp-relay.brevo.com';
  const port = Number(process.env.MAIL_PORT || 587);
  const encryption = (process.env.MAIL_ENCRYPTION || 'tls').toLowerCase();
  const user = process.env.MAIL_USERNAME;
  const pass = process.env.MAIL_PASSWORD || process.env.BREVO_SMTP_KEY;
  const fromAddress = process.env.MAIL_FROM_ADDRESS;
  const fromName = process.env.MAIL_FROM_NAME || 'WebPoint LMS';

  if (!user || !pass || !fromAddress) {
    throw new Error(
      'Konfigurasi SMTP belum lengkap. Pastikan MAIL_USERNAME, MAIL_PASSWORD, dan MAIL_FROM_ADDRESS sudah diisi di .env'
    );
  }

  const secure = encryption === 'ssl' || encryption === 'smtps' || port === 465;

  return {
    host,
    port,
    secure,
    requireTLS: !secure && encryption === 'tls',
    auth: { user, pass },
    from: `"${fromName}" <${fromAddress}>`,
  };
}

/**
 * Memastikan domain email tujuan memiliki DNS MX record aktif sebelum mengirim OTP.
 */
export async function verifyEmailDomainMx(email: string): Promise<boolean> {
  const domain = email.split('@')[1]?.trim().toLowerCase();
  if (!domain) return false;

  try {
    const records = await dns.resolveMx(domain);
    return Array.isArray(records) && records.some((r) => Boolean(r.exchange));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code === 'ENOTFOUND' || code === 'ENODATA' || code === 'ENOTIMP') {
      return false;
    }
    throw new Error('Gagal memverifikasi domain email melalui DNS. Periksa koneksi jaringan.');
  }
}

export async function sendEmailChangeOtpMail(params: {
  to: string;
  userName: string;
  otpCode: string;
  expiresInMinutes: number;
}) {
  const config = getMailConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    auth: config.auth,
  });

  const safeName = params.userName.replace(/[<>&"']/g, '');

  await transporter.sendMail({
    from: config.from,
    to: params.to,
    subject: 'Kode OTP Verifikasi Perubahan Email - WebPoint LMS',
    text: `Halo ${safeName},\n\nKode OTP verifikasi perubahan email Anda adalah: ${params.otpCode}\nKode ini berlaku selama ${params.expiresInMinutes} menit.\n\nJika Anda tidak merasa meminta perubahan email, abaikan pesan ini.`,
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;background:#ffffff;color:#111827;">
        <h2 style="margin:0 0 8px;font-size:18px;">Verifikasi Perubahan Email</h2>
        <p style="margin:0 0 16px;font-size:14px;color:#4b5563;">Halo <strong>${safeName}</strong>, masukkan kode OTP berikut di halaman Pengaturan Akun untuk mengonfirmasi alamat email baru Anda:</p>
        <div style="background:#f3f4f6;border:1px solid #d1d5db;border-radius:8px;padding:16px;text-align:center;font-size:28px;font-weight:700;letter-spacing:8px;color:#111827;margin-bottom:16px;">
          ${params.otpCode}
        </div>
        <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Kode ini berlaku selama <strong>${params.expiresInMinutes} menit</strong> dan hanya dapat digunakan satu kali.</p>
        <p style="margin:0;font-size:12px;color:#9ca3af;">Jika Anda tidak meminta perubahan ini, abaikan email ini dan segera ubah kata sandi Anda.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetMail(params: {
  to: string;
  userName: string;
  resetUrl: string;
  expiresInMinutes: number;
}) {
  const config = getMailConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    auth: config.auth,
  });

  const safeName = params.userName.replace(/[<>&"']/g, '');

  await transporter.sendMail({
    from: config.from,
    to: params.to,
    subject: 'Reset Kata Sandi - WebPoint LMS',
    text: `Halo ${safeName},\n\nKlik tautan berikut untuk membuat kata sandi baru (berlaku ${params.expiresInMinutes} menit, hanya 1 kali pakai):\n${params.resetUrl}\n\nJika Anda tidak merasa meminta reset kata sandi, abaikan email ini.`,
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;background:#ffffff;color:#111827;">
        <h2 style="margin:0 0 8px;font-size:18px;">Reset Kata Sandi Akun</h2>
        <p style="margin:0 0 16px;font-size:14px;color:#4b5563;">Halo <strong>${safeName}</strong>, kami menerima permintaan untuk mengatur ulang kata sandi akun WebPoint LMS Anda.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${params.resetUrl}" style="display:inline-block;background:#2A835F;color:#ffffff;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:8px;">
            Buat Kata Sandi Baru
          </a>
        </div>
        <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Tautan ini berlaku selama <strong>${params.expiresInMinutes} menit</strong> dan otomatis hangus setelah digunakan satu kali.</p>
        <p style="margin:0;font-size:12px;color:#9ca3af;word-break:break-all;">Atau salin tautan: ${params.resetUrl}</p>
      </div>
    `,
  });
}
