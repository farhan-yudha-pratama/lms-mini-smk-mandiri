import AccessGuard from '@/components/AccessGuard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AccessGuard>{children}</AccessGuard>;
}
