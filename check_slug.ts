import { db } from './prisma/db';
async function run() { 
  const packages = await db.orm.public.QuizPackage.all(); 
  const pageIds = packages.map(p => p.pageId); 
  const pages = await db.orm.public.Page.all(); 
  console.log('Pages with quizzes: ', pages.filter(p => pageIds.includes(p.id)).map(p => p.slug)); 
} 
run();
