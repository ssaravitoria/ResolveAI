import type { Category, KnowledgeArticle, Urgency } from './types';

export const knowledgeBase: KnowledgeArticle[] = [
  {
    id: 'ent-001',
    category: 'entrega',
    title: 'Acompanhar status do pedido',
    problem: 'rastrear pedido saber onde está minha entrega acompanhar envio',
    solution:
      'Você pode acompanhar o status do seu pedido em tempo real na seção "Meus pedidos" da sua conta. O rastreio é atualizado a cada 24 horas pela transportadora.',
    steps: [
      'Acesse sua conta e clique em "Meus pedidos".',
      'Selecione o pedido desejado.',
      'Clique em "Rastrear entrega" para ver a última atualização.',
    ],
    tags: ['rastreio', 'pedido', 'transportadora', 'status', 'envio'],
  },
  {
    id: 'ent-002',
    category: 'entrega',
    title: 'Pedido com atraso na entrega',
    problem: 'pedido atrasado não chegou na data previse atraso entrega demorando',
    solution:
      'Se o prazo de entrega estimado foi ultrapassado em mais de 3 dias úteis, abrimos uma reclamação junto à transportadora. O prazo de resposta é de até 48 horas.',
    steps: [
      'Confirme o prazo estimado na página do pedido.',
      'Verifique se o endereço de entrega está correto.',
      'Se o atraso passar de 3 dias úteis, acione o suporte.',
    ],
    tags: ['atraso', 'prazo', 'transportadora', 'reclamação'],
  },
  {
    id: 'pag-001',
    category: 'pagamento',
    title: 'Pagamento recusado no cartão',
    problem: 'cartão recusado pagamento não passou erro ao pagar transação negada',
    solution:
      'Quando um pagamento é recusado, o motivo costuma vir do banco emissor. Verifique o limite, os dados do cartão e tente novamente. Em alguns casos é necessário autorizar a transação no app do banco.',
    steps: [
      'Confira o número, a validade e o CVV do cartão.',
      'Verifique se há limite disponível.',
      'Autorize a compra no aplicativo do banco, se solicitado.',
    ],
    tags: ['cartão', 'recusado', 'pagamento', 'transação', 'limite'],
  },
  {
    id: 'pag-002',
    category: 'pagamento',
    title: 'Boleto não compensou',
    problem: 'boleto não compensou pagamento pendente vencimento boleto bancário',
    solution:
      'Boletos podem levar até 3 dias úteis para compensar após o pagamento. Se o prazo já passou e o pedido ainda está pendente, envie o comprovante para verificarmos a baixa manual.',
    steps: [
      'Aguarde até 3 dias úteis após o pagamento.',
      'Caso continue pendente, tenha o comprovante em mãos.',
      'Solicite a baixa manual enviando o comprovante.',
    ],
    tags: ['boleto', 'compensação', 'comprovante', 'pendência'],
  },
  {
    id: 'can-001',
    category: 'cancelamento',
    title: 'Como cancelar um pedido',
    problem: 'cancelar pedido desistir compra cancelamento cancelar compra',
    solution:
      'Pedidos só podem ser cancelados enquanto o status for "Aguardando separação". Após o envio, o cancelamento não é mais possível e será necessário solicitar a devolução.',
    steps: [
      'Acesse "Meus pedidos" e localize o pedido.',
      'Clique em "Cancelar pedido".',
      'Confirme o motivo do cancelamento.',
    ],
    tags: ['cancelar', 'desistir', 'compra', 'status'],
  },
  {
    id: 'can-002',
    category: 'cancelamento',
    title: 'Reembolso após cancelamento',
    problem: 'reembolso depois de cancelar devolução do dinheiro cancelamento reembolso',
    solution:
      'Após o cancelamento, o reembolso é processado automaticamente no mesmo método de pagamento em até 7 dias úteis. Para cartão, pode levar até 2 faturas para aparecer.',
    steps: [
      'Confirme o cancelamento em "Meus pedidos".',
      'Aguarde o prazo de até 7 dias úteis para o estorno.',
      'Em caso de cartão, verifique a próxima fatura.',
    ],
    tags: ['reembolso', 'estorno', 'cancelamento', 'devolução'],
  },
  {
    id: 'ree-001',
    category: 'reembolso',
    title: 'Solicitar reembolso de produto com defeito',
    problem: 'produto defeituoso reembolso produto com problema quero meu dinheiro de volta',
    solution:
      'Produtos com defeito podem ser reembolsados em até 30 dias após o recebimento. Você precisa abrir uma solicitação de devolução anexando fotos do produto e da embalagem.',
    steps: [
      'Acesse o pedido e clique em "Devoluções".',
      'Descreva o defeito e anexe fotos.',
      'Aguarde a análise em até 3 dias úteis.',
    ],
    tags: ['defeito', 'reembolso', 'devolução', 'fotos', 'garantia'],
  },
  {
    id: 'ree-002',
    category: 'reembolso',
    title: 'Reembolso por arrependimento',
    problem: 'arrependimento não quero mais reembolso 7 dias desistir compra recebi',
    solution:
      'Pelo direito de arrependimento, você tem 7 dias corridos após o recebimento para devolver o produto sem motivo. O reembolso é integral, e o frete de retorno é por nossa conta.',
    steps: [
      'Solicite a devolução em até 7 dias após receber.',
      'Embale o produto na embalagem original.',
      'Use a etiqueta de retorno gratuita enviada por e-mail.',
    ],
    tags: ['arrependimento', '7 dias', 'devolução', 'frete grátis'],
  },
  {
    id: 'con-001',
    category: 'conta',
    title: 'Não consigo acessar minha conta',
    problem: 'não consigo entrar login não acessa conta esqueci senha bloqueado acesso',
    solution:
      'Se não consegue acessar, use a opção "Esqueci minha senha" na tela de login. Um link de redefinição será enviado ao seu e-mail cadastrado. O link expira em 1 hora.',
    steps: [
      'Clique em "Esqueci minha senha" no login.',
      'Informe o e-mail cadastrado.',
      'Acesse o link enviado e defina uma nova senha.',
    ],
    tags: ['login', 'senha', 'acesso', 'redefinir', 'esqueci'],
  },
  {
    id: 'con-002',
    category: 'conta',
    title: 'Alterar e-mail ou dados da conta',
    problem: 'trocar e-mail alterar dados mudar conta atualizar cadastro',
    solution:
      'Você pode alterar o e-mail, telefone e endereço de entrega na seção "Meus dados". Para alterar o CPF, é necessário abrir um chamado com documentação, por segurança.',
    steps: [
      'Acesse "Meus dados" no menu da conta.',
      'Edite os campos desejados e salve.',
      'Para CPF, abra um chamado anexando o documento.',
    ],
    tags: ['e-mail', 'dados', 'cadastro', 'alterar', 'cpf'],
  },
  {
    id: 'tec-001',
    category: 'tecnico',
    title: 'Site não carrega ou apresenta erro',
    problem: 'site não carrega erro na página tela branca bug travando erro 500 erro 404',
    solution:
      'Erros de carregamento costumam ser resolvidos limpando o cache do navegador ou tentando em aba anônima. Se persistir, verifique sua conexão e tente outro navegador.',
    steps: [
      'Atualize a página (F5).',
      'Limpe o cache ou abra em aba anônima.',
      'Teste em outro navegador ou conexão.',
    ],
    tags: ['site', 'erro', 'tela branca', 'cache', 'bug'],
  },
  {
    id: 'tec-002',
    category: 'tecnico',
    title: 'App mobile não abre ou fecha sozinho',
    problem: 'app fecha sozinho não abre aplicativo trava celular crash mobile',
    solution:
      'Quando o aplicativo fecha sozinho, geralmente é uma versão desatualizada. Atualize o app na loja, reinicie o celular e, se necessário, desinstale e reinstale.',
    steps: [
      'Atualize o app na Play Store ou App Store.',
      'Reinicie o celular.',
      'Se persistir, desinstale e instale novamente.',
    ],
    tags: ['app', 'mobile', 'crash', 'atualizar', 'reiniciar'],
  },
];

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  entrega: ['entreg', 'rastre', 'envio', 'correio', 'transportadora', 'prazo', 'chegou', 'receber', 'pedido'],
  pagamento: ['pag', 'cartão', 'cartao', 'boleto', 'pix', 'transação', 'transacao', 'cobrança', 'cobranca', 'fatura', 'débito', 'debito', 'crédito', 'credito', 'compra', 'passei'],
  cancelamento: ['cancel', 'desistir', 'desisti', 'anular', 'extornar', 'revogar'],
  reembolso: ['reembol', 'estorn', 'devolu', 'devolver', 'dinheiro de volta', 'repor', 'devolver dinheiro'],
  conta: ['conta', 'login', 'senha', 'acesso', 'entrar', 'logar', 'cadastro', 'e-mail', 'email', 'usuário', 'usuario', 'perfil', 'cpf'],
  tecnico: ['site', 'tela', 'erro', 'bug', 'trava', 'travando', 'carrega', 'carregamento', 'app', 'aplicativo', 'celular', 'mobile', 'página', 'pagina', 'crash', 'branca'],
  seguranca: ['invadida', 'invadido', 'hackeada', 'hackeado', 'fraude', 'golpe', 'phishing', 'segurança', 'seguranca', 'invasao', 'invasão'],
};

