const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const pkgs = await prisma.quizPackage.findMany();
  pkgs.forEach(p => console.log('PKG:', p.id, p.title, 'Active:', p.isActive, 'Hidden:', p.isHidden));
  const assignments = await prisma.quizAssignment.findMany();
  console.log('Assignments count:', assignments.length);
}
run().finally(() => prisma.$disconnect());
