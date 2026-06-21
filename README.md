# Minha Outra Mente (M.O.M. / MOM) 🧠👶💊

> **MOM (Minha Outra Mente)** é um painel tático-executivo e copiloto cognitivo criado especialmente para apoiar as rotinas diárias e aliviar a sobrecarga de mães com bebês e tratamentos de saúde.

---

## 🌟 O que é a MOM?
A MOM funciona como um copiloto para situações de exaustão mental, privação de sono e sobreposição de responsabilidades executivas. Em vez de exigir tomada de decisão pesada em momentos de sobrecarga, a MOM centraliza, filtra e organiza as principais prioridades e estratégias práticas de sobrevivência em um único bloco visualmente reconfortante e de alta legibilidade.

---

## 🎨 Funcionalidades Principais

- **Prioridades Máximas & Sobrevivência**: Filtra e combina o plano de ação inteligente e as prescrições médicas em um bloco unificado de prioridades máximas, adaptável à fadiga.
- **Micro-Passos Interativos (Piloto Automático)**: Fornece ações práticas atômicas e sequenciais com botões de conclusão direta.
- **Prescrições de Saúde Integradas**: Dicas e lembretes oportunos (como manter a hidratação e reduzir estímulos visuais na introdução do Topiramato).
- **Caixa de Entrada da MOM (Despejo Mental)**: Espaço inteligente para você colar mensagens caóticas de WhatsApp ou anotações apressadas e deixá-las serem organizadas em pequenas tarefas práticas pela inteligência da MOM.
- **Conselhos Estratégicos Dinâmicos**: Mensagens e insights contextuais diretamente na tela de conselhos da MOM (com possibilidade de ocultar para limpar o campo visual).
- **Modo Relatório de Exportação (PDF)**: Layout otimizado para impressão e geração de relatórios de saúde diários.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Interatividade & Animações**: Motion (`motion/react`)
- **Backend**: Express.js, TypeScript (`tsx`, `esbuild`)
- **Serviços de IA**: SDK Oficial do Google Gemini (`@google/genai`) para processar sugestões táticas e classificação inteligente de ideias.
- **Ícones elegantes**: `lucide-react`

---

## ⚙️ Como Executar Localmente

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/)

### 2. Configurando as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com a seguinte chave (exigida para as sugestões contextuais):
```env
GEMINI_API_KEY=sua_chave_do_google_gemini_aqui
```

### 3. Instalação e Execução

Para rodar o ambiente de desenvolvimento:
```bash
# Instalar dependências
npm install

# Rodar o servidor de desenvolvimento
npm run dev
```

Abra o seu navegador em [http://localhost:3000](http://localhost:3000) e aproveite a MOM!

### 4. Build de Produção
Para compilar e empacotar o projeto em uma versão autocontida e de alto desempenho:
```bash
npm run build
npm start
```

---

## 📝 Licença
Este é um projeto pessoal privado voltado para suporte de bem-estar.
