import { db } from "@/prisma/db";

export async function getStudentLabel(studentId: string) {
  const student = await db.orm.public.User.where({ id: studentId }).first();
  if (!student) return { name: `(Murid tidak ditemukan)`, email: '', className: '', id: studentId };
  
  let className = '';
  if (student.classId) {
    const cls = await db.orm.public.Classroom.where({ id: student.classId }).first();
    if (cls) className = cls.name;
  }
  
  return { name: student.name, email: student.email, className, id: studentId };
}

export async function getCategoryLabel(categoryId: string) {
  const cat = await db.orm.public.MaterialCategory.where({ id: categoryId }).first();
  if (!cat) return { name: `(Kategori tidak ditemukan)`, courseName: '', id: categoryId };
  
  let courseName = '';
  if (cat.courseId) {
    const course = await db.orm.public.Course.where({ id: cat.courseId }).first();
    if (course) courseName = course.name;
  }
  
  return { name: cat.name, courseName, id: categoryId };
}

export async function getPageLabel(pageId: string) {
  const page = await db.orm.public.Page.where({ id: pageId }).first();
  if (!page) return { title: `(Halaman tidak ditemukan)`, categoryName: '', isPublished: false, id: pageId };
  
  const cat = await getCategoryLabel(page.categoryId);
  return { title: page.title, categoryName: cat.name, isPublished: page.isPublished, id: pageId };
}

export async function getPackageLabel(packageId: string) {
  const pkg = await db.orm.public.QuizPackage.where({ id: packageId }).first();
  if (!pkg) return { title: `(Kuis tidak ditemukan)`, pageTitle: '', categoryName: '', passingScore: 0, id: packageId };
  
  let pageTitle = 'Tugas Mandiri';
  let categoryName = '-';
  
  if (pkg.pageId) {
    const page = await getPageLabel(pkg.pageId);
    pageTitle = page.title;
    categoryName = page.categoryName;
  }
  
  return { 
    title: pkg.title, 
    pageTitle, 
    categoryName, 
    passingScore: pkg.passingScore, 
    id: packageId 
  };
}

export function formatStudent(student: { name: string; className: string }) {
  return student.className ? `${student.name} (${student.className})` : student.name;
}
