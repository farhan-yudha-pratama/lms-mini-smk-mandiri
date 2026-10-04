import AccessGuard from '@/components/AccessGuard';

export default function MaterialLayout({ children }: { children: React.ReactNode }) {
  return <AccessGuard>{children}</AccessGuard>;
}
