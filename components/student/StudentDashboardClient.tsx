"use client";

import { useState } from "react";
import { joinCourseByCode } from "@/app/actions/student-courses";
import Link from "next/link";

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
    if (!joinCode) return;
    setLoading(true);
    setError("");
    try {
      await joinCourseByCode(studentId, joinCode);
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
    <div className="space-y-12">
      {/* Join Course Box */}
      {!isSuperAdmin && (
        <div className="bg-white border-4 border-black p-6 shadow-neo-md max-w-xl mx-auto transform hover:-rotate-1 transition-transform">
          <h3 className="text-xl font-black uppercase mb-4">
            Bergabung ke Mata Pelajaran Baru
          </h3>
          <form onSubmit={handleJoin} className="flex gap-2 flex-col sm:flex-row">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Masukkan Kode Mapel..."
              className="flex-1 border-2 border-black p-3 uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-jade-vibrant text-white font-black uppercase px-6 py-3 border-2 border-black hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "GABUNG"}
            </button>
          </form>
          {error && (
            <p className="text-red-600 font-bold mt-2 text-sm">{error}</p>
          )}
        </div>
      )}

      {/* Course Grid */}
      <div>
        <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-2 mb-6">
          {isSuperAdmin ? "Semua Mata Pelajaran" : "Mata Pelajaran Anda"}
        </h2>

        {courses.length === 0 ? (
          <div className="bg-canvas border-4 border-black border-dashed p-10 text-center">
            <span className="material-symbols-outlined text-5xl mb-4">
              school
            </span>
            <p className="text-xl font-bold text-gray-700">
              {isSuperAdmin ? "Belum ada mata pelajaran pada sistem." : "Anda belum bergabung di mata pelajaran apapun."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <div
                key={course.id}
                className="border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform flex flex-col bg-white"
              >
                <div className="w-16 h-16 bg-blue-600 text-white border-4 border-black flex items-center justify-center shadow-neo-sm mb-6 transform -rotate-3">
                  <span className="material-symbols-outlined font-black text-4xl">
                    book
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3 border-b-4 border-current pb-2">
                  {course.name}
                </h3>
                <p className="font-bold flex-1 text-gray-600 text-sm mb-6 leading-relaxed">
                  {course.description || "Tidak ada deskripsi mapel ini."}
                </p>
                <Link
                  href={`/course/${course.slug}`}
                  className="mt-auto bg-black text-white font-black uppercase tracking-widest text-center py-3 border-4 border-black hover:bg-white hover:text-black transition-colors"
                >
                  Masuk Kelas
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