const URGENCY_KEYWORDS: Record<Urgency, string[]> = {
  critica: [],
  alta: ['urgente', 'urgência', 'urgencia', 'emergência', 'emergencia', 'já', 'ja', 'agora', 'imediato', 'bloqueado', 'perdi', 'perdeu', 'cancelaram', 'cobraram', 'não posso', 'nao posso', 'crítico', 'critico', 'grave', 'desesperado'],
  media: ['quando', 'preciso', 'necessito', 'ainda', 'demora', 'atraso', 'ainda não', 'ainda nao', 'o quanto antes'],
  baixa: ['dúvida', 'duvida', 'pergunta', 'gostaria', 'saber', 'como', 'qual', 'consigo', 'posso'],
};

const SECURITY_RISK_PATTERNS: string[] = [
  'conta invadida',
  'conta invadido',
  'conta hackeada',
  'acesso não autorizado',
  'acesso nao autorizado',
  'compras sem autorização',
  'compras sem autorizacao',
  'compras sem minha autorização',
  'compras sem minha autorizacao',
  'comprando sem autorização',
  'comprando sem autorizacao',
  'fazendo compras sem',
  'fraude',
  'golpe',
  'roubaram minha conta',
  'roubaram meu conta',
  'roubaram meus dados',
  'roubaram meus dados',
  'estao usando meu cartão',
  'estao usando meu cartao',
  'estão usando meu cartão',
  'estão usando meu cartao',
  'usando meu cartão sem',
  'usando meu cartao sem',
  'usando meu cartão sem permissao',
  'usando meu cartão sem permissão',
  'transações desconhecidas',
  'transacoes desconhecidas',
  'transação desconhecida',
  'transacao desconhecida',
  'senha alterada sem minha permissão',
  'senha alterada sem minha permissao',
  'senha alterada sem permissão',
  'senha alterada sem permissao',
  'senha foi alterada sem',
  'minha senha foi alterada',
  'alteraram minha senha',
  'alteraram meu senha',
  'mudaram minha senha',
  'minha conta foi invadida',
  'minha conta foi hackeada',
  'conta foi invadida',
  'conta foi hackeada',
  'acessaram minha conta',
  'acessaram meu conta',
  'entraram na minha conta',
  'entraram na minha',
  'alguem esta usando minha conta',
  'alguém está usando minha conta',
  'alguem está usando minha conta',
  'alguem esta usando meu cartao',
  'alguém está usando meu cartão',
  'alguém está usando meu cartao',
  'clonaram meu cartão',
  'clonaram meu cartao',
  'dados roubados',
  'vazamento de dados',
  'vazaram meus dados',
  'cartao clonado',
  'cartão clonado',
];

