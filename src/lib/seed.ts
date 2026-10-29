import type { SessionRecord } from './types';

export const seedHistory: SessionRecord[] = [
  {
    id: 'seed-1',
    question: 'Meu pedido atrasou e ainda não chegou, já se passaram 5 dias.',
    category: 'entrega',
    urgency: 'media',
    status: 'resolvido',
    source: { articleId: 'ent-002', title: 'Pedido com atraso na entrega' },
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: 'seed-2',
    question: 'O pagamento no cartão foi recusado e não sei o que fazer.',
    category: 'pagamento',
    urgency: 'alta',
    status: 'resolvido',
    source: { articleId: 'pag-001', title: 'Pagamento recusado no cartão' },
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
  },
  {
    id: 'seed-3',
    question: 'Gostaria de devolver um produto que chegou com defeito.',
    category: 'reembolso',
    urgency: 'media',
    status: 'resolvido',
    source: { articleId: 'ree-001', title: 'Solicitar reembolso de produto com defeito' },
    createdAt: Date.now() - 1000 * 60 * 60 * 14,
  },
  {
    id: 'seed-4',
    question: 'Quero saber sobre integração do meu ERP com a plataforma.',
    category: null,
    urgency: 'media',
    status: 'encaminhado',
    source: null,
    createdAt: Date.now() - 1000 * 60 * 60 * 9,
  },
  {
    id: 'seed-5',
    question: 'Não consigo acessar minha conta, esqueci a senha.',
    category: 'conta',
    urgency: 'alta',
    status: 'resolvido',
    source: { articleId: 'con-001', title: 'Não consigo acessar minha conta' },
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: 'seed-6',
    question: 'O site está apresentando erro 500 na página de checkout.',
    category: 'tecnico',
    urgency: 'alta',
    status: 'resolvido',
    source: { articleId: 'tec-001', title: 'Site não carrega ou apresenta erro' },
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'seed-7',
    question: 'Como faço para cancelar uma assinatura mensal?',
    category: null,
    urgency: 'media',
    status: 'encaminhado',
    source: null,
    createdAt: Date.now() - 1000 * 60 * 35,
  },
  {
    id: 'seed-8',
    question: 'Boleto pago mas o pedido continua pendente.',
    category: 'pagamento',
    urgency: 'media',
    status: 'resolvido',
    source: { articleId: 'pag-002', title: 'Boleto não compensou' },
    createdAt: Date.now() - 1000 * 60 * 18,
  },
  {
    id: 'seed-9',
    question: 'Minha conta foi invadida e alguém está fazendo compras sem minha autorização.',
    category: 'seguranca',
    urgency: 'critica',
    status: 'encaminhado_humano',
    source: null,
    createdAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: 'seed-10',
    question: 'Estão usando meu cartão sem permissão, появились transações desconhecidas.',
    category: 'seguranca',
    urgency: 'critica',
    status: 'encaminhado_humano',
    source: null,
    createdAt: Date.now() - 1000 * 60 * 6,
  },
];

let counter = 0;
export function generateId(prefix: string = 'id'): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}-${Math.random().toString(36).slice(2, 6)}`;
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
