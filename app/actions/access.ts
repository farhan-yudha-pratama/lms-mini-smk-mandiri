'use server';

import { db } from '@/prisma/db';
import { getUserSession } from '@/app/actions';

export async function getMaterialNav() {
  const session = await getUserSession();
  
  // Fake userId mapping
  let userId = 'unknown';
  let role = session ? (session.role || 'MURID') : 'MURID';
  
  if (session?.email) {
    const users = await db.orm.public.User.where({ email: session.email }).all();
    if (users.length > 0) {
      userId = users[0].id;
      role = users[0].role;
    }
  }

  const bypass = role === 'SUPERADMIN' || role === 'GURU';

  const categories = await db.orm.public.MaterialCategory.where({ isActive: true }).all();
  categories.sort((a, b) => a.orderIndex - b.orderIndex);

  const pages = await db.orm.public.Page.where({ isPublished: true }).all();
  
  // Batch fetch prerequisites
  const sequences = await db.orm.public.PageSequence.all();
  
  // Batch fetch quiz attempts & page access for this user
  let attempts: any[] = [];
  let accesses: any[] = [];
  
  if (!bypass) {
    attempts = await db.orm.public.QuizAttempt.where({ studentId: userId }).all();
    accesses = await db.orm.public.PageAccess.where({ studentId: userId }).all();
  }

  const checkUnlocked = async (page: any) => {
    if (bypass) return true;

    // Check manual override
    const access = accesses.find(a => a.pageId === page.id);
    if (access && (access.status === 'UNLOCKED' || access.status === 'COMPLETED')) return true;

    // Check prerequisite
    const sequence = sequences.find(s => s.pageId === page.id);
    if (!sequence || !sequence.prerequisitePageId) return true;

    // Check if prerequisite quiz is passed
    const prereqQuizzes = await db.orm.public.QuizPackage.where({ pageId: sequence.prerequisitePageId }).all();
    const prereqQuiz = prereqQuizzes[0];
    
    if (prereqQuiz) {
      const variants = await db.orm.public.QuizVariant.where({ quizPackageId: prereqQuiz.id }).all();
      const variantIds = variants.map(v => v.id);
      const passedAttempt = attempts.find(a => variantIds.includes(a.quizVariantId) && a.status === 'COMPLETED' && (a.score ?? 0) >= sequence.minQuizScore);
      if (passedAttempt) return true;
    } else {
      const prereqAccess = accesses.find(a => a.pageId === sequence.prerequisitePageId);
      if (prereqAccess && prereqAccess.status === 'COMPLETED') return true;
    }
    
    return false;
  };

  const navData = [];

  for (const cat of categories) {
    const catPages = pages
      .filter(p => p.categoryId === cat.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    let unlockedCount = 0;
    const finalPages = [];

    for (const p of catPages) {
      const isUnlocked = await checkUnlocked(p);
      if (isUnlocked) unlockedCount++;
      
      finalPages.push({
        id: p.id,
        title: p.title,
        slug: p.slug,
        isUnlocked
      });
    }

    const progress = finalPages.length > 0 ? Math.round((unlockedCount / finalPages.length) * 100) : 0;

    navData.push({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || 'folder',
      progress,
      pages: finalPages
    });
  }

  return navData;
}

export async function verifyPageAccess(userId: string, role: string, pageSlug: string) {
  if (role === 'SUPERADMIN' || role === 'GURU') {
    return { isUnlocked: true, reason: 'BYPASS_ROLE' };
  }

  const pages = await db.orm.public.Page.where({ slug: pageSlug }).all();
  const page = pages[0];
  if (!page) return { isUnlocked: false, reason: 'PAGE_NOT_FOUND' };

  const accesses = await db.orm.public.PageAccess.where({ pageId: page.id, studentId: userId }).all();
  const access = accesses[0];
  if (access && (access.status === 'UNLOCKED' || access.status === 'COMPLETED')) {
    return { isUnlocked: true, reason: 'PAGE_ACCESS_OVERRIDE' };
  }

  const sequences = await db.orm.public.PageSequence.where({ pageId: page.id }).all();
  const sequence = sequences[0];

  if (!sequence || !sequence.prerequisitePageId) {
    return { isUnlocked: true, reason: 'NO_PREREQUISITE' };
  }

  const prereqQuizzes = await db.orm.public.QuizPackage.where({ pageId: sequence.prerequisitePageId }).all();
  const prereqQuiz = prereqQuizzes[0];
  
  if (prereqQuiz) {
    const variants = await db.orm.public.QuizVariant.where({ quizPackageId: prereqQuiz.id }).all();
    const variantIds = variants.map(v => v.id);
    const attempts = await db.orm.public.QuizAttempt.where({ studentId: userId }).all();
    const passedAttempt = attempts.find((a: any) => variantIds.includes(a.quizVariantId) && a.status === 'COMPLETED' && (a.score ?? 0) >= sequence.minQuizScore);
    if (passedAttempt) return { isUnlocked: true, reason: 'PREREQUISITE_MET' };
  } else {
    const prereqAccesses = await db.orm.public.PageAccess.where({ pageId: sequence.prerequisitePageId, studentId: userId }).all();
    const prereqAccess = prereqAccesses[0];
    if (prereqAccess && prereqAccess.status === 'COMPLETED') {
      return { isUnlocked: true, reason: 'PREREQUISITE_COMPLETED_MANUAL' };
    }
  }

  return { isUnlocked: false, reason: 'PREREQUISITE_NOT_MET' };
}

export async function checkRouteAccess(pageSlug: string) {
  const session = await getUserSession();
  if (!session) return { isUnlocked: false, reason: 'NOT_LOGGED_IN' };
  
  let userId = 'unknown';
  let role = session.role || 'MURID';
  
  if (role === 'SUPERADMIN' || role === 'GURU') {
    return { isUnlocked: true, reason: 'BYPASS_ROLE' };
  }

  if (session.email) {
    const users = await db.orm.public.User.where({ email: session.email }).all();
    if (users.length > 0) {
      userId = users[0].id;
      role = users[0].role;
    }
  }
  
  return verifyPageAccess(userId, role, pageSlug);
}
