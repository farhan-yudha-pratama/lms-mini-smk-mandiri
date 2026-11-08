import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getStudentProjectById } from '@/modules/sandbox/sandbox.service';
import SandboxWorkspace from '@/components/sandbox/SandboxWorkspace';

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await getSession();
  if (!session) return { title: 'Sandbox Coding - SMK Mandiri' };

  const project = await getStudentProjectById(id, session.userId);
  return {
    title: project ? `${project.title} - Sandbox Coding` : 'Sandbox Coding Siswa',
  };
}

export default async function StudentSandboxWorkspacePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const session = await getSession();

  if (!session || session.role !== 'MURID') {
    redirect('/login');
  }

  // Row-Level Security: Hanya ambil proyek jika milik student yang sedang login
  const project = await getStudentProjectById(id, session.userId);

  if (!project) {
    redirect('/student/sandbox');
  }

  return <SandboxWorkspace project={project} />;
}
