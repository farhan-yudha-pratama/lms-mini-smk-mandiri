import { db } from './prisma/db';
async function test() {
  console.log(Object.keys(db.orm.public.User));
  // how about __proto__?
  const builder = db.orm.public.User.where({});
  console.log(Object.keys(builder));
}
test();
