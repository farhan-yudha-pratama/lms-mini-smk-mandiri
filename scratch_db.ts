import { db } from './prisma/db';
async function test() {
  const pages = await db.orm.public.Page.all();
  console.log(pages[0]);
  
  // Is there include?
  // let's try getting one page and fetching its relations. Maybe it's a getter?
}
test().catch(console.error);
