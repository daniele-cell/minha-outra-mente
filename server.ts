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

      let responseData;
      try {
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
        responseData = JSON.parse(response.text || "{}");
      } catch (geminiError: any) {
        console.warn("AI Planning model hit limit or high demand, using robust local contingency:", geminiError.message);
        const advice = "Daniele, meu sistema principal de inteligência artificial está sob alta demanda momentânea. Mas, como sua Sócia Executiva ativa, acionei nossa contingência tática local. Suas tarefas estão seguras e foram triadas metodicamente. Sem culpa, sem correria. Dê pequenos passos.";
        
        // Pick the top 3 atomic tasks
        const topThree = tasks.slice(0, 3).map((t: any) => t.title) || ["Beber água fresca agora", "Fazer compressa para a cabeça", "Pedir ajuda ao Rapha com o Pedro"];
        if (topThree.length < 3) {
          topThree.push("Beber um copo de água fria");
        }

        const categorizedTasks = tasks.map((t: any, idx: number) => {
          let scheduleDecision = "HOJE";
          let executiveReasoning = "Triado localmente para hoje com energia e tempo reduzidos.";
          let estimatedTimeMinutes = t.estimatedTimeMinutes || 20;

          const titleLower = (t.title || "").toLowerCase();
          if (titleLower.includes("capcut") || titleLower.includes("edição") || titleLower.includes("leitura") || titleLower.includes("estudo") || titleLower.includes("livro") || titleLower.includes("pesad")) {
            scheduleDecision = "SEMANA_QUE_VEM";
            executiveReasoning = "Exige esforço visual intenso. Como você está com enxaqueca e Topiramato, poupar os olhos é essencial.";
          } else if (titleLower.includes("carregar") || titleLower.includes("comprar") || titleLower.includes("limpar") || titleLower.includes("pegar") || titleLower.includes("passar o pano")) {
            scheduleDecision = "DELEGAR_OU_APOIAR";
            executiveReasoning = "Atividade de esforço físico ou locomoção. Peça apoio ou delegue ao Rapha para preservar sua energia.";
          } else if (idx >= 3) {
            scheduleDecision = "SEMANA_QUE_VEM";
            executiveReasoning = "Vamos dosar sua energia hoje. Para aliviar sua mente exausta, adiamos para a próxima semana.";
          }

          return {
            id: t.id,
            title: t.title,
            scheduleDecision,
            estimatedTimeMinutes,
            executiveReasoning
          };
        });

        responseData = { advice, topThree, categorizedTasks };
      }

      res.json(responseData);
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

      let advice;
      try {
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
        advice = JSON.parse(response.text || "{}");
      } catch (geminiError: any) {
        console.warn("Weather advice model hit limit or high demand, using robust local weather fallback:", geminiError.message);
        
        // Detailed, compassionate local rule system designed for Daniele, Pedro and Rebeca
        let momAdvice = "Daniele, com o Topiramato na primeira semana e a amamentação ativa do Pedro, sua necessidade de água dobra. Beba bastante água fria para manter o ritmo e aliviar a cabeça.";
        let babyAdvice = "Mantenha o Pedro (6 meses) em ambiente fresco e amamente em livre demanda para hidratação natural.";
        let childAdvice = "Garanta que a Rebeca (11 anos) esteja bebendo água fresca e tenha pausas de descanso em suas atividades hoje.";
        let generalWarning = "Atenção voltada à sua hidratação constante para combater os efeitos do Topiramato hoje.";

        if (humidity < 45) {
          generalWarning = "Alerta de Umidade Baixa: Ar seco exige cuidado respiratório redobrado para toda a casa.";
          momAdvice = "Daniele, o ar seco agrava a exaustão física e a secura ocular do Topiramato. Beba água sem parar e repouse a vista sempre que possível.";
          babyAdvice = "Higienize o nariz do Pedro (6 meses) com soro fisiológico várias vezes e ligue o umidificador de ar no quarto dele.";
          childAdvice = "Incentive a Rebeca (11 anos) a se hidratar bem e evite que ela realize atividades físicas expostas ao ar livre nas horas secas.";
        } else if (temperature > 29) {
          generalWarning = "Alerta de Calor Forte: Prevenção contra desidratação e brotoejas em destaque hoje.";
          momAdvice = "Daniele, evite exposição direta ao sol e prefira bebidas geladas e leves. Reduza o ritmo visual das telas quentes.";
          babyAdvice = "Vista o Pedro com roupas leves de algodão e ofereça amamentação em livre demanda, pois o leite de início hidrata e sacia.";
          childAdvice = "Rebeca deve usar roupas bem frescas e realizar apenas brincadeiras tranquilas na sombra.";
        } else if (temperature < 19) {
          generalWarning = "Alerta de Frio: Agasalhe o bebê em camadas confortáveis e ofereça conforto térmico.";
          momAdvice = "Daniele, aproveite bebidas quentes confortáveis. Evite correntes de ar frio para prevenir piora da dor de cabeça.";
          babyAdvice = "Proteja o Pedro (6 meses) com agasalho confortável em camadas de algodão e evite banhos excessivamente longos.";
          childAdvice = "Mantenha a Rebeca aquecida e garanta que ela evite banhos demorados com água muito quente.";
        }

        if (pressure < 1011) {
          generalWarning = "Alerta de Baixa Pressão Atmosférica: Forte gatilho físico para crises de enxaqueca hoje.";
          momAdvice = "Daniele, a baixa pressão atmosférica associada ao Topiramato é um forte gatilho de enxaqueca. Escureça telas, use compressas frias e reduza a digitação hoje.";
        }

        advice = { momAdvice, babyAdvice, childAdvice, generalWarning };
      }

      res.json(advice);
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

      let advice;
      try {
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
        advice = JSON.parse(aiResponse.text || "{}");
      } catch (geminiError: any) {
        console.warn("Real-time weather advice model hit limit or high demand, using robust local weather fallback:", geminiError.message);
        
        // Detailed, compassionate local rule system designed for Daniele, Pedro and Rebeca
        let momAdvice = "Daniele, com o Topiramato na primeira semana e a amamentação ativa do Pedro, sua necessidade de água dobra. Beba bastante água fria para manter o ritmo e aliviar a cabeça.";
        let babyAdvice = "Mantenha o Pedro (6 meses) em ambiente fresco e amamente em livre demanda para hidratação natural.";
        let childAdvice = "Garanta que a Rebeca (11 anos) esteja bebendo água fresca e tenha pausas de descanso em suas atividades hoje.";
        let generalWarning = "Atenção voltada à sua hidratação constante para combater os efeitos do Topiramato hoje.";

        if (humVal < 45) {
          generalWarning = "Alerta de Umidade Baixa: Ar seco exige cuidado respiratório redobrado para toda a casa.";
          momAdvice = "Daniele, o ar seco agrava a exaustão física e a secura ocular do Topiramato. Beba água sem parar e repouse a vista sempre que possível.";
          babyAdvice = "Higienize o nariz do Pedro (6 meses) com soro fisiológico várias vezes e ligue o umidificador de ar no quarto dele.";
          childAdvice = "Incentive a Rebeca (11 anos) a se hidratar bem e evite que ela realize atividades físicas ao ar livre nas horas secas.";
        } else if (tempVal > 29) {
          generalWarning = "Alerta de Calor Forte: Prevenção contra desidratação e brotoejas em destaque hoje.";
          momAdvice = "Daniele, evite exposição direta ao sol e prefira bebidas geladas e leves. Reduza o ritmo visual das telas quentes.";
          babyAdvice = "Vista o Pedro com roupas leves de algodão e ofereça amamentação em livre demanda, pois o leite de início hidrata e sacia.";
          childAdvice = "Rebeca deve usar roupas bem frescas e realizar apenas brincadeiras tranquilas na sombra.";
        } else if (tempVal < 19) {
          generalWarning = "Alerta de Frio: Agasalhe o bebê em camadas confortáveis e ofereça conforto térmico.";
          momAdvice = "Daniele, aproveite bebidas quentes confortáveis. Evite correntes de ar frio para prevenir piora da dor de cabeça.";
          babyAdvice = "Proteja o Pedro (6 meses) com agasalho confortável em camadas de algodão e evite banhos excessivamente longos.";
          childAdvice = "Mantenha a Rebeca aquecida e garanta que ela evite banhos demorados com água muito quente.";
        }

        if (pressVal < 1011) {
          generalWarning = "Alerta de Baixa Pressão Atmosférica: Forte gatilho físico para crises de enxaqueca hoje.";
          momAdvice = "Daniele, a baixa pressão atmosférica associada ao Topiramato é um forte gatilho de enxaqueca. Escureça telas, use compressas frias e reduza a digitação hoje.";
        }

        advice = { momAdvice, babyAdvice, childAdvice, generalWarning };
      }

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

      let responseData;
      try {
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
        responseData = JSON.parse(response.text || "{\"tasks\":[]}");
      } catch (geminiError: any) {
        console.warn("AI Import model hit limit or high demand, using robust local parser:", geminiError.message);
        
        // Robust split pattern for Brazilian Portuguese inputs
        const items = text
          .split(/[\n,;•\-]+/g)
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 2);

        const tasksList = items.map((titleStr: string, idx: number) => {
          let category = "DOMESTICO";
          let scheduleDecision = "HOJE";
          let executiveReasoning = "Triado localmente de forma segura devido a alta demanda do sistema principal.";
          let estimatedTimeMinutes = 20;

          const titleLower = titleStr.toLowerCase();

          // Category assignment
          if (titleLower.includes("pedro") || titleLower.includes("bebe") || titleLower.includes("bebê") || titleLower.includes("papinha") || titleLower.includes("mama") || titleLower.includes("fubá")) {
            category = "MATERNIDADE";
            estimatedTimeMinutes = 25;
          } else if (titleLower.includes("rebeca") || titleLower.includes("escola") || titleLower.includes("lição") || titleLower.includes("estudo")) {
            category = "MATERNIDADE";
            estimatedTimeMinutes = 30;
          } else if (titleLower.includes("trabalho") || titleLower.includes("post") || titleLower.includes("cliente") || titleLower.includes("venda") || titleLower.includes("capcut") || titleLower.includes("edição")) {
            category = "PROFISSIONAL";
            estimatedTimeMinutes = 45;
          } else if (titleLower.includes("dor") || titleLower.includes("remedio") || titleLower.includes("médico") || titleLower.includes("consulta") || titleLower.includes("água") || titleLower.includes("caminhada")) {
            category = "SAUDE_PESSOAL";
            estimatedTimeMinutes = 15;
          }

          // Prioritization & scheduleDecision assignment
          if (titleLower.includes("capcut") || titleLower.includes("edição") || titleLower.includes("estudo") || titleLower.includes("ler") || titleLower.includes("livro") || titleLower.includes("pesad")) {
            scheduleDecision = "SEMANA_QUE_VEM";
            executiveReasoning = "Exige alta carga visual e foco mental. Como você está com enxaqueca, poupar a vista hoje é prioridade absoluta.";
          } else if (titleLower.includes("comprar") || titleLower.includes("limpar") || titleLower.includes("passar o pano") || titleLower.includes("organizar") || titleLower.includes("lavar")) {
            scheduleDecision = "DELEGAR_OU_APOIAR";
            executiveReasoning = "Atividade com esforço físico de moderado a alto. Peça auxílio ao Rapha para não esgotar suas energias.";
          } else if (idx >= 3) {
            scheduleDecision = "SEMANA_QUE_VEM";
            executiveReasoning = "Triado para depois a fim de garantir que sua mente e corpo descansem de forma justa hoje.";
          }

          // Capitalize first letter beautifully
          const formattedTitle = titleStr.charAt(0).toUpperCase() + titleStr.slice(1);

          return {
            title: formattedTitle,
            category,
            scheduleDecision,
            estimatedTimeMinutes,
            executiveReasoning
          };
        });

        responseData = { tasks: tasksList };
      }

      res.json(responseData);
    } catch (error: any) {
      console.error("Error in AI importing endpoint:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API route to stream general responses from Gemini (Damage Control and Joga Aqui)
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt } = req.body;

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let userPrompt = prompt || "";
      let systemInstruction = `Você é a MOM — Minha Outra Mente. Copiloto pessoal de Dani:
mãe de Pedro (6 meses, amamentando) e Rebeca (11 anos). Pós-parto.
Trocou sertralina por topiramato há 1 semana. Tem enxaqueca como efeito colateral.
Voz: direta, acolhedora, executiva. Frases curtas.
Nunca romantize o cansaço. Nunca use "e" comercial. Português brasileiro.`;

      if (userPrompt.includes("Você é a MOM — Minha Outra Mente")) {
        const parts = userPrompt.split("\n\n");
        if (parts.length > 1) {
          systemInstruction = parts[0];
          userPrompt = parts.slice(1).join("\n\n");
        }
      }

      try {
        const responseStream = await ai.models.generateContentStream({
          model: "gemini-3.5-flash",
          contents: userPrompt,
          config: {
            systemInstruction,
          }
        });

        for await (const chunk of responseStream) {
          if (chunk.text) {
            res.write(`data: ${JSON.stringify({ delta: { text: chunk.text } })}\n\n`);
          }
        }
        res.write("data: [DONE]\n\n");
        res.end();
      } catch (geminiError: any) {
        console.warn("AI Streaming generate hit limit, using robust local contingency:", geminiError.message);
        
        let fallbackText = "";
        if (userPrompt.includes("Estado agora:")) {
          const sleepMal = userPrompt.toLowerCase().includes("sono ruim") || userPrompt.toLowerCase().includes("mal");
          const painForte = userPrompt.toLowerCase().includes("dor de cabeça forte") || userPrompt.toLowerCase().includes("forte");
          const painLeve = userPrompt.toLowerCase().includes("dor de cabeça leve") || userPrompt.toLowerCase().includes("leve");
          
          fallbackText = "Dani, meu sistema principal de IA está sob alta demanda, mas acionei nossa contingência local. ";
          if (sleepMal && painForte) {
            fallbackText += "Como você não dormiu e está com dor de cabeça forte, suspenda todas as tarefas pesadas. Vá deitar com o Pedro agora. Beba água gelada para aliviar a cabeça e o efeito do Topiramato.";
          } else if (sleepMal) {
            fallbackText += "Sem dormir, sua energia está baixa. Priorize as vacinas e a papa do Pedro. O resto da limpeza e dos estudos fica para a semana que vem.";
          } else if (painForte) {
            fallbackText += "Essa dor de cabeça é forte. Apague as luzes, desligue o celular e repouse os olhos. Beba bastante água gelada.";
          } else if (painLeve) {
            fallbackText += "Com dor de cabeça leve, faça apenas o bloco urgente hoje. Evite a tela do CapCut e estudos complexos hoje.";
          } else {
            fallbackText += "Você dormiu bem e está sem dor de cabeça hoje. Ótimo! Faça as tarefas urgentes primeiro e reserve um tempo para descansar.";
          }
        } else if (userPrompt.includes("Converta este texto em tarefas atômicas")) {
          let inboxText = "";
          const textMatch = userPrompt.match(/Texto:\s*"([\s\S]*)"/i);
          if (textMatch) {
            inboxText = textMatch[1];
          } else {
            inboxText = userPrompt;
          }
          
          const items = inboxText
            .split(/[\n,;•\-]+/g)
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 2 && !item.includes("Você é a MOM") && !item.includes("Converta este texto"));

          const tasksList = items.map((titleStr: string, idx: number) => {
            let category = "Casa";
            let urgent = false;
            const titleLower = titleStr.toLowerCase();

            if (titleLower.includes("pedro") || titleLower.includes("bebe") || titleLower.includes("bebê") || titleLower.includes("papinha") || titleLower.includes("mama") || titleLower.includes("fubá") || titleLower.includes("vacina")) {
              category = "Filhos e Bebê";
              urgent = true;
            } else if (titleLower.includes("rebeca") || titleLower.includes("escola") || titleLower.includes("lição") || titleLower.includes("estudo")) {
              category = "Filhos e Bebê";
            } else if (titleLower.includes("trabalho") || titleLower.includes("post") || titleLower.includes("cliente") || titleLower.includes("venda") || titleLower.includes("capcut") || titleLower.includes("edição") || titleLower.includes("ebook")) {
              category = "Projetos";
            } else if (titleLower.includes("dor") || titleLower.includes("remedio") || titleLower.includes("médico") || titleLower.includes("consulta") || titleLower.includes("água") || titleLower.includes("pélvica") || titleLower.includes("sangue")) {
              category = "Sua saúde";
            }

            let time = "15 min";
            if (category === "Projetos") time = "1h";
            if (category === "Filhos e Bebê" && titleLower.includes("vacina")) time = "1h";
            
            return {
              text: titleStr.charAt(0).toUpperCase() + titleStr.slice(1),
              time,
              cat: category,
              urgent
            };
          }).slice(0, 6);

          fallbackText = JSON.stringify(tasksList, null, 2);
        } else {
          fallbackText = "Dani, estou aqui para te apoiar. Foque no essencial para você e para as crianças hoje.";
        }

        const chunkSize = 15;
        for (let i = 0; i < fallbackText.length; i += chunkSize) {
          const chunk = fallbackText.slice(i, i + chunkSize);
          res.write(`data: ${JSON.stringify({ delta: { text: chunk } })}\n\n`);
          await new Promise(resolve => setTimeout(resolve, 20));
        }

        res.write("data: [DONE]\n\n");
        res.end();
      }
    } catch (err: any) {
      console.error("Error in /api/generate:", err);
      try {
        res.write(`data: ${JSON.stringify({ delta: { text: "Erro ao processar. Por favor, tente novamente." } })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
      } catch (writeErr) {
        // Response already ended or headers sent
      }
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
