import fs from 'fs/promises';
import path from 'path';
import { db } from "@/prisma/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import ClientSummaryGenerator from "./ClientSummaryGenerator";

export default async function GenerateSummaryPage(props: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await props.params;

  const page = await db.orm.public.Page.where({ id: pageId }).first();
  if (page) {
    const category = await db.orm.public.MaterialCategory.where({ id: page.categoryId }).first();
    (page as any).category = category;
  }
  
  if (!page) {
    notFound();
  }

  // Fetch summaries to act as the "raw material"
  const summaries = await db.orm.public.PageSummary.where({ pageId }).all();
  summaries.sort((a: any, b: any) => a.orderIndex - b.orderIndex);

  // Combine them
  let combinedSummary = summaries
    .map((s: any) => `[${s.title}]\n${s.content}`)
    .join("\n\n");

  // BACA HARDCODED FILE (.tsx)
  let hardcodedMaterial = "";
  try {
    if ((page as any).category && page.slug) {
      // Path format: app/(materi)/([categorySlug])/[pageSlug]/page.tsx
      const categorySlug = (page as any).category.slug;
      const tsxPath = path.join(process.cwd(), 'app', '(materi)', `(${categorySlug})`, page.slug, 'page.tsx');
      
      // Check if file exists
      const fileExists = await fs.access(tsxPath).then(() => true).catch(() => false);
      if (fileExists) {
        hardcodedMaterial = await fs.readFile(tsxPath, 'utf-8');
      }
    }
  } catch (error) {
    console.error("Gagal membaca file materi hardcode:", error);
  }

  // Jika ada file TSX hardcode, gabungkan juga untuk AI
  let finalContentToAi = combinedSummary;
  if (hardcodedMaterial) {
    finalContentToAi += `\n\n--- SUMBER MATERI DARI KODE SUMBER --- \n\n` + hardcodedMaterial;
  }


  const isAiEnabled = process.env.ENABLE_AI_FEATURES !== "false";
  const defaultModel = process.env.AI_DEFAULT_MODEL || "free-tier";

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
        <span className="text-gray-900 font-semibold">Generate Rangkuman AI</span>
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Generate Rangkuman Otomatis (AI)</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Materi: <span className="font-semibold text-gray-700">{page.title}</span>
          </p>
        </div>
      </div>

      <ClientSummaryGenerator 
        pageId={page.id} 
        pageTitle={page.title} 
        pageContent={finalContentToAi} 
        isAiEnabled={isAiEnabled}
        defaultModel={defaultModel}
      />
    </div>
  );
}
