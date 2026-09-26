import { db } from "@/prisma/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import ClientQuizGenerator from "./ClientQuizGenerator";

export default async function GenerateQuizPage(props: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await props.params;

  const page = await db.orm.public.Page.where({ id: pageId }).first();
  
  if (!page) {
    notFound();
  }

  // Fetch summaries
  const summaries = await db.orm.public.PageSummary.where({ pageId }).all();
  summaries.sort((a: any, b: any) => a.orderIndex - b.orderIndex);

  // Gabungkan semua konten rangkuman menjadi satu teks panjang
  const combinedSummary = summaries
    .map((s: any) => `[${s.title}]\n${s.content}`)
    .join("\n\n");

  if (!combinedSummary.trim()) {
    return (
      <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/dashboard/summaries" className="hover:text-blue-600 transition-colors">
            Manajemen Summary
          </Link>
          <span className="material-symbols-outlined text-xs text-gray-400">chevron_right</span>
          <Link href={`/dashboard/summaries/${page.id}`} className="hover:text-blue-600 transition-colors truncate max-w-xs">
            {page.title}
          </Link>
          <span className="material-symbols-outlined text-xs text-gray-400">chevron_right</span>
          <span className="text-gray-900 font-semibold">Generate Kuis AI</span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Belum Ada Rangkuman Materi</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Halaman ini belum memiliki rangkuman materi. Generator AI membutuhkan ringkasan teks untuk membuat butir-butir soal yang relevan.
          </p>
          <Link
            href={`/dashboard/summaries/${page.id}/create`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Tambah Rangkuman Materi</span>
          </Link>
        </div>
      </div>
    );
  }

  const isAiEnabled = process.env.ENABLE_AI_FEATURES !== "false";

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link 
          href="/dashboard/summaries" 
          className="hover:text-blue-600 transition-colors"
        >
          Manajemen Summary
        </Link>
        <span className="material-symbols-outlined text-xs text-gray-400">chevron_right</span>
        <Link 
          href={`/dashboard/summaries/${page.id}`} 
          className="hover:text-blue-600 transition-colors truncate max-w-[150px] sm:max-w-xs"
        >
          {page.title}
        </Link>
        <span className="material-symbols-outlined text-xs text-gray-400">chevron_right</span>
        <span className="text-gray-900 font-semibold">Generate Kuis AI</span>
      </div>

      {/* Header & Back Button */}
      <div className="flex items-center gap-3">
        <Link 
          href={`/dashboard/summaries/${page.id}`} 
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors flex items-center justify-center shadow-sm shrink-0"
          title="Kembali ke Kelola Summary"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Generate Kuis Otomatis (AI)</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Materi: <span className="font-semibold text-gray-700">{page.title}</span>
          </p>
        </div>
      </div>

      <ClientQuizGenerator 
        pageId={page.id} 
        pageTitle={page.title} 
        summaryText={combinedSummary} 
        isAiEnabled={isAiEnabled}
      />
    </div>
  );
}
