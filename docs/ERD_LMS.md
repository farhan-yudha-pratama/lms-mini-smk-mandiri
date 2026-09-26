# 📐 ERD LMS - WebPoint Learning Management System

Copy the script below and paste it into [dbdiagram.io](https://dbdiagram.io) to generate the ERD.

```dbml
// ================================
// ENUM DEFINITIONS
// ================================

Enum Role {
  SUPERADMIN
  GURU
  MURID
}

Enum QuestionType {
  PILIHAN_GANDA
  ESSAY
}

Enum QuizAttemptStatus {
  IN_PROGRESS
  COMPLETED
  GRADED
}

Enum PageAccessStatus {
  LOCKED
  UNLOCKED
  COMPLETED
}

// ================================
// TABLE DEFINITIONS
// ================================

Table Classroom {
  id          String   [pk, note: 'UUID']
  name        String   [note: 'Contoh: XI RPL 2']
  joinCode    String   [unique, note: 'Kode unik untuk murid join, misal RPL2-XYZ9']
  maxStudents Int      [default: 32, note: 'Kapasitas maksimal kelas']
  isActive    Boolean  [default: true]
  createdAt   DateTime [default: `now()`]
  updatedAt   DateTime
}

Table User {
  id                    String    [pk, note: 'UUID']
  name                  String
  email                 String    [unique]
  password              String    [note: 'Hashed with bcrypt']
  role                  Role      [default: 'MURID']
  avatar                String    [null]
  isActive              Boolean   [default: true, note: 'Akun dinonaktifkan oleh Superadmin']
  classId               String    [null, note: 'FK -> Classroom (Hanya untuk MURID)']
  failedLoginAttempts   Int       [default: 0, note: 'Anti brute-force']
  lockedUntil           DateTime  [null, note: 'Batas waktu akun terkunci']
  createdAt             DateTime  [default: `now()`]
  updatedAt             DateTime
}

Table Session {
  id              String    [pk, note: 'UUID']
  userId          String    [note: 'FK → User']
  refreshToken    String    [null, unique]
  userAgent       String    [null]
  ipAddress       String    [null]
  expiresAt       DateTime
  createdAt       DateTime  [default: `now()`]
}

Table AuditLog {
  id              String    [pk, note: 'UUID']
  userId          String    [null, note: 'FK → User']
  action          String    [note: 'Contoh: LOGIN_SUCCESS']
  details         String    [null]
  ipAddress       String    [null]
  createdAt       DateTime  [default: `now()`]
}

Table MaterialCategory {
  id            String    [pk, note: 'UUID']
  name          String    [note: 'Contoh: HTML, CSS, JavaScript, PHP, Bootstrap']
  slug          String    [unique, note: 'URL-friendly, contoh: html, css, js']
  description   String    [null]
  icon          String    [null, note: 'Nama icon atau path gambar']
  orderIndex    Int       [unique, note: 'Urutan kategori di sidebar/menu']
  isActive      Boolean   [default: true]
  createdAt     DateTime  [default: `now()`]
  updatedAt     DateTime
}

Table Page {
  id            String    [pk, note: 'UUID']
  categoryId    String    [note: 'FK → MaterialCategory']
  title         String    [note: 'Contoh: Pengenalan HTML, Tag Dasar HTML']
  slug          String    [unique, note: 'URL path, contoh: pengenalan-html']
  description   String    [null, note: 'Deskripsi singkat halaman']
  orderIndex    Int       [note: 'Urutan halaman dalam kategori']
  isPublished   Boolean   [default: false, note: 'Guru bisa draft/publish halaman']
  createdAt     DateTime  [default: `now()`]
  updatedAt     DateTime

  Note: 'Unique constraint pada [categoryId, orderIndex]'
}

Table PageSummary {
  id            String    [pk, note: 'UUID']
  pageId        String    [note: 'FK → Page']
  title         String    [note: 'Judul section rangkuman, contoh: Tag Heading, Tag Paragraf']
  content       String    [note: 'Isi rangkuman materi (markdown/text). Digunakan AI untuk generate bank soal']
  orderIndex    Int       [note: 'Urutan section dalam halaman']
  createdAt     DateTime  [default: `now()`]
  updatedAt     DateTime

  Note: 'Menyimpan rangkuman materi per section. Data ini bisa di-feed ke AI untuk generate soal otomatis.'
}

Table PageSequence {
  id                    String    [pk, note: 'UUID']
  pageId                String    [unique, note: 'FK → Page (halaman yang akan di-unlock)']
  prerequisitePageId    String    [null, note: 'FK → Page (halaman yang harus diselesaikan). NULL = langsung terbuka']
  minQuizScore          Float     [default: 70.0, note: 'Skor minimum quiz prerequisite untuk membuka halaman ini']
  createdAt             DateTime  [default: `now()`]
  updatedAt             DateTime

  Note: 'Mendefinisikan urutan prerequisite antar halaman'
}

Table QuizPackage {
  id               String    [pk, note: 'UUID']
  pageId           String    [unique, note: 'FK → Page (1 halaman = 1 quiz)']
  title            String
  description      String    [null]
  passingScore     Float     [default: 70.0, note: 'Skor minimum untuk lulus']
  timeLimit        Int       [null, note: 'Batas waktu dalam menit, null = tanpa batas']
  shuffleQuestions Boolean   [default: false]
  isActive         Boolean   [default: true]
  createdAt        DateTime  [default: `now()`]
  updatedAt        DateTime
}

Table QuizVariant {
  id              String    [pk, note: 'UUID']
  quizPackageId   String    [note: 'FK -> QuizPackage']
  name            String    [note: 'Contoh: Paket A, Paket B']
  createdAt       DateTime  [default: `now()`]
  updatedAt       DateTime
}

Table Question {
  id              String        [pk, note: 'UUID']
  quizVariantId   String        [note: 'FK -> QuizVariant']
  questionText    String        [note: 'Isi pertanyaan']
  questionType    QuestionType  [default: 'PILIHAN_GANDA']
  points          Float         [default: 1.0, note: 'Bobot nilai soal']
  orderIndex      Int           [note: 'Urutan soal dalam quiz']
  createdAt       DateTime      [default: `now()`]
  updatedAt       DateTime
}

Table QuestionOption {
  id            String    [pk, note: 'UUID']
  questionId    String    [note: 'FK -> Question']
  optionText    String    [note: 'Teks pilihan jawaban']
  isCorrect     Boolean   [default: false, note: 'Kunci jawaban']
  orderIndex    Int       [note: 'Urutan opsi']
}

Table QuizAssignment {
  id              String    [pk, note: 'UUID']
  quizPackageId   String    [note: 'FK -> QuizPackage']
  quizVariantId   String    [note: 'FK -> QuizVariant']
  studentId       String    [note: 'FK -> User']
  assignedAt      DateTime  [default: `now()`]

  Note: 'Unique constraint pada [quizPackageId, studentId]'
}

Table QuizAttempt {
  id              String            [pk, note: 'UUID']
  quizVariantId   String            [note: 'FK -> QuizVariant']
  studentId       String            [note: 'FK -> User (MURID)']
  score           Float             [null, note: 'Skor akhir, null jika belum selesai']
  status          QuizAttemptStatus [default: 'IN_PROGRESS']
  startedAt       DateTime          [default: `now()`]
  finishedAt      DateTime          [null]
}

Table StudentAnswer {
  id                 String    [pk, note: 'UUID']
  quizAttemptId      String    [note: 'FK → QuizAttempt']
  questionId         String    [note: 'FK → Question']
  selectedOptionId   String    [null, note: 'FK → QuestionOption (Pilihan Ganda)']
  essayAnswer        String    [null, note: 'Jawaban essay']
  isCorrect          Boolean   [null, note: 'null = belum dinilai']
  pointsEarned       Float     [default: 0]
}

Table PageAccess {
  id            String           [pk, note: 'UUID']
  pageId        String           [note: 'FK → Page']
  studentId     String           [note: 'FK → User (MURID)']
  status        PageAccessStatus [default: 'LOCKED']
  unlockedAt    DateTime         [null]
  completedAt   DateTime         [null]

  Note: 'Unique constraint pada [pageId, studentId]'
}

// ================================
// RELATION DEFINITIONS
// ================================

Ref: User.classId > Classroom.id
Ref: Session.userId > User.id
Ref: AuditLog.userId > User.id

Ref: Page.categoryId > MaterialCategory.id
Ref: PageSummary.pageId > Page.id
Ref: PageSequence.pageId - Page.id
Ref: PageSequence.prerequisitePageId > Page.id

Ref: QuizPackage.pageId - Page.id
Ref: QuizVariant.quizPackageId > QuizPackage.id
Ref: Question.quizVariantId > QuizVariant.id
Ref: QuestionOption.questionId > Question.id

Ref: QuizAssignment.quizPackageId > QuizPackage.id
Ref: QuizAssignment.quizVariantId > QuizVariant.id
Ref: QuizAssignment.studentId > User.id

Ref: QuizAttempt.quizVariantId > QuizVariant.id
Ref: QuizAttempt.studentId > User.id

Ref: StudentAnswer.quizAttemptId > QuizAttempt.id
Ref: StudentAnswer.questionId > Question.id
Ref: StudentAnswer.selectedOptionId > QuestionOption.id

Ref: PageAccess.pageId > Page.id
Ref: PageAccess.studentId > User.id
```
