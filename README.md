ResolveAI — Agente Inteligente de Atendimento

Meu primeiro agente de Inteligência Artificial, desenvolvido como projeto de aprendizado e portfólio utilizando o Bolt.new com assistência de IA.

O ResolveAI é uma aplicação de atendimento inteligente que utiliza IA generativa para responder às dúvidas dos usuários com base em uma central de conhecimento, buscando oferecer respostas claras, consistentes e úteis.

🚀 Este projeto representa meu primeiro contato prático com o desenvolvimento de um agente de IA, desde a integração com um modelo generativo até os desafios de recuperação de informações e confiabilidade das respostas.

📸 Demonstração

Acesse o projeto: https://resolveai-support-pl-ktoz.bolt.host/

🎯 Objetivo do projeto

Explorar como a Inteligência Artificial pode contribuir para a automação do atendimento ao cliente, utilizando informações previamente cadastradas para responder a perguntas e orientar usuários.

O projeto também tem como objetivo aplicar conhecimentos de desenvolvimento web, integração com APIs, banco de dados e engenharia de prompts em uma aplicação prática.

⚙️ Funcionalidades

💬 Chat com IA: interação em linguagem natural para esclarecer dúvidas.

📚 Central de conhecimento: utilização de artigos e procedimentos como fonte das respostas.

🧠 Geração de respostas com IA: integração com a Groq para produzir respostas contextualizadas.

🛡️ Respostas baseadas em fontes: orientação para evitar informações não sustentadas pela base de conhecimento.

🙋 Tratamento de dúvidas sem resposta: possibilidade de informar quando não há informações suficientes.

📊 Dashboard: visualização de informações operacionais, conforme os dados disponíveis no sistema.

🕘 Histórico de conversas: consulta de interações anteriores, conforme a implementação atual.

As funcionalidades devem ser conferidas na versão publicada antes da apresentação do projeto.

🛠️ Tecnologias utilizadas

React — construção da interface.

TypeScript — tipagem e organização do código.

Supabase — serviços de backend e banco de dados.

Supabase Edge Functions — execução da lógica de integração no servidor.

Groq API — acesso ao modelo de linguagem utilizado pelo assistente.

Bolt.new — ferramenta utilizada no desenvolvimento da aplicação com assistência de IA.

Git e GitHub — versionamento e armazenamento do código-fonte.

🧩 Como funciona?

O fluxo principal do ResolveAI pode ser resumido em quatro etapas:

Pergunta do usuário: o usuário envia uma dúvida pela interface de atendimento.

Busca de informações: a aplicação procura artigos relevantes na central de conhecimento.

Processamento com IA: o contexto recuperado é enviado ao modelo de linguagem para elaborar uma resposta.

Resposta ao usuário: o sistema apresenta a resposta ou informa que não há informações suficientes, conforme o fluxo implementado.

A proposta é utilizar a IA como apoio ao atendimento, mantendo a base de conhecimento como referência para as respostas.

📚 Habilidades desenvolvidas

Durante o desenvolvimento do ResolveAI, trabalhei na exploração e aplicação prática de conhecimentos relacionados a:

Inteligência Artificial generativa: utilização de modelos de linguagem em uma aplicação.

Engenharia de prompts: elaboração de instruções para orientar o comportamento da IA.

Integração com APIs: comunicação entre a aplicação e um serviço externo de IA.

Backend serverless: utilização de Edge Functions para executar chamadas à API.

Banco de dados: organização e recuperação de informações para contextualizar respostas.

Desenvolvimento web: contato prático com componentes, lógica de aplicação e TypeScript.

Depuração e testes: investigação de erros de integração, modelos indisponíveis e respostas inadequadas.

Documentação técnica: organização das informações necessárias para compreender e evoluir o projeto.

🧪 Desafios e aprendizados

Um dos principais desafios foi integrar a aplicação a um modelo de IA e investigar erros durante as chamadas à API.

Também explorei a importância de fornecer contexto relevante ao modelo, limitar as respostas às informações disponíveis e tratar situações em que a base de conhecimento não contém a resposta necessária.

O projeto reforçou meu aprendizado sobre como diferentes componentes — interface, backend, banco de dados e IA generativa — trabalham em conjunto para formar uma aplicação funcional.

🔮 Melhorias futuras

Algumas possibilidades de evolução do ResolveAI são:

Aprimorar a busca e a recuperação de artigos relevantes.

Melhorar a apresentação de fontes e a formatação das respostas.

Implementar métricas de qualidade e avaliações dos usuários.

Evoluir o fluxo de solicitações de atendimento humano.

Aprimorar o controle de acesso e as permissões administrativas.

Estudar integrações com canais externos, como WhatsApp, caso surja uma necessidade real de negócio.

Essas melhorias serão avaliadas conforme a evolução do projeto.

▶️ Execução local

Para executar o projeto localmente, será necessário ter Node.js e npm instalados, além das configurações exigidas pelo Supabase.

Clone o repositório:

git clone https://github.com/ssaravitoria/ResolveAI.git

Entre na pasta do projeto:

cd ResolveAI

Instale as dependências:

npm install

Configure as variáveis de ambiente necessárias em um arquivo .env, de acordo com a configuração do projeto.

Exemplo de nomes utilizados pelo frontend:

VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica

Inicie o ambiente de desenvolvimento:

npm run dev

Confira o arquivo package.json e a configuração do Supabase para validar os comandos e variáveis exigidos pela versão atual do projeto.

Importante: a chave secreta da Groq deve permanecer configurada no ambiente seguro do backend, nunca em variáveis VITE_ ou no código público do frontend.

👨‍💻 Sobre o projeto

O ResolveAI é um projeto pessoal de aprendizado e portfólio. Foi desenvolvido com o auxílio do Bolt.new e de ferramentas de Inteligência Artificial, como uma oportunidade de explorar novas tecnologias e desenvolver habilidades práticas na criação de aplicações com IA generativa.

Meu objetivo é continuar evoluindo o projeto, aprofundar meus conhecimentos em integração de APIs, backend, dados e inteligência artificial, e aplicar esses aprendizados em soluções para problemas reais.
