import 'dotenv/config';
import { db } from '../prisma/db';
import { randomUUID } from 'crypto';

async function main() {
  console.log('Starting seed...');

  // 1. Create Default Course
  let course = await db.orm.public.Course.where({ slug: 'pemrograman-web' }).first();
  
  if (!course) {
    course = await db.orm.public.Course.create({
      id: randomUUID(),
      name: 'Pemrograman Web',
      slug: 'pemrograman-web',
      joinCode: 'WEB101',
      description: 'Materi dasar-dasar pemrograman web termasuk HTML, CSS, JS, dan PHP.',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`Created course: ${course.name}`);
  } else {
    console.log(`Course ${course.name} already exists.`);
  }

  // 2. Assign all existing Material Categories to this course
  let updatedCount = 0;
  const categories = await db.orm.public.MaterialCategory.all();
  for (const cat of categories) {
    if (!cat.courseId) {
      await db.orm.public.MaterialCategory.where({ id: cat.id }).update({ courseId: course.id });
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount} categories to belong to ${course.name}`);

  // 3. Make the Superadmin a teacher for this course
  const superadmins = await db.orm.public.User.where({ role: 'SUPERADMIN' }).all();
  for (const sa of superadmins) {
    const existingAssign = await db.orm.public.CourseTeacher.where({ courseId: course.id, teacherId: sa.id }).first();
    if (!existingAssign) {
      await db.orm.public.CourseTeacher.create({
        id: randomUUID(),
        courseId: course.id,
        teacherId: sa.id
      });
      console.log(`Assigned superadmin ${sa.name} as teacher for ${course.name}`);
    }
  }

  console.log('Seed completed successfully!');
}

main().catch(console.error);
