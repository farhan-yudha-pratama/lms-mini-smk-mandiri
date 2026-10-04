import { db } from "@/prisma/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import ClientQuizImporter from "./ClientQuizImporter";

export default async function ImportQuizPage(props: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await props.params;

  const page = await db.orm.public.Page.where({ id: pageId }).first();
  
  if (!page) {
    notFound();
  }

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
        <span className="text-gray-900 font-semibold">Import Kuis JSON</span>
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Import Kuis via JSON</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Materi: <span className="font-semibold text-gray-700">{page.title}</span>
          </p>
        </div>
      </div>

      <ClientQuizImporter 
        pageId={page.id} 
        pageTitle={page.title} 
      />
    </div>
  );
}
