import Headbar from "@/components/Headbar";
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

  // Fake userId mapping for now since session only has email usually, unless it's properly set
  const userId = session?.userId || "";

  let courses: any[] = [];
  if (isSuperAdmin) {
    courses = await getCourses();
  } else if (userId) {
    courses = await getStudentCourses(userId);
  }

  return (
    <>
      <Headbar links={[{ label: "Beranda", href: "/", isActive: true }]} />

      <div
        className="flex pt-[88px] min-h-screen bg-canvas"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-outline) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <main className="w-full p-4 md:p-10 relative">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Header Section */}
            <div className="mt-8 text-center relative">
              <div className="relative z-10">
                <span className="bg-pine-deep border-4 border-black px-6 py-2 font-black text-white uppercase shadow-neo-sm inline-block tracking-widest text-sm md:text-xl mb-6 transform -rotate-2 hover:rotate-0 hover:scale-110 transition-transform cursor-default">
                  Halo, {userName}!
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mt-2 text-black tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Mulai Belajar
                </h2>
              </div>
            </div>

            <StudentDashboardClient studentId={userId} courses={courses} isSuperAdmin={isSuperAdmin} />

            <footer className="mt-16 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t-4 border-black pt-8">
              <p className="font-black text-sm md:text-base uppercase tracking-widest text-forest-teal bg-white border-4 border-black px-4 py-2 shadow-neo-sm text-center md:text-left">
                Ac 2026 FARHAN YUDHA PRATAMA
              </p>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}
