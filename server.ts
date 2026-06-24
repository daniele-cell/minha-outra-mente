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

      const systemPrompt = `Você é a MOM (Minha Outra Mente), a Sócia Executiva e Mentora Tática de Daniele.
Daniele é mãe de dois filhos (Rebeca de 11 anos e Pedro de 6 meses, que ainda mama no peito - lactante).
Ela está exausta, relatando dor de cabeça forte, privação de sono recente, e fez ajustes de medicamentos recentemente (mudou de sertralina para Topiramato há 1 semana) além de tomar Femibion 3.
Sua mente está sobrecarregada, no limite. Ela precisa urgente de REDUÇÃO DE CARGA COGNITIVA, clareza, simplificação absoluta e ação cirúrgica.

IMPORTANTE: VOCÊ NÃO DEVE ser um assistente prolixo que apenas repete clichês de empatia vazia ou validações repetitivas. Daniele precisa de RESPOSTAS EM BLOCO, CURTAS, DECISIVAS, que resolvam pendências ou as engavetem sem sobrecarregá-la. Seu dever como MOM é analisar a lista de tarefas fornecida, priorizá-las de forma inteligente, separar o que deve ser feito hoje (HOJE) do que deve ser empurrado para a próxima semana (SEMANA_QUE_VEM) ou descartado/delegado ao esposo (DELEGAR_OU_APOIAR).

REGRAS CRÍTICAS DA MOM:
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
- "advice": O conselho da MOM (mensagem acolhedora e tática em português, máxima clareza).
- "topThree": Um array com os 3 micro-passos acionáveis imediatos para as próximas 2 horas.
- "categorizedTasks": Um array de tarefas categorizadas com as novas decisões ("HOJE", "SEMANA_QUE_VEM" ou "DELEGAR_OU_APOIAR"), a justificativa da MOM (executiveReasoning) e estimativa de tempo realista.`;

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

  // API route to generate health advice for mom, baby, and child based on weather variables
  app.post("/api/weather-advice", async (req, res) => {
    try {
      const { temperature, humidity, pressure, userContext } = req.body;

      const weatherPrompt = `Você é a MOM (Minha Outra Mente), a Sócia Executiva e Mentora Tática de Daniele.
Daniele é mãe de dois filhos: Rebeca (11 anos) e Pedro (6 meses, bebê que mama no peito - lactante).
Daniele está em transição de medicação (Topiramato há 1 semana) e apresenta exaustão física e dor de cabeça.
Sua missão é dar conselhos específicos e acionáveis de saúde e bem-estar para o dia de hoje, considerando o clima:
- Temperatura: ${temperature}°C
- Umidade do Ar: ${humidity}%
- Pressão Atmosférica: ${pressure} hPa

Considere as seguintes diretrizes fisiológicas e pediátricas:
- Umidade baixa (menor que 45%): risco respiratório aumentado. Recomende umidificador, limpeza nasal no Pedro com soro fisiológico, hidratação extra para a Rebeca, e muita água para Daniele (pois amamentar e usar Topiramato exige o dobro de água).
- Calor alto (maior que 29°C): risco de desidratação e brotoejas no bebê. Recomende roupas leves 100% algodão para o Pedro, amamentação em livre demanda (o leite de início hidrata), banho refrescante morno/frio. Daniele deve evitar exposição direta ao sol e ingerir líquidos frios.
- Frio (menor que 19°C): risco de resfriados e pele seca. Agasalhar Pedro em camadas confortáveis, banhos curtos para não ressecar a pele dele, ambiente aconchegante para Rebeca, bebidas quentes confortáveis para Daniele.
- Pressão atmosférica atípica (baixa pressão < 1011 hPa): forte gatilho físico para crises de envelhecimento/enxaqueca, agravadas pelo Topiramato. Recomende escurecer as telas, compressas frias e desacelerar o ritmo visual e de digitação hoje.

REGRAS CRÍTICAS DA MOM:
1. ZERO JARGÃO DE IA: Não use termos como 'Mitigador', 'Importação Inteligente', 'Parâmetros', 'Filtro Cognitivo', 'Output', 'Protocolo' ou 'Recalcular'.
2. PROIBIDO USAR O CARACTERE '&': Use sempre a palavra 'e'.
3. VERBOS DE ALÍVIO: Use verbos de ação focados em cuidado como 'Proteger', 'Hidratar', 'Resgatar', 'Acolher', 'Suavizar'.
4. FRASES CURTAS e objetivas para leitura fácil com vista cansada.

Você deve responder estritamente com um JSON estruturado contendo:
- "momAdvice": Conselho prático e carinhoso focado na saúde da Daniele.
- "babyAdvice": Conselho focado no bebê Pedro (6 meses), roupas, mamadas e respiração.
- "childAdvice": Conselho focado na Rebeca (11 anos), brincadeiras, hidratação ou estudos.
- "generalWarning": Um pequeno alerta de 1 frase destacando a maior atenção física do clima hoje.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Clima informado: Temp ${temperature}°C, Umidade ${humidity}%, Pressão ${pressure} hPa. Contexto adicional: ${JSON.stringify(userContext)}`,
        config: {
          systemInstruction: weatherPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["momAdvice", "babyAdvice", "childAdvice", "generalWarning"],
            properties: {
              momAdvice: { type: Type.STRING },
              babyAdvice: { type: Type.STRING },
              childAdvice: { type: Type.STRING },
              generalWarning: { type: Type.STRING },
            },
          },
        },
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Error in weather advice endpoint:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // NEW: API route to fetch real-time weather from Open-Meteo for a given city or geolocation
  app.post("/api/realtime-weather", async (req, res) => {
    try {
      const { city, latitude, longitude, userContext } = req.body;
      
      let lat = -23.5475; // Default: São Paulo
      let lon = -46.6361;
      let resolvedCityName = "São Paulo, SP";

      if (city && city.trim().length > 0) {
        // Fetch coordinates from geocoding API
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;
        const geoRes = await fetch(geoUrl);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results.length > 0) {
            const firstResult = geoData.results[0];
            lat = firstResult.latitude;
            lon = firstResult.longitude;
            resolvedCityName = `${firstResult.name}${firstResult.admin1 ? `, ${firstResult.admin1}` : ""}`;
          }
        }
      } else if (latitude !== undefined && longitude !== undefined) {
        lat = Number(latitude);
        lon = Number(longitude);
        resolvedCityName = "Sua Localização Atual";
      }

      // Fetch weather parameters from Open-Meteo
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) {
        throw new Error("Falha ao obter dados meteorológicos da API pública.");
      }

      const weatherData = await weatherRes.json();
      const current = weatherData.current;
      
      const tempVal = Math.round(current.temperature_2m);
      const humVal = Math.round(current.relative_humidity_2m);
      const pressVal = Math.round(current.surface_pressure);

      // Now automatically call the AI generation so we return everything in one payload
      const weatherPrompt = `Você é a MOM (Minha Outra Mente), a Sócia Executiva e Mentora Tática de Daniele.
Daniele é mãe de dois filhos: Rebeca (11 anos) e Pedro (6 meses, bebê que mama no peito - lactante).
Daniele está em transição de medicação (Topiramato há 1 semana) e apresenta exaustão física e dor de cabeça.
Sua missão é dar conselhos específicos e acionáveis de saúde e bem-estar para o dia de hoje, considerando o clima de ${resolvedCityName}:
- Temperatura: ${tempVal}°C
- Umidade do Ar: ${humVal}%
- Pressão Atmosférica: ${pressVal} hPa

Considere as seguintes diretrizes fisiológicas e pediátricas:
- Umidade baixa (menor que 45%): risco respiratório aumentado. Recomende umidificador, limpeza nasal no Pedro com soro fisiológico, hidratação extra para a Rebeca, e muita água para Daniele (pois amamentar e usar Topiramato exige o dobro de água).
- Calor alto (maior que 29°C): risco de desidratação e brotoejas no bebê. Recomende roupas leves 100% algodão para o Pedro, amamentação em livre demanda (o leite de início hidrata), banho refrescante morno/frio. Daniele deve evitar exposição direta ao sol e ingerir líquidos frios.
- Frio (menor que 19°C): risco de resfriados e pele seca. Agasalhar Pedro em camadas confortáveis, banhos curtos para não ressecar a pele dele, ambiente aconchegante para Rebeca, bebidas quentes confortáveis para Daniele.
- Pressão atmosférica atípica (baixa pressão < 1011 hPa): forte gatilho físico para crises de envelhecimento/enxaqueca, agravadas pelo Topiramato. Recomende escurecer as telas, compressas frias e desacelerar o ritmo visual e de digitação hoje.

REGRAS CRÍTICAS DA MOM:
1. ZERO JARGÃO DE IA: Não use termos como 'Mitigador', 'Importação Inteligente', 'Parâmetros', 'Filtro Cognitivo', 'Output', 'Protocolo' ou 'Recalcular'.
2. PROIBIDO USAR O CARACTERE '&': Use sempre a palavra 'e'.
3. VERBOS DE ALÍVIO: Use verbos de ação focados em cuidado como 'Proteger', 'Hidratar', 'Resgatar', 'Acolher', 'Suavizar'.
4. FRASES CURTAS e objetivas para leitura fácil com vista cansada.

Você deve responder estritamente com um JSON estruturado contendo:
- "momAdvice": Conselho prático e carinhoso focado na saúde da Daniele.
- "babyAdvice": Conselho focado no bebê Pedro (6 meses), roupas, mamadas e respiração.
- "childAdvice": Conselho focado na Rebeca (11 anos), brincadeiras, hidratação ou estudos.
- "generalWarning": Um pequeno alerta de 1 frase destacando a maior atenção física do clima hoje.`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Clima obtido em tempo real para ${resolvedCityName}: Temp ${tempVal}°C, Umidade ${humVal}%, Pressão ${pressVal} hPa. Contexto adicional: ${JSON.stringify(userContext)}`,
        config: {
          systemInstruction: weatherPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["momAdvice", "babyAdvice", "childAdvice", "generalWarning"],
            properties: {
              momAdvice: { type: Type.STRING },
              babyAdvice: { type: Type.STRING },
              childAdvice: { type: Type.STRING },
              generalWarning: { type: Type.STRING },
            },
          },
        },
      });

      const advice = JSON.parse(aiResponse.text || "{}");

      res.json({
        success: true,
        cityName: resolvedCityName,
        temperature: tempVal,
        humidity: humVal,
        pressure: pressVal,
        advice
      });
    } catch (error: any) {
      console.error("Error in real-time weather advice endpoint:", error);
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

      const importPrompt = `Você é a MOM (Minha Outra Mente), a Sócia Executiva e Mentora Tática de Daniele.
Daniele acabou de fazer um desabafo mental (despejo mental), escrevendo uma única atividade ou colando uma lista desorganizada de tarefas (que podem vir do WhatsApp ou anotações manuscritas).
Seu papel como MOM é analisar esse texto:
1. Identificar todas as ações práticas e atômicas descritas no texto. Se for apenas um pensamento corrido, divida em ações individuais.
   - REGRA CRÍTICA DE ATOMIZAÇÃO: NÃO AGRUPE tarefas compostas, sequenciais ou separadas por vírgula. Se Daniele descrever itens separados por vírgula (como "Pedir almoço, finalizar papa do Pedro, passar pano"), você DEVE obrigatoriamente criar uma tarefa individual separada para cada um dos itens listados de forma isolada (por exemplo, "Pedir o almoço por delivery", "Finalizar a papa do Pedro com fubá", "Passar o pano na cozinha"), nunca agrupando-as sob o mesmo título. Cada tarefa criada deve representar uma única ação imediata, atômica e individual.
2. Formatar cada atividade de forma enxuta, clara, atômica e em português.
3. Atribuir uma categoria para cada uma: 'DOMESTICO', 'MATERNIDADE', 'PROFISSIONAL', 'SAUDE_PESSOAL' ou 'OUTROS'.
4. Fazer uma triagem baseada no estado clínico atual dela:
   - Estado fisiológico atual: Dor de cabeça: ${userContext?.headacheLevel || 'FORTE'}, Dormiu bem: ${userContext?.hasSleptWell ? 'Sim' : 'Não'}.
   - Ela é lactante (Pedro de 6 meses) e mudou de medicação de sertralina para Topiramato há uma semana. Sua mente está cansada.
   - Decida se cada tarefa deve ser feita hoje "HOJE" (apenas baixa energia/urgência real), adiada "SEMANA_QUE_VEM" (alta carga mental, pode esperar, segura o fim de semana), ou se deve pedir ajuda/delegar "DELEGAR_OU_APOIAR".
5. Fornecer uma estimativa de tempo realista em minutos para cada uma das tarefas individuais e divididas.
6. Gerar uma breve justificativa de aconselhamento executivo ('executiveReasoning') em tom acolhedor, estratégico e atencioso.

REGRAS CRÍTICAS DA MOM:
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
