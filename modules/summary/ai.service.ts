export async function generateSummaryDraft({
  content,
  model = "free-tier",
}: {
  content: string;
  model?: string;
}) {
  if (process.env.ENABLE_AI_FEATURES === "false") {
    return {
      success: false,
      message: "Fitur AI dinonaktifkan sementara pada mode Shared Hosting.",
    };
  }

  const apiKey = process.env.NINEROUTER_API_KEY;
  const baseURL = process.env.NINEROUTER_BASE_URL || "https://api.9router.com/v1";

  if (!apiKey) {
    return {
      success: false,
      message: "NINEROUTER_API_KEY belum diset di environment variables",
    };
  }

  const wordCount = content.split(/\s+/).length;
  let systemPrompt = `Kamu adalah ahli pembuat rangkuman materi pembelajaran.
Tugasmu adalah membaca materi yang diberikan dan membuat rangkuman yang SANGAT DETAIL dan komprehensif.`;

  if (wordCount > 3000) {
    systemPrompt += `
Karena materi sangat panjang (> 3000 kata), kamu WAJIB membaginya menjadi dua bagian:
1. Rangkuman Detail (mencakup semua poin penting).
2. Intisari Singkat (sebuah sub-bagian di akhir bernama 'Intisari' yang berisi poin-poin paling penting).`;
  }

  systemPrompt += `

Anda WAJIB merespon HANYA dengan objek JSON murni tanpa awalan markdown (tanpa \`\`\`json).
Format JSON yang diharapkan:
{
  "title": "Judul Rangkuman (Maks 100 karakter)",
  "content": "Isi rangkuman dalam format teks biasa atau markdown ringan..."
}`;

  try {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Materi:\n\n${content}\n\nBuatkan rangkumannya sekarang.` }
        ],
        response_format: {
          type: 'json_object'
        },
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("API Error Response:", errText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let resContent = data.choices?.[0]?.message?.content;

    if (!resContent) {
      throw new Error("Respon API kosong atau format salah.");
    }

    resContent = resContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    const parsed = JSON.parse(resContent);
    return {
      success: true,
      data: parsed,
    };
  } catch (error: any) {
    console.error("AI Summary Generation Error:", error);
    return {
      success: false,
      message: error.message || "Gagal menghubungi AI (9Router). Silakan coba lagi.",
    };
  }
}
