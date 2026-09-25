import { aiMultipleChoiceSchema, aiEssaySchema } from "./schema";

export async function generateQuizDraft({
  summaryText,
  questionType,
  totalQuestions,
  difficultyDistribution,
  model = "free-tier",
}: {
  summaryText: string;
  questionType: "PILIHAN_GANDA" | "ESSAY";
  totalQuestions: number;
  difficultyDistribution: { easy: number; medium: number; hard: number };
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

  // Kalkulasi jumlah soal per tingkat kesulitan
  const easyCount = Math.round((difficultyDistribution.easy / 100) * totalQuestions);
  const mediumCount = Math.round((difficultyDistribution.medium / 100) * totalQuestions);
  const hardCount = totalQuestions - easyCount - mediumCount;

  let difficultyPrompt = "";
  if (questionType === "PILIHAN_GANDA") {
    difficultyPrompt = `Buat tepat ${totalQuestions} soal pilihan ganda. Spesifikasi tingkat kesulitan: ${easyCount} soal mudah, ${mediumCount} soal sedang, dan ${hardCount} soal sulit (HOTS). Setiap soal HARUS memiliki tepat 4 opsi jawaban (A, B, C, D) dengan tepat 1 jawaban yang benar.`;
  } else {
    difficultyPrompt = `Buat tepat ${totalQuestions} soal essay yang membutuhkan penalaran/analisis. Spesifikasi tingkat kesulitan: ${easyCount} soal mudah, ${mediumCount} soal sedang, dan ${hardCount} soal sulit (HOTS).`;
  }

  const systemPrompt = `Kamu adalah ahli pembuat soal evaluasi pembelajaran. Tugasmu adalah membuat soal berdasarkan materi yang diberikan.
${difficultyPrompt}
Penting: Dilarang membuat soal yang informasinya tidak terdapat atau tidak bisa disimpulkan dari teks materi yang diberikan.

Anda WAJIB merespon HANYA dengan objek JSON murni tanpa awalan markdown (tanpa \`\`\`json).
Format JSON yang diharapkan jika Pilihan Ganda:
{
  "questions": [
    {
      "questionText": "Teks soal",
      "options": [
        { "optionText": "Opsi A", "isCorrect": false },
        { "optionText": "Opsi B", "isCorrect": true }
      ]
    }
  ]
}
Format JSON jika Essay:
{
  "questions": [
    { "questionText": "Teks soal" }
  ]
}`;

  // Gunakan JSON Schema langsung
  const jsonSchema = questionType === "PILIHAN_GANDA"
    ? {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              questionText: { type: "string" },
              options: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    optionText: { type: "string" },
                    isCorrect: { type: "boolean" }
                  },
                  required: ["optionText", "isCorrect"]
                }
              }
            },
            required: ["questionText", "options"]
          }
        }
      },
      required: ["questions"]
    }
    : {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              questionText: { type: "string" }
            },
            required: ["questionText"]
          }
        }
      },
      required: ["questions"]
    };

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
          { role: 'user', content: `Materi:\n\n${summaryText}\n\nBuatkan soalnya sekarang.` }
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
    let content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Respon API kosong atau format salah.");
    }

    // Bersihkan backticks markdown jika ada (misal: ```json ... ```)
    content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    const parsed = JSON.parse(content);
    return {
      success: true,
      data: parsed.questions,
    };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return {
      success: false,
      message: error.message || "Gagal menghubungi AI (9Router). Silakan coba lagi.",
    };
  }
}
