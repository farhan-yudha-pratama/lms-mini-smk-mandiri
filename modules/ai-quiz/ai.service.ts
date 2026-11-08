import { buildQuizPrompt } from "./prompt-builder";

export async function generateQuizDraft({
  summaryText = "",
  questionType,
  codeLanguage,
  phpMode = "LOGIC",
  totalQuestions,
  difficultyDistribution,
  model = "free-tier",
  customPrompt,
  alignWithMaterial = true,
  materialTitle,
  previousQuestions = [],
}: {
  summaryText?: string;
  questionType: "PILIHAN_GANDA" | "ESSAY" | "CODE_CHALLENGE";
  codeLanguage?: "sql" | "php" | "html";
  phpMode?: "LOGIC" | "WEB" | "MIXED";
  totalQuestions: number;
  difficultyDistribution: { easy: number; medium: number; hard: number };
  model?: string;
  customPrompt?: string;
  alignWithMaterial?: boolean;
  materialTitle?: string;
  previousQuestions?: string[];
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

  const resolvedCodeLang: "html" | "sql" | "php" =
    codeLanguage === "html"
      ? "html"
      : codeLanguage === "php" || (!codeLanguage && ((materialTitle && /php/i.test(materialTitle)) || (summaryText && /php/i.test(summaryText))))
      ? "php"
      : "sql";

  const isPhpChallenge = questionType === "CODE_CHALLENGE" && resolvedCodeLang === "php";

  const { systemPrompt, userContent } = buildQuizPrompt({
    summaryText: alignWithMaterial ? summaryText : "",
    materialTitle,
    questionType,
    codeLanguage: resolvedCodeLang,
    phpMode,
    totalQuestions,
    difficultyDistribution,
    customPrompt,
    previousQuestions,
  });

  try {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 4000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        response_format: {
          type: "json_object",
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
    content = content.replace(/^```json\s*/, "").replace(/\s*```$/, "");

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError: any) {
      console.error("JSON Parse Error:", parseError, "Raw Content:", content);
      throw new Error(
        `AI berhenti menghasilkan respons sebelum selesai (terpotong). Silakan ulangi generate atau kurangi jumlah soal.`
      );
    }

    const questionsList = parsed.questions || [];

    // Jika CODE_CHALLENGE, lakukan self-verification in-memory
    if (questionType === "CODE_CHALLENGE" && Array.isArray(questionsList)) {
      if (isPhpChallenge) {
        try {
          const { runPhpCode, runPhpTestCases } = await import("@/lib/virtual-php");
          for (const q of questionsList) {
            q.codeLanguage = "php";
            q.points = q.points || 20;
            if (typeof q.testCases === "string") {
              try {
                q.testCases = JSON.parse(q.testCases);
              } catch {}
            }
            if (q.solutionCode && Array.isArray(q.testCases) && q.testCases.length > 0) {
              try {
                const rep = await runPhpTestCases(q.solutionCode, q.testCases);
                q.isVerified = rep.passedCount === rep.totalCount;
              } catch (vErr) {
                console.warn("AI PHP Code Challenge verification notice:", vErr);
              }
            } else if (q.solutionCode) {
              try {
                const out = await runPhpCode(q.solutionCode);
                q.isVerified = out.success && !out.error;
              } catch {}
            }
          }
        } catch (importErr) {
          console.warn("Virtual PHP verification skipped:", importErr);
        }
      } else if (resolvedCodeLang === "sql") {
        try {
          const { executeVirtualSql, runSqlTestCases } = await import("@/lib/virtual-db");
          for (const q of questionsList) {
            q.codeLanguage = "sql";
            q.points = q.points || 20;
            if (typeof q.testCases === "string") {
              try {
                q.testCases = JSON.parse(q.testCases);
              } catch {}
            }
            if (q.solutionCode && q.testCases) {
              try {
                const { db: vDb, output } = await executeVirtualSql(q.solutionCode, q.initialCode);
                const rep = runSqlTestCases(vDb, q.testCases, output.results, output);
                q.isVerified = rep.passedCount === rep.totalCount;
              } catch (vErr) {
                console.warn("AI Code Challenge verification notice:", vErr);
              }
            }
          }
        } catch (importErr) {
          console.warn("Virtual DB verification skipped:", importErr);
        }
      } else if (resolvedCodeLang === "html") {
        for (const q of questionsList) {
          q.codeLanguage = "html";
          q.points = q.points || 20;
          q.testCases = [];
          q.isVerified = true;
        }
      }
    }

    return {
      success: true,
      data: questionsList,
    };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return {
      success: false,
      message: error.message || "Gagal menghubungi AI. Silakan coba lagi.",
    };
  }
}
