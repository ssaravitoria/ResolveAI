import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, ArrowUpRight, AlertTriangle, ShieldAlert, BookOpen } from 'lucide-react';
import type { ChatMessage, SessionRecord, View } from '@/lib/types';
import { CATEGORY_LABELS, URGENCY_LABELS, URGENCY_STYLES } from '@/lib/types';
import { resolveQuestion, getKnowledgeBase } from '@/lib/knowledge';
import { callGroqAssistant } from '@/lib/groq';
import { generateId } from '@/lib/seed';

interface ChatPanelProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onResolved: (record: SessionRecord) => void;
  onNavigate: (view: View) => void;
}

const SUGGESTIONS = [
  'Meu pedido atrasou, como acompanho?',
  'Pagamento no cartão foi recusado',
  'Como cancelar um pedido?',
  'Minha conta foi invadida e estão fazendo compras sem autorização',
];

export function ChatPanel({ messages, setMessages, onResolved, onNavigate }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: generateId('msg'),
      role: 'user',
      text: trimmed,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const result = resolveQuestion(trimmed);

    if (result.critical || result.forwarded || !result.article) {
      const delay = 400 + Math.min(trimmed.length * 4, 500);
      window.setTimeout(() => {
        const agentMsg: ChatMessage = {
          id: generateId('msg'),
          role: 'agent',
          text: result.text,
          category: result.category ?? undefined,
          urgency: result.urgency,
          source: null,
          forwarded: result.forwarded,
          critical: result.critical,
          createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, agentMsg]);
        setTyping(false);

        onResolved({
          id: generateId('rec'),
          question: trimmed,
          category: result.category,
          urgency: result.urgency,
          status: result.critical ? 'encaminhado_humano' : result.forwarded ? 'encaminhado' : 'resolvido',
          source: null,
          createdAt: agentMsg.createdAt,
        });
      }, delay);
      return;
    }

    const matchedArticle = result.article;
    const contextArticles = [matchedArticle, ...getKnowledgeBase()
      .filter((a) => a.id !== matchedArticle.id && a.category === matchedArticle.category)
      .slice(0, 2)];

    callGroqAssistant(trimmed, contextArticles).then((groqResult) => {
      const agentText = groqResult.error ? `${groqResult.text}\n\n${result.text}` : groqResult.text;
      const agentMsg: ChatMessage = {
        id: generateId('msg'),
        role: 'agent',
        text: agentText,
        category: result.category ?? undefined,
        urgency: result.urgency,
        source: matchedArticle ? { articleId: matchedArticle.id, title: matchedArticle.title } : null,
        forwarded: false,
        critical: false,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, agentMsg]);
      setTyping(false);

      onResolved({
        id: generateId('rec'),
        question: trimmed,
        category: result.category,
        urgency: result.urgency,
        status: 'resolvido',
        source: agentMsg.source ?? null,
        createdAt: agentMsg.createdAt,
      });
    });
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white border border-navy-100 shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-navy-100 bg-gradient-to-r from-navy-700 to-navy-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold leading-tight">Assistente ResolveAI</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulseDot" />
              <span className="text-xs text-navy-100">Online · responde com base na central de conhecimento</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-5 py-5 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center mx-auto mb-3">
              <Bot className="w-7 h-7 text-sky-700" />
            </div>
            <p className="text-navy-700 font-medium">Olá! Como posso te ajudar hoje?</p>
            <p className="text-sm text-navy-400 mt-1">Descreva seu problema e eu busco a solução na base de conhecimento.</p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-sm px-3 py-2 rounded-lg border border-navy-100 bg-white text-navy-600 hover:border-sky-300 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 animate-fadeIn ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'agent' && (
              <div className="w-8 h-8 shrink-0 rounded-lg bg-navy-700 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div className={`max-w-[82%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-md'
                    : 'bg-white border border-navy-100 text-navy-800 rounded-tl-md'
                }`}
              >
                {msg.text}
              </div>

              {msg.role === 'agent' && (msg.category || msg.urgency || msg.source || msg.forwarded) && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  {msg.category && (
                    <span className={`px-2 py-0.5 rounded-full border font-medium ${
                    msg.critical ? 'bg-red-50 text-red-700 border-red-200' : 'bg-sky-50 text-sky-700 border border-sky-100'}`}>
                      {CATEGORY_LABELS[msg.category]}
                    </span>
                  )}
                  {msg.urgency && (
                    <span className={`px-2 py-0.5 rounded-full border font-medium ${URGENCY_STYLES[msg.urgency]}`}>
                      Urgência: {URGENCY_LABELS[msg.urgency]}
                    </span>
                  )}
                  {msg.critical && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300 font-semibold">
                      <ShieldAlert className="w-3 h-3" /> Incidente crítico
                    </span>
                  )}
                  {msg.forwarded && !msg.critical && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                      <AlertTriangle className="w-3 h-3" /> Encaminhado a humano
                    </span>
                  )}
                </div>
              )}

              {msg.role === 'agent' && msg.source && (
                <button
                  onClick={() => onNavigate('base')}
                  className="mt-1.5 inline-flex items-center gap-1 text-xs text-navy-400 hover:text-sky-700 transition-colors"
                >
                  <BookOpen className="w-3 h-3" />
                  Fonte: {msg.source.title}
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 shrink-0 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="flex gap-3 animate-fadeIn">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-navy-700 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white border border-navy-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-navy-300 animate-pulseDot" />
                <span className="w-2 h-2 rounded-full bg-navy-300 animate-pulseDot" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 rounded-full bg-navy-300 animate-pulseDot" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="p-3 sm:p-4 border-t border-navy-100 bg-white"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Descreva seu problema..."
            className="flex-1 resize-none max-h-32 px-4 py-2.5 rounded-xl border border-navy-100 bg-slate-50 text-sm text-navy-800 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="w-11 h-11 shrink-0 rounded-xl bg-sky-600 text-white flex items-center justify-center hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
