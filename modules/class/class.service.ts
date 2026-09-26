import { db } from '@/prisma/db';
import { CreateClassValues } from './class.schema';
import { randomUUID } from 'crypto';

function generateJoinCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createClass(data: CreateClassValues) {
  let joinCode = generateJoinCode();
  
  // Ensure unique code
  let isUnique = false;
  while (!isUnique) {
    const existing = await db.orm.public.Classroom.where({ joinCode }).first();
    if (existing) {
      joinCode = generateJoinCode();
    } else {
      isUnique = true;
    }
  }

  return await db.orm.public.Classroom.create({
    id: randomUUID(),
    name: data.name,
    joinCode,
    maxStudents: data.maxStudents || 32,
    isActive: true,
  });
}

export async function updateClass(id: string, data: {
  name: string;
  maxStudents: number;
  isActive: boolean;
  regenerateJoinCode?: boolean;
}) {
  const existing = await db.orm.public.Classroom.where({ id }).first();
  if (!existing) {
    throw new Error('Kelas tidak ditemukan');
  }

  const updatePayload: Record<string, any> = {
    name: data.name,
    maxStudents: data.maxStudents,
    isActive: data.isActive,
  };

  if (data.regenerateJoinCode) {
    let newCode = generateJoinCode();
    let isUnique = false;
    while (!isUnique) {
      const exists = await db.orm.public.Classroom.where({ joinCode: newCode }).first();
      if (exists) {
        newCode = generateJoinCode();
      } else {
        isUnique = true;
      }
    }
    updatePayload.joinCode = newCode;
  }

  await db.orm.public.Classroom.where({ id }).update(updatePayload);
  return await db.orm.public.Classroom.where({ id }).first();
}

export async function deleteClass(id: string) {
  const existing = await db.orm.public.Classroom.where({ id }).first();
  if (!existing) {
    throw new Error('Kelas tidak ditemukan');
  }

  // Release all students connected to this class (disconnect relation)
  const connectedStudents = await db.orm.public.User.where({ classId: id }).all();
  if (connectedStudents.length > 0) {
    await Promise.all(
      connectedStudents.map(student =>
        db.orm.public.User.where({ id: student.id }).update({ classId: null })
      )
    );
  }

  // Delete classroom
  await db.orm.public.Classroom.where({ id }).delete();
  return true;
}

export async function getAllClasses() {
  const classes = await db.orm.public.Classroom.all();
  // Get student counts
  const result = await Promise.all(classes.map(async (c) => {
    const users = await db.orm.public.User.where({ classId: c.id }).all();
    return {
      ...c,
      studentCount: users.length,
      students: users,
    };
  }));
  
  return result.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getClassById(id: string) {
  const cls = await db.orm.public.Classroom.where({ id }).first();
  if (!cls) return null;
  const users = await db.orm.public.User.where({ classId: cls.id }).all();
  return { ...cls, students: users, studentCount: users.length };
}

export async function kickStudent(studentId: string, classId: string) {
  const student = await db.orm.public.User.where({ id: studentId }).first();
  if (!student || student.classId !== classId) {
    throw new Error('Siswa tidak ditemukan atau bukan anggota kelas ini');
  }
  
  await db.orm.public.User.where({ id: studentId }).update({
    classId: null
  });
  return true;
}

export async function joinClass(studentId: string, joinCode: string) {
  const classroom = await db.orm.public.Classroom.where({ joinCode: joinCode.toUpperCase() }).first();
  
  if (!classroom) {
    throw new Error('Kode kelas tidak valid');
  }
  
  if (!classroom.isActive) {
    throw new Error('Kelas ini sudah tidak aktif');
  }

  // Cek kapasitas (Race condition mitigation should ideally be handled via transaction
  // but Prisma ORM 8 doesn't have interactive tx in the standard way yet, we will count then update)
  const currentStudents = await db.orm.public.User.where({ classId: classroom.id }).all();
  
  if (currentStudents.length >= classroom.maxStudents) {
    throw new Error(`Kelas sudah penuh (Maksimal ${classroom.maxStudents} siswa)`);
  }

  // Check if student already in a class
  const student = await db.orm.public.User.where({ id: studentId }).first();
  if (!student) throw new Error('Siswa tidak ditemukan');
  if (student.classId === classroom.id) {
    throw new Error('Anda sudah bergabung di kelas ini');
  }

  // Update
  await db.orm.public.User.where({ id: studentId }).update({
    classId: classroom.id
  });

  return classroom;
}
