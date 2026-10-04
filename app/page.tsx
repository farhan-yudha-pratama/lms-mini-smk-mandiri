import StudentDashboardShell from "@/components/student/StudentDashboardShell";
import { getSession } from "@/lib/session";
import { getStudentCourses } from "@/app/actions/student-courses";
import { getCourses } from "@/app/actions/course";
import StudentDashboardClient from "@/components/student/StudentDashboardClient";

export default async function Page() {
  const session = await getSession();
  const userName =
    (session?.name as string) ||
    (session?.email as string)?.split("@")[0] ||
    "Siswa";

  const role = session?.role || "MURID";
  const isSuperAdmin = role === "SUPERADMIN";
  const roleLabel = isSuperAdmin ? "Superadmin" : role === "GURU" ? "Guru" : "Siswa";

  // Fake userId mapping for now since session only has email usually, unless it's properly set
  const userId = session?.userId || "";

  let courses: any[] = [];
  if (isSuperAdmin) {
    courses = await getCourses();
  } else if (userId) {
    courses = await getStudentCourses(userId);
  }

  const initial = userName.charAt(0).toUpperCase();

  return (
    <StudentDashboardShell userName={userName} userClass={roleLabel} roleLabel={roleLabel}>
      {/* ================= HERO CANVAS ================= */}
      <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10">
          {/* Rotated identity box */}
          <div className="relative shrink-0 self-start md:self-center">
            <div className="w-28 h-28 md:w-36 md:h-36 bg-[#092328] border-4 border-black shadow-[8px_8px_0px_0px_#000] flex items-center justify-center transform -rotate-2 hover:rotate-0 transition-transform">
              <span className="text-[#8BBB92] font-black text-6xl md:text-7xl leading-none">{initial}</span>
            </div>
            <span className="absolute -top-3 -right-4 bg-[#8BBB92] text-black font-black uppercase text-xs px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] rotate-3">
              {roleLabel}
            </span>
          </div>

          {/* Typography block */}
          <div className="flex-1 min-w-0">
            <p className="inline-block bg-black text-[#8BBB92] font-mono font-bold uppercase text-xs md:text-sm px-2 py-1 mb-4">
              Halo, {userName}!
            </p>
            <h1 className="font-black uppercase tracking-tighter text-black text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
              Mulai Belajar
              <br />
              <span className="text-[#2A835F]">Hari Ini.</span>
            </h1>
            <p className="mt-4 font-bold text-black/80 text-base md:text-lg max-w-2xl">
              Pilih mata pelajaran, baca materi secara berurutan, dan selesaikan kuis untuk membuka materi berikutnya.
            </p>

            {/* Chip row */}
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="bg-white text-black border-4 border-black px-3 py-1.5 font-black uppercase text-xs md:text-sm shadow-[4px_4px_0px_0px_#000]">
                {roleLabel}
              </span>
              <span className="bg-[#092328] text-white border-4 border-black px-3 py-1.5 font-black uppercase text-xs md:text-sm shadow-[4px_4px_0px_0px_#000]">
                {courses.length} Mapel
              </span>
              <span className="bg-[#2A835F] text-white border-4 border-black px-3 py-1.5 font-black uppercase text-xs md:text-sm shadow-[4px_4px_0px_0px_#000]">
                Belajar Bertahap
              </span>
              <span className="bg-[#8BBB92] text-black border-4 border-black px-3 py-1.5 font-black uppercase text-xs md:text-sm shadow-[4px_4px_0px_0px_#000]">
                Kuis Interaktif
              </span>
            </div>
          </div>
        </div>
      </section>

      <StudentDashboardClient studentId={userId} courses={courses} isSuperAdmin={isSuperAdmin} />
    </StudentDashboardShell>
  );
}