const PAYMENT_RISK_PATTERNS: string[] = [
  'cartão',
  'cartao',
  'compra',
  'compras',
  'transação',
  'transacao',
  'pagamento',
  'pagamentos',
  'pix',
  'boleto',
  'débito',
  'debito',
];

const CATEGORY_SOLUTION_MAP: Record<Category, KnowledgeArticle> = {
  entrega: knowledgeBase.find((a) => a.category === 'entrega')!,
  pagamento: knowledgeBase.find((a) => a.category === 'pagamento')!,
  cancelamento: knowledgeBase.find((a) => a.category === 'cancelamento')!,
  reembolso: knowledgeBase.find((a) => a.category === 'reembolso')!,
  conta: knowledgeBase.find((a) => a.category === 'conta')!,
  tecnico: knowledgeBase.find((a) => a.category === 'tecnico')!,
  seguranca: knowledgeBase[0],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function countMatches(text: string, keywords: string[]): number {
  let count = 0;
  for (const keyword of keywords) {
    if (text.includes(keyword)) count += 1;
  }
  return count;
}

export interface SecurityIncident {
  detected: boolean;
  involvesPayment: boolean;
  matchedPatterns: string[];
}

export function detectSecurityIncident(text: string): SecurityIncident {
  const normalized = normalize(text);
  const matched: string[] = [];
  for (const pattern of SECURITY_RISK_PATTERNS) {
    if (normalized.includes(normalize(pattern))) {
      matched.push(pattern);
    }
  }
  const detected = matched.length > 0;
  const involvesPayment = detected && countMatches(normalized, PAYMENT_RISK_PATTERNS) > 0;
  return { detected, involvesPayment, matchedPatterns: matched };
}

export function classifyCategory(text: string): Category | null {
  const normalized = normalize(text);
  let best: Category | null = null;
  let bestScore = 0;
  (Object.keys(CATEGORY_KEYWORDS) as Category[]).forEach((category) => {
    const score = countMatches(normalized, CATEGORY_KEYWORDS[category]);
    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  });
  return bestScore > 0 ? best : null;
}

export function classifyUrgency(text: string): Urgency {
  const normalized = normalize(text);
  let best: Urgency = 'media';
  let bestScore = 0;
  (['alta', 'media', 'baixa'] as Urgency[]).forEach((urgency) => {
    const score = countMatches(normalized, URGENCY_KEYWORDS[urgency]);
    if (score > bestScore) {
      bestScore = score;
      best = urgency;
    }
  });
  if (bestScore === 0) return 'media';
  return best;
}

export interface MatchResult {
  article: KnowledgeArticle | null;
  score: number;
}

let activeKnowledgeBase: KnowledgeArticle[] = knowledgeBase;

export function setActiveKnowledgeBase(articles: KnowledgeArticle[]): void {
  if (articles.length > 0) {
    activeKnowledgeBase = articles;
  }
}

export function getKnowledgeBase(): KnowledgeArticle[] {
  return activeKnowledgeBase;
}

export function findBestArticle(text: string, category: Category | null): MatchResult {
  const normalized = normalize(text);
  let bestArticle: KnowledgeArticle | null = null;
  let bestScore = 0;

  for (const article of activeKnowledgeBase) {
    let score = 0;
    for (const tag of article.tags) {
      if (normalized.includes(normalize(tag))) score += 2;
    }
    const problemWords = normalize(article.problem).split(' ');
    for (const word of problemWords) {
      if (word.length > 3 && normalized.includes(word)) score += 1;
    }
    if (category && article.category === category) score += 3;
    if (normalized.includes(normalize(article.title))) score += 4;
    if (score > bestScore) {
      bestScore = score;
      bestArticle = article;
    }
  }
  return { article: bestArticle, score: bestScore };
}

export interface ResolutionResult {
  category: Category | null;
  urgency: Urgency;
  article: KnowledgeArticle | null;
  forwarded: boolean;
  critical: boolean;
  text: string;
}

function buildCriticalResponse(involvesPayment: boolean): string {
  const paymentGuidance = involvesPayment
    ? '\n\nComo o relato envolve meios de pagamento, recomendamos também bloquear temporariamente o cartão ou os métodos de pagamento afetados diretamente com o banco emissor ou na sua conta, até que a situação seja confirmada.'
    : '';
  return (
    'Seu relato indica um possível incidente de segurança e precisa de atenção imediata. ' +
    'Não posso confirmar por aqui se a conta foi efetivamente invadida, então vou encaminhar este atendimento para um atendente humano, que poderá investigar e tomar as medidas de proteção necessárias.' +
    paymentGuidance +
    '\n\nEntre em contato agora com o nosso suporte oficial pelo canal seguro de atendimento. Evite clicar em links ou fornecer senhas adicionais até que a equipe confirme sua identidade.'
  );
}

export function resolveQuestion(question: string): ResolutionResult {
  const securityIncident = detectSecurityIncident(question);

  if (securityIncident.detected) {
    return {
      category: 'seguranca',
      urgency: 'critica',
      article: null,
      forwarded: true,
      critical: true,
      text: buildCriticalResponse(securityIncident.involvesPayment),
    };
  }

  const category = classifyCategory(question);
  const urgency = classifyUrgency(question);
  const { article, score } = findBestArticle(question, category);

  if (!article || score < 2) {
    return {
      category,
      urgency,
      article: null,
      forwarded: true,
      critical: false,
      text:
        'Não encontrei informações suficientes na nossa base de conhecimento para responder com segurança a este caso. Por isso, vou encaminhar para um atendente humano, que poderá te ajudar com mais detalhes. Por favor, aguarde o retorno no histórico de atendimentos.',
    };
  }

  const stepsText =
    article.steps && article.steps.length > 0
      ? '\n\nPara resolver, siga estes passos:\n' +
        article.steps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')
      : '';

  return {
    category: article.category,
    urgency,
    article,
    forwarded: false,
    critical: false,
    text: `${article.solution}${stepsText}`,
  };
}

export const categoryFallback: Record<Category, KnowledgeArticle> = CATEGORY_SOLUTION_MAP;
