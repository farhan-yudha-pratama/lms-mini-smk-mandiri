import { db } from "@/prisma/db";
import { notFound } from "next/navigation";
import ClientQuizImporter from "./ClientQuizImporter";

export default async function ImportQuizPage(props: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await props.params;

  // Fetch halaman
  const page = await db.orm.public.Page.where({ id: pageId }).first();
  
  if (!page) {
    notFound();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Import Kuis via JSON</h1>
        <p className="text-slate-500 mt-1">
          Halaman Materi: <span className="font-semibold">{page.title}</span>
        </p>
      </div>

      <ClientQuizImporter 
        pageId={page.id} 
        pageTitle={page.title} 
      />
    </div>
  );
}
