import { db } from '@/prisma/db';

export interface DashboardStats {
  totalUsers: number;
  totalMaterials: number;
  todayActivities: number;
}

export interface ActivityLog {
  id: string;
  userName: string | null;
  action: string;
  createdAt: string;
}

export async function getDashboardStats(
  userId: string,
  role: string,
  classId?: string | null
): Promise<DashboardStats> {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const today = d.toISOString();

  let totalUsers = 0;
  let totalMaterials = 0;
  let todayActivities = 0;

  if (role === 'SUPERADMIN') {
    const users = await db.orm.public.User.all();
    totalUsers = users.length;
    
    const pages = await db.orm.public.Page.all();
    totalMaterials = pages.length;
    
    const logs = await db.orm.public.AuditLog.all();
    todayActivities = logs.filter((log: any) => log.createdAt >= today).length;
  } else if (role === 'GURU') {
    if (classId) {
      const users = await db.orm.public.User.where({ role: 'MURID', classId }).all();
      totalUsers = users.length;
      
      const classUserIds = users.map((u: any) => u.id);
      const logs = await db.orm.public.AuditLog.all();
      todayActivities = logs.filter((log: any) => log.createdAt >= today && log.userId && classUserIds.includes(log.userId)).length;
    }
    
    const pages = await db.orm.public.Page.all();
    totalMaterials = pages.length;
  }

  return { totalUsers, totalMaterials, todayActivities };
}

export async function getRecentActivities(
  userId: string,
  role: string,
  classId?: string | null
): Promise<ActivityLog[]> {
  let logs: any[] = [];
  
  if (role === 'SUPERADMIN') {
    const allLogs = await db.orm.public.AuditLog.all();
    logs = allLogs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  } else if (role === 'GURU' && classId) {
    const allLogs = await db.orm.public.AuditLog.all();
    const users = await db.orm.public.User.where({ classId }).all();
    const classUserIds = users.map((u: any) => u.id);
    logs = allLogs.filter((log: any) => log.userId && classUserIds.includes(log.userId))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  }

  const allUsers = await db.orm.public.User.all();
  const userMap: Record<string, string> = {};
  for (const u of allUsers) {
    userMap[u.id] = u.name;
  }

  let activities = logs.map((log) => ({
    id: log.id,
    userName: log.userId ? (userMap[log.userId] || 'Unknown User') : 'Unknown User',
    action: log.action,
    createdAt: log.createdAt,
  }));

  if (activities.length < 5) {
    const limit = 5 - activities.length;
    let attempts: any[] = [];
    
    if (role === 'SUPERADMIN') {
      const allAttempts = await db.orm.public.QuizAttempt.all();
      attempts = allAttempts.sort((a: any, b: any) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, limit);
    } else if (role === 'GURU' && classId) {
      const allAttempts = await db.orm.public.QuizAttempt.all();
      const users = await db.orm.public.User.where({ classId }).all();
      const classUserIds = users.map((u: any) => u.id);
      attempts = allAttempts.filter((att: any) => classUserIds.includes(att.studentId))
        .sort((a: any, b: any) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, limit);
    }

    const attemptActivities = attempts.map((attempt) => ({
      id: attempt.id,
      userName: userMap[attempt.studentId] || 'Unknown User',
      action: `Memulai kuis`,
      createdAt: attempt.startedAt,
    }));

    activities = [...activities, ...attemptActivities];
  }

  activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return activities.slice(0, 5);
}
