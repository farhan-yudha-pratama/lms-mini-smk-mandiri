import { db } from './prisma/db';
async function test() {
  const usersCount = (await db.orm.public.User.all()).length; // fallback
  console.log('usersCount', usersCount);
  try {
     const count2 = await db.orm.public.User.count?.();
     console.log('count function', count2);
  } catch (e) {
     console.log('no count method');
  }
}
test().catch(console.error);
