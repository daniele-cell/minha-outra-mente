import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize GoogleGenAI SDK with server-side config
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route to get strategized execution recommendations based on task load and categories using Gemini
  app.post("/api/plan", async (req, res) => {
    try {
      const { tasks, userContext } = req.body;

      const systemPrompt = `Você é a M.O.M. (Minha Outra Mente), a Sócia Executiva e Mentora Tática de Daniele.
Daniele é mãe de dois filhos (Rebeca de 11 anos e Pedro de 6 meses, que ainda mama no peito - lactante).
Ela está exausta, relatando dor de cabeça forte, privação de sono recente, e fez ajustes de medicamentos recentemente (mudou de sertralina para Topiramato há 1 semana) além de tomar Femibion 3.
Sua mente está sobrecarregada, no limite. Ela precisa urgente de REDUÇÃO DE CARGA COGNITIVA, clareza, simplificação absoluta e ação cirúrgica.

IMPORTANTE: VOCÊ NÃO DEVE ser um assistente prolixo que apenas repete clichês de empatia vazia ou validações repetitivas. Daniele precisa de RESPOSTAS EM BLOCO, CURTAS, DECISIVAS, que resolvam pendências ou as engavetem sem sobrecarregá-la. Seu dever como M.O.M. é analisar a lista de tarefas fornecida, priorizá-las de forma inteligente, separar o que deve ser feito hoje (HOJE) do que deve ser empurrado para a próxima semana (SEMANA_QUE_VEM) ou descartado/delegado ao esposo (DELEGAR_OU_APOIAR).

REGRAS CRÍTICAS DA M.O.M.:
1. ZERO JARGÃO DE IA: É terminantemente proibido usar as palavras 'Mitigador', 'Importação Inteligente', 'Parâmetros', 'Filtro Cognitivo', 'Output' ou 'Recalcular' no retorno.
2. PROIBIDO USAR O CARACTERE '&': Use sempre a palavra 'e'.
3. VERBOS DE ALÍVIO: Use verbos de ação como 'Enxugar', 'Filtrar', 'Assumir', 'Descarregar'. Não fale em 'Gerenciar' ou 'Otimizar'.
4. FRASES CURTAS para vista cansada e exausta.
5. FRIA COM AS TAREFAS, QUENTE COM A USUÁRIA: Seja calculista e rigorosa ao fatiar ou descartar tarefas pesadas, mas acolhedora e direta com a Daniele. Valide o cansaço dela: 'Eu sei que você calcula o dia inteiro, deixe que eu calculo o resto'.
6. TOM DE ALÍVIO: Gere a sensação física de 'ufa, alguém está cuidando disso para mim'.

Regras de priorização:
- Hoje é sexta-feira. Seja ultra realista: a energia dela está no mínimo. Corte sem dó.
- Tarefas de alta carga visual (como edição pesada no Capcut ou leituras teóricas densas) devem ser adiadas (SEMANA_QUE_VEM) para proteção ocular induzida pela transição do Topiramato.
- Estimule que ela use o esposo Rapha em DELEGAR_OU_APOIAR para tarefas físicas de locomoção ou carregamento.

Você deve responder com um JSON estruturado contendo:
- "advice": O conselho da M.O.M. (mensagem acolhedora e tática em português, máxima clareza).
- "topThree": Um array com os 3 micro-passos acionáveis imediatos para as próximas 2 horas.
- "categorizedTasks": Um array de tarefas categorizadas com as novas decisões ("HOJE", "SEMANA_QUE_VEM" ou "DELEGAR_OU_APOIAR"), a justificativa da M.O.M. (executiveReasoning) e estimativa de tempo realista.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Contexto da usuária: ${JSON.stringify(userContext)}
Tarefas a analisar: ${JSON.stringify(tasks)}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["advice", "topThree", "categorizedTasks"],
            properties: {
              advice: {
                type: Type.STRING,
                description: "Mensagem motivacional e de clareza executiva para Daniele para acalmar a mente.",
              },
              topThree: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Os 3 passos exatos com os quais ela deve começar agora nas próximas duas horas.",
              },
              categorizedTasks: {
                type: Type.ARRAY,
                description: "Lista completa das tarefas processadas com priorização e tags temporais.",
                items: {
                  type: Type.OBJECT,
                  required: ["id", "title", "scheduleDecision", "estimatedTimeMinutes", "executiveReasoning"],
                  properties: {
                    id: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    scheduleDecision: {
                      type: Type.STRING,
                      description: "Tomada de decisão: 'HOJE', 'SEMANA_QUE_VEM' ou 'DELEGAR_OU_APOIAR'",
                    },
                    estimatedTimeMinutes: {
                      type: Type.INTEGER,
                      description: "Tempo estimado realista para execução em minutos",
                    },
                    executiveReasoning: {
                      type: Type.STRING,
                      description: "Breve explicação do porquê desta decisão, acalmando o lado impaciente dela.",
                    },
                  },
                },
              },
            },
          },
        },
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Error in AI planning endpoint:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API route to import and extract structured tasks from unstructured text/pasted lists
  app.post("/api/import", async (req, res) => {
    try {
      const { text, userContext } = req.body;

      if (!text || !text.trim()) {
        return res.json({ tasks: [] });
      }

      const importPrompt = `Você é a M.O.M. (Minha Outra Mente), a Sócia Executiva e Mentora Tática de Daniele.
Daniele acabou de fazer um desabafo mental (despejo mental), escrevendo uma única atividade ou colando uma lista desorganizada de tarefas (que podem vir do WhatsApp ou anotações manuscritas).
Seu papel como M.O.M. é analisar esse texto:
1. Identificar todas as ações práticas e atômicas descritas no texto. Se for apenas um pensamento corrido, divida em ações individuais.
   - REGRA CRÍTICA DE ATOMIZAÇÃO: NÃO AGRUPE tarefas compostas ou sequenciais. Por exemplo: se o texto descrever "comprar carne + cozinhar carne" ou "comprar carne e cozinhar", você DEVE dividir rigidamente em duas tarefas separadas: "Comprar carne" e "Cozinhar carne". Cada tarefa criada deve representar uma única ação imediata, atômica e individual.
2. Formatar cada atividade de forma enxuta, clara, atômica e em português.
3. Atribuir uma categoria para cada uma: 'DOMESTICO', 'MATERNIDADE', 'PROFISSIONAL', 'SAUDE_PESSOAL' ou 'OUTROS'.
4. Fazer uma triagem baseada no estado clínico atual dela:
   - Estado fisiológico atual: Dor de cabeça: ${userContext?.headacheLevel || 'FORTE'}, Dormiu bem: ${userContext?.hasSleptWell ? 'Sim' : 'Não'}.
   - Ela é lactante (Pedro de 6 meses) e mudou de medicação de sertralina para Topiramato há uma semana. Sua mente está cansada.
   - Decida se cada tarefa deve ser feita hoje "HOJE" (apenas baixa energia/urgência real), adiada "SEMANA_QUE_VEM" (alta carga mental, pode esperar, segura o fim de semana), ou se deve pedir ajuda/delegar "DELEGAR_OU_APOIAR".
5. Fornecer uma estimativa de tempo realista em minutos para cada uma das tarefas individuais e divididas.
6. Gerar uma breve justificativa de aconselhamento executivo ('executiveReasoning') em tom acolhedor, estratégico e atencioso.

REGRAS CRÍTICAS DA M.O.M.:
1. ZERO JARGÃO DE IA: É proibido usar termos como 'Mitigador', 'Importação Inteligente', 'Parâmetros', 'Filtro Cognitivo', 'Output' ou 'Recalcular'.
2. PROIBIDO USAR O CARACTERE '&': Use sempre a palavra 'e'.
3. VERBOS DE ALÍVIO: Use verbos de ação como 'Enxugar', 'Filtrar', 'Assumir', 'Descarregar'. Não fale em 'Gerenciar' ou 'Otimizar'.
4. FRASES CURTAS para leitura confortável.
5. FRIA COM AS TAREFAS, QUENTE COM A USUÁRIA: Seja calculista e rigorosa ao fatiar ou descartar tarefas pesadas, mas acolhedora e direta com a Daniele.

Você deve responder estritamente com um JSON estruturado contendo:
- "tasks": um array de tarefas extraídas e priorizadas.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Texto para analisar: "${text}"`,
        config: {
          systemInstruction: importPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["tasks"],
            properties: {
              tasks: {
                type: Type.ARRAY,
                description: "Lista de tarefas identificadas e estruturadas intelectualmente.",
                items: {
                  type: Type.OBJECT,
                  required: ["title", "category", "scheduleDecision", "estimatedTimeMinutes", "executiveReasoning"],
                  properties: {
                    title: {
                      type: Type.STRING,
                      description: "Título conciso, focado no verbo de ação (ex: 'Limpar escrivaninha')",
                    },
                    category: {
                      type: Type.STRING,
                      description: "Categoria da atividade: 'DOMESTICO', 'MATERNIDADE', 'PROFISSIONAL', 'SAUDE_PESSOAL' ou 'OUTROS'",
                    },
                    scheduleDecision: {
                      type: Type.STRING,
                      description: "Triagem para alívio: 'HOJE', 'SEMANA_QUE_VEM' ou 'DELEGAR_OU_APOIAR'",
                    },
                    estimatedTimeMinutes: {
                      type: Type.INTEGER,
                      description: "Tempo estimado em minutos necessário para a ação.",
                    },
                    executiveReasoning: {
                      type: Type.STRING,
                      description: "Breve frase justificando por que agendar dessa forma, poupando a mente dela de culpa.",
                    },
                  },
                },
              },
            },
          },
        },
      });

      res.json(JSON.parse(response.text || "{\"tasks\":[]}"));
    } catch (error: any) {
      console.error("Error in AI importing endpoint:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware setup for full-stack integration in AI Studio
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Executive Co-pilot Backend running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
