import { getCourseById } from '@/app/actions/course';
import { db } from '@/prisma/db';
import AssignClient from './AssignClient';

export const dynamic = 'force-dynamic';

export default async function AssignCoursePage({ params }: { params: { id: string } }) {
  const course = await getCourseById(params.id);
  
  if (!course) {
    return <div className="p-6">Mata pelajaran tidak ditemukan.</div>;
  }

  // Fetch all teachers
  const allTeachers = await db.orm.public.User.where({ role: 'GURU' }).all();
  // Fetch currently assigned teachers
  const courseTeachers = await db.orm.public.CourseTeacher.where({ courseId: course.id }).all();
  const assignedTeacherIds = courseTeachers.map((ct) => ct.teacherId);
  const assignedTeachers = allTeachers.filter(t => assignedTeacherIds.includes(t.id));
  const availableTeachers = allTeachers.filter(t => !assignedTeacherIds.includes(t.id));

  // Fetch all materials
  const allCategories = await db.orm.public.MaterialCategory.all();
  const assignedCategories = allCategories.filter(c => c.courseId === course.id);
  const unassignedCategories = allCategories.filter(c => !c.courseId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kelola: {course.name}</h1>
        <p className="text-sm text-gray-500 mt-1">Atur Guru pengampu dan Materi untuk mata pelajaran ini.</p>
      </div>
      
      <AssignClient 
        courseId={course.id} 
        assignedTeachers={assignedTeachers}
        availableTeachers={availableTeachers}
        assignedCategories={assignedCategories}
        unassignedCategories={unassignedCategories}
      />
    </div>
  );
}
