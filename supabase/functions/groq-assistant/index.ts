// Edge function: groq-assistant
// Receives a user question plus relevant knowledge-base context,
// calls the Groq Cloud chat completions API, and returns the AI response.
// The GROQ_API_KEY is read from server-side env — never exposed to the frontend.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

interface ContextArticle {
  id: string;
  title: string;
  solution: string;
  steps?: string[];
}

interface RequestBody {
  question: string;
  context: ContextArticle[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GROQ_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "A chave GROQ_API_KEY não está configurada no servidor." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body: RequestBody = await req.json();
    const question = body.question?.trim();
    const context = body.context ?? [];

    if (!question) {
      return new Response(
        JSON.stringify({ error: "A pergunta não pode estar vazia." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const contextText = context.length > 0
      ? context.map((a, i) =>
          `[Artigo ${i + 1}: ${a.title}]\n${a.solution}` +
          (a.steps && a.steps.length > 0 ? `\nPassos: ${a.steps.map((s, j) => `${j + 1}. ${s}`).join("; ")}` : "")
        ).join("\n\n")
      : "Nenhum artigo relevante encontrado.";

    const systemPrompt = [
      "Você é o assistente de atendimento ResolveAI.",
      "Responda SEMPRE em português brasileiro, de forma clara e objetiva.",
      "Use APENAS as informações fornecidas na base de conhecimento abaixo.",
      "Se as fontes fornecidas não contêm a resposta, diga que não há informação suficiente e que o caso será encaminhado a um atendente humano.",
      "NÃO invente informações, prazos, valores ou procedimentos que não estejam nas fontes.",
      "Quando a resposta incluir passos, liste-os em formato numerado.",
      "Mantenha um tom profissional e empático.",
    ].join(" ");

    const userPrompt = [
      "Base de conhecimento relevante:",
      contextText,
      "",
      `Pergunta do usuário: ${question}`,
      "",
      "Responda com base apenas nas fontes acima.",
    ].join("\n");

    const groqResponse = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 600,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errorText);
      const status = groqResponse.status === 429 ? 429 : 502;
      return new Response(
        JSON.stringify({
          error: status === 429
            ? "Limite de uso da API atingido. Tente novamente em instantes."
            : "Erro ao consultar o modelo de IA. Tente novamente.",
        }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const groqData = await groqResponse.json();
    const answer = groqData?.choices?.[0]?.message?.content;

    if (!answer || typeof answer !== "string") {
      return new Response(
        JSON.stringify({ error: "O modelo não retornou uma resposta válida." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ answer: answer.trim() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("groq-assistant error:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor ao processar a solicitação." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
