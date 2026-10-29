import type { KnowledgeArticle } from './types';

interface GroqResponse {
  answer: string;
}

interface GroqError {
  error: string;
}

export interface GroqResult {
  text: string;
  error: boolean;
}

export async function callGroqAssistant(
  question: string,
  contextArticles: KnowledgeArticle[],
): Promise<GroqResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { text: '', error: true };
  }

  const functionUrl = `${supabaseUrl}/functions/v1/groq-assistant`;

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({
        question,
        context: contextArticles.map((a) => ({
          id: a.id,
          title: a.title,
          solution: a.solution,
          steps: a.steps,
        })),
      }),
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as GroqError | null;
      const msg =
        errorBody?.error ??
        (response.status === 429
          ? 'Limite de uso da IA atingido. Tente novamente em instantes.'
          : 'Erro ao consultar o modelo de IA.');
      return { text: msg, error: true };
    }

    const data = (await response.json()) as GroqResponse;
    if (!data.answer || typeof data.answer !== 'string') {
      return { text: 'O modelo não retornou uma resposta válida.', error: true };
    }

    return { text: data.answer, error: false };
  } catch {
    return {
      text: 'Não foi possível conectar ao serviço de IA. Verifique sua conexão.',
      error: true,
    };
  }
}
