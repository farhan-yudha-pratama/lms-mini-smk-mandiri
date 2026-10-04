"use client";

import { useState } from "react";
import { joinCourseByCode } from "@/app/actions/student-courses";
import Link from "next/link";

const PUSH =
  "shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all";

// Bento palette rotation (DESIGN.md §E)
const CARD_THEMES = [
  { card: "bg-[#12544F] text-white", badge: "bg-[#8BBB92] text-black", icon: "bg-[#092328] text-[#8BBB92]", desc: "text-white/80", btn: "bg-[#EAF4ED] text-black" },
  { card: "bg-[#2A835F] text-white", badge: "bg-[#092328] text-white", icon: "bg-[#EAF4ED] text-black", desc: "text-white/85", btn: "bg-[#092328] text-white" },
  { card: "bg-white text-black", badge: "bg-[#8BBB92] text-black", icon: "bg-[#092328] text-[#8BBB92]", desc: "text-black/70", btn: "bg-[#2A835F] text-white" },
];

const COURSE_ICONS = ["code", "terminal", "database", "web", "school", "menu_book"];

export default function StudentDashboardClient({
  studentId,
  courses,
  isSuperAdmin,
}: {
  studentId: string;
  courses: any[];
  isSuperAdmin?: boolean;
}) {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setLoading(true);
    setError("");
    try {
      await joinCourseByCode(studentId, joinCode.trim());
      setJoinCode("");
      // Force page refresh since server component passes courses as props
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Gagal bergabung ke mata pelajaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 md:space-y-12">
      {/* ================= ACTION ROW ================= */}
      {/* ================= ACTION ROW ================= */}
      {!isSuperAdmin && (
        <div className="flex">
          {/* Join panel — Jade column (§C) */}
          <section className="w-full md:w-2/3 lg:w-1/2 bg-[#2A835F] border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 md:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
                Gabung Mapel Baru
              </h3>
              <span className="bg-black text-[#8BBB92] font-mono font-bold uppercase text-[11px] px-2 py-0.5 border-2 border-black shrink-0">
                Kode Guru
              </span>
            </div>
            <p className="text-sm font-bold text-white/90">
              Masukkan kode mata pelajaran yang diberikan oleh guru Anda.
            </p>

            <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="join-code" className="sr-only">Kode Mapel</label>
              <input
                id="join-code"
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="CONTOH: XYZ-123"
                disabled={loading}
                required
                className="flex-1 min-w-0 bg-white text-black border-4 border-black p-3 font-mono font-bold uppercase tracking-wider placeholder:text-black/40 shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:bg-[#EAF4ED] transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#092328] text-white font-black uppercase tracking-tight px-6 py-3 border-4 border-black flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${PUSH}`}
              >
                <span className="material-symbols-outlined font-black text-lg">
                  {loading ? "progress_activity" : "login"}
                </span>
                {loading ? "Memproses" : "Gabung"}
              </button>
            </form>

            {error && (
              <div role="alert" className="bg-white text-black border-4 border-black p-3 flex items-start gap-2 shadow-[4px_4px_0px_0px_#000]">
                <span className="material-symbols-outlined font-black text-[#2A835F]">error</span>
                <p className="font-black uppercase text-xs tracking-tight">{error}</p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ================= COURSE BENTO GRID ================= */}
      <section id="mapel-saya" className="scroll-mt-6">
        <div className="flex items-end justify-between gap-4 border-b-4 border-black pb-3 mb-8">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-black">
            {isSuperAdmin ? "Semua Mata Pelajaran" : "Mata Pelajaran Anda"}
          </h2>
          <span className="bg-black text-[#8BBB92] font-mono font-bold uppercase text-xs px-2 py-1 border-2 border-black shrink-0">
            {courses.length} Mapel
          </span>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white border-4 border-black border-dashed p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#092328] border-4 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center -rotate-3">
              <span className="material-symbols-outlined text-[#8BBB92] text-4xl font-black">school</span>
            </div>
            <p className="text-lg md:text-xl font-black uppercase tracking-tight">
              {isSuperAdmin
                ? "Belum ada mata pelajaran pada sistem."
                : "Anda belum bergabung di mata pelajaran apapun."}
            </p>
            {!isSuperAdmin && (
              <p className="mt-2 text-sm font-bold text-black/70">
                Gunakan panel <strong>Gabung Mapel Baru</strong> di atas.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {courses.map((course, idx) => {
              const theme = CARD_THEMES[idx % CARD_THEMES.length];
              const icon = COURSE_ICONS[idx % COURSE_ICONS.length];
              return (
                <article
                  key={course.id}
                  className={`${theme.card} border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 flex flex-col transition-transform hover:-translate-y-1`}
                >
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <div className={`${theme.icon} w-14 h-14 border-4 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center -rotate-3`}>
                      <span className="material-symbols-outlined font-black text-3xl">{icon}</span>
                    </div>
                    <span className={`${theme.badge} border-2 border-black px-2 py-0.5 font-black uppercase text-xs shadow-[2px_2px_0px_0px_#000]`}>
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight mb-3">
                    {course.name}
                  </h3>
                  <p className={`${theme.desc} font-bold text-sm leading-relaxed mb-6 flex-1 line-clamp-3`}>
                    {course.description || "Tidak ada deskripsi untuk mapel ini."}
                  </p>

                  <Link
                    href={`/course/${course.slug}`}
                    className={`${theme.btn} mt-auto border-4 border-black py-3 px-4 font-black uppercase tracking-tight flex items-center justify-between ${PUSH}`}
                  >
                    Masuk Kelas
                    <span className="material-symbols-outlined font-black">arrow_forward</span>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
