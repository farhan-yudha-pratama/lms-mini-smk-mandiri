import { db } from "@/prisma/db";
import { notFound } from "next/navigation";
import ClientQuizGenerator from "./ClientQuizGenerator";

export default async function GenerateQuizPage(props: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await props.params;

  // Fetch halaman dan semua summaries-nya
  const page = await db.orm.public.Page.where({ id: pageId }).first();
  
  if (!page) {
    notFound();
  }

  // Fetch summaries
  const summaries = await db.orm.public.PageSummary.where({ pageId }).all();
  // Sort manual karena tidak ada orderBy di query sederhana ini
  summaries.sort((a: any, b: any) => a.orderIndex - b.orderIndex);

  // Gabungkan semua konten rangkuman menjadi satu teks panjang
  const combinedSummary = summaries
    .map((s: any) => `[${s.title}]\n${s.content}`)
    .join("\n\n");

  if (!combinedSummary.trim()) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Generate Kuis AI</h1>
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
          Halaman ini belum memiliki rangkuman materi. Silakan tambahkan rangkuman materi terlebih dahulu sebelum men-generate soal.
        </div>
      </div>
    );
  }

  const isAiEnabled = process.env.ENABLE_AI_FEATURES !== "false";

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Generate Kuis AI</h1>
        <p className="text-slate-500 mt-1">
          Halaman Materi: <span className="font-semibold">{page.title}</span>
        </p>
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
