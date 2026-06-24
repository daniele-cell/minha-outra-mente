import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Smile, 
  UserPlus, 
  TrendingUp, 
  AlertTriangle,
  Brain, 
  Briefcase, 
  Home, 
  HeartHandshake, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Archive,
  Info,
  Sliders,
  Send,
  Sparkle,
  Printer,
  X,
  PlayCircle,
  Activity,
  Bell,
  Volume2,
  BellOff,
  Thermometer,
  Droplets,
  Gauge,
  CloudRain,
  Sun,
  Cloud,
  MapPin,
  Search,
  CloudSun,
  RefreshCw
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Task, UserContext, CopilotResponse, ScheduledReminder } from "./types";
import { initialTasks, initialUserContext } from "./initialData";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("daniele_copilot_tasks");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialTasks;
      }
    }
    return initialTasks;
  });

  const [userContext, setUserContext] = useState<UserContext>(() => {
    const saved = localStorage.getItem("daniele_copilot_context2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialUserContext;
      }
    }
    return initialUserContext;
  });

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<Task["category"]>("DOMESTICO");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [smartImportText, setSmartImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [showCompletedArchive, setShowCompletedArchive] = useState(false);
  const [briefingDone, setBriefingDone] = useState<boolean>(() => {
    return localStorage.getItem("daniele_copilot_briefing_done") === "true";
  });

  useEffect(() => {
    localStorage.setItem("daniele_copilot_briefing_done", briefingDone ? "true" : "false");
  }, [briefingDone]);

  const [completedMicroSteps, setCompletedMicroSteps] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("daniele_copilot_microsteps");
    try {
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("daniele_copilot_microsteps", JSON.stringify(completedMicroSteps));
  }, [completedMicroSteps]);

  const [showMomAdvice, setShowMomAdvice] = useState<boolean>(() => {
    return localStorage.getItem("daniele_copilot_show_mom_advice") !== "false";
  });

  useEffect(() => {
    localStorage.setItem("daniele_copilot_show_mom_advice", showMomAdvice ? "true" : "false");
  }, [showMomAdvice]);

  const [completedSuggestions, setCompletedSuggestions] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("daniele_copilot_suggestions_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem("daniele_copilot_suggestions_v2", JSON.stringify(completedSuggestions));
  }, [completedSuggestions]);

  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const optionsDate: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        weekday: "long"
      };
      const formattedDate = now.toLocaleDateString("pt-BR", optionsDate);
      const formattedTime = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      setCurrentDateTime(`${capitalizedDate} • ${formattedTime}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic survival guidelines based on current context (Headache & Sleep deprivation)
  const getSurvivalSuggestions = (headache: "NENHUMA" | "LEVE" | "FORTE", sleptWell: boolean) => {
    const list = [];
    if (headache === "FORTE" && !sleptWell) {
      list.push({
        id: "soneca_emergencia",
        title: "🛌 1 Soneca Casada no Sofá (Urgente)",
        text: "Durma 1 soneca de emergência com o Pedro se deitando no sofá ou na cama compartilhada. Esqueça totalmente a regra do berço frio para hoje. O berço piora a inclinação nasal e a congestão do catarro dele, gerando irritação constante.",
        tag: "Biologia & Sobrevivência"
      });
      list.push({
        id: "hidratacao_parestesia",
        title: "💧 Hidratação para conter Parestesia",
        text: "A transição de Sertralina para o Topiramato pode causar formigamento neurológico inofensivo nos pés/mãos. Beber 500ml de água bem gelada atenua o formigamento do remédio imediatamente. (E coma sua cocada em paz, não tem nada a ver!).",
        tag: "Sintomático"
      });
      list.push({
        id: "veto_telas_forte",
        title: "🚫 Suspensão Total de Telas Visuais",
        text: "Edição de vídeos no Capcut, upload de posts e diagramação de e-books de alta carga visual hoje estão terminantemente PROIBIDOS pelo seu conselheiro. A luz do monitor alonga a crise de enxaqueca inicial de introdução do Topiramato.",
        tag: "Proteção Ocular"
      });
    } else if (headache === "FORTE" && sleptWell) {
      list.push({
        id: "cortina_brilho",
        title: "🕶️ Luz Baixa & Brilho Mínimo",
        text: "Mantenha as cortinas fechadas para atenuar fótons. Faça tarefas de baixa carga neural e grande alívio visual, como lavar a louça para esvaziar a pia e apagar o quadro escolar da Rebeca.",
        tag: "Contenção Ocular"
      });
      list.push({
        id: "veto_livros",
        title: "🚫 Segurar Leituras Densas",
        text: "Adie as leituras teóricas densas (como 12 Regras para a Vida) para a próxima semana. O cérebro está se readaptando à serotonina desmamada e as sinapses estão sensíveis.",
        tag: "Fadiga Cognitiva"
      });
    } else if (headache === "LEVE" && !sleptWell) {
      list.push({
        id: "bloco_nebulizacao",
        title: "🍵 Nebulização Dupla Integrada",
        text: "Aproveite para colocar a Rebeca e o Pedrinho fazendo a inalação com soro fisiológico sentadinhos juntos no sofá quente com cobertas. Curitiba está super fria; use uma TV monótona no escuro para sossegá-los enquanto a via aérea abre.",
        tag: "Inalação Coletiva"
      });
      list.push({
        id: "xampu_delivery",
        title: "🛍️ Abastecimento de Higiene por Rappi/iFood",
        text: "Peça para comprar o shampoo, condicionador e álcool por aplicativo de entrega em vez de sair. Guarde sua pouca energia física estritamente para o peito e o papá rápido (arroz e vegetais cozidos no mesmo vapor).",
        tag: "Logística Confortável"
      });
    } else {
      // NENHUMA/LEVE + sleptWell
      list.push({
        id: "recuperacao_nutri",
        title: "🌟 Janela de Recuperação Ativa",
        text: "Você dormiu bem e está sem dores intensas. Aproveite para preparar de forma acelerada o almoço inteligente (tudo na mesma panela ou vapor) e separe as roupas com calma.",
        tag: "Janela Produtiva"
      });
      list.push({
        id: "adesivo_sala",
        title: "🧹 Retirar Adesivo e Limpar Quadro",
        text: "Limpe pequenos focos visuais de bagunça na sala. Tirar o adesivo ou apagar o quadro limpa o estresse ambiente em menos de 15 minutos e traz bem-estar visual imediato.",
        tag: "Foco Estético"
      });
    }
    return list;
  };

  const toggleSuggestionCheck = (id: string) => {
    setCompletedSuggestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const [copilotAdvice, setCopilotAdvice] = useState<CopilotResponse>({
    advice: "Daniele, você foi uma guerreira e concluiu 13 pendências sob exaustão! Agora, seu briefing de sobrevivência da tarde foi enxugado ao máximo. Poupe sua mente, faça apenas o que é essencial para o conforto imediato do Pedrinho, da Rebeca e seu.",
    topThree: [
      "Pedir o almoço por delivery (Sem cozinhar mais hoje!).",
      "Finalizar a papa do Pedro com fubá.",
      "Passar o pano na cozinha (Rápido e sem esforço).",
      "Arrumar a Rebeca para o jogo."
    ]
  });
  const [activeTab, setActiveTab] = useState<"HOJE" | "SEMANA_QUE_VEM" | "DELEGAR_OU_APOIAR" | "TODOS">("HOJE");
  const [viewingReasoning, setViewingReasoning] = useState<number | null>(null);
  const [showAddNew, setShowAddNew] = useState(false);

  // Scheduled Focus Reminders States & Logics
  const [showScheduledList, setShowScheduledList] = useState(false);
  const [selectedReminderTask, setSelectedReminderTask] = useState("");
  const [customReminderText, setCustomReminderText] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("15:00");
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>(() => {
    const saved = localStorage.getItem("daniele_copilot_reminders");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default pre-populated below
      }
    }
    return [
      { id: "1", taskTitle: "Pedir o almoço por delivery", time: "12:15", active: true },
      { id: "2", taskTitle: "Finalizar a papa do Pedro com fubá", time: "14:00", active: true },
      { id: "3", taskTitle: "Passar o pano na cozinha", time: "15:15", active: true },
      { id: "4", taskTitle: "Arrumar a Rebeca para o jogo", time: "16:30", active: true }
    ];
  });
  const [activeTriggeredReminder, setActiveTriggeredReminder] = useState<ScheduledReminder | null>(null);

  // Dynamic Weather Health Advice States
  const [temperature, setTemperature] = useState<number>(24);
  const [humidity, setHumidity] = useState<number>(55);
  const [pressure, setPressure] = useState<number>(1012);
  const [weatherCity, setWeatherCity] = useState<string>("São Paulo");
  const [resolvedCity, setResolvedCity] = useState<string>("São Paulo, SP");
  const [customWeatherAdvice, setCustomWeatherAdvice] = useState<{
    momAdvice: string;
    babyAdvice: string;
    childAdvice: string;
    generalWarning: string;
  } | null>(null);
  const [isFetchingWeather, setIsFetchingWeather] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const getLocalWeatherAdvice = (tempVal: number, humVal: number, pressVal: number) => {
    let momAdvice = "Daniele, beba bastante água. Com o Topiramato na primeira semana e a amamentação do Pedro, sua necessidade de hidratação dobra para prevenir o cansaço e dores de cabeça.";
    let babyAdvice = "Mantenha o Pedro (6m) em livre demanda no peito. O leite materno é o hidratante perfeito para o bebê de 6 meses.";
    let childAdvice = "Incentive a Rebeca (11 anos) a beber água regularmente enquanto estuda ou brinca.";
    let generalWarning = "Clima ameno e agradável hoje. Ótimo para manter a mente tranquila.";

    // Temperature logic
    if (tempVal >= 30) {
      momAdvice = "Daniele, calor intenso! Beba água fria a cada hora. O Topiramato reduz a capacidade de suor do corpo, então evite ficar exposta para não ter picos de dor de cabeça. Descanse os olhos.";
      babyAdvice = "Bebê Pedro (6m) precisa de roupas super leves de algodão. Amamente em livre demanda para hidratação. Um banho morno ou fresco ajuda bastante.";
      childAdvice = "Rebeca (11 anos) deve evitar atividades físicas pesadas sob sol direto hoje. Ofereça sucos e água gelada.";
      generalWarning = "Alerta de calor intenso! Evite exposição e previna desidratação na amamentação.";
    } else if (tempVal < 19) {
      momAdvice = "Daniele, clima frio. Tome chás quentes e aconchegantes para aliviar a tensão da transição medicamentosa. Evite vento frio se estiver com dor de cabeça.";
      babyAdvice = "Vista o Pedro em camadas confortáveis (um body e um macacão macio). Cuidado com o ressecamento da pele dele após o banho.";
      childAdvice = "Rebeca deve se agasalhar bem ao sair. Mantenha os ambientes arejados, mas sem correntes frias.";
      generalWarning = "Clima frio detectado. Priorize o conforto térmico do bebê Pedro e bebidas acolhedoras.";
    }

    // Humidity logic
    if (humVal < 40) {
      momAdvice += " A umidade está muito baixa (" + humVal + "%). A desidratação é um gatilho direto de enxaqueca com o Topiramato; dobre sua ingestão de água hoje e use colírio lubrificante se necessário.";
      babyAdvice += " Lave as narinas do Pedro com soro fisiológico e ligue o umidificador de ar no quarto para aliviar a respiração do bebê.";
      childAdvice += " Ajude a Rebeca a higienizar o nariz com soro e a beber água extra para evitar a garganta seca.";
      generalWarning = "Alerta de baixa umidade do ar (" + humVal + "%). Cuidado respiratório redobrado para o bebê.";
    } else if (humVal > 80) {
      momAdvice += " A umidade está alta (" + humVal + "%). O ar pode parecer abafado. Mantenha os ambientes ventilados.";
      babyAdvice += " Fique atenta a mofo ou ácaros. Deixe as janelas abertas para circulação do ar.";
      generalWarning = "Umidade do ar elevada. Mantenha a casa bem arejada para o bem-estar de todos.";
    }

    // Pressure logic (enxaqueca trigger)
    if (pressVal < 1010) {
      momAdvice += " Atenção física: a pressão atmosférica está baixa (" + pressVal + " hPa), o que é um conhecido gatilho para crises de enxaqueca. Como você está na transição para o Topiramato, proteja sua visão, escureça as telas de celular/computador e evite esforço mental pesado.";
      generalWarning = "Atenção: Pressão atmosférica baixa (" + pressVal + " hPa). Risco aumentado de dores de cabeça.";
    }

    return { momAdvice, babyAdvice, childAdvice, generalWarning };
  };

  const handleFetchRealtimeWeather = async (options?: { city?: string; lat?: number; lon?: number }) => {
    setIsFetchingWeather(true);
    setWeatherError(null);
    try {
      const payload: any = { userContext };
      if (options?.city) {
        payload.city = options.city;
      } else if (options?.lat !== undefined && options?.lon !== undefined) {
        payload.latitude = options.lat;
        payload.longitude = options.lon;
      } else if (weatherCity) {
        payload.city = weatherCity;
      }

      const response = await fetch("/api/realtime-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTemperature(data.temperature);
          setHumidity(data.humidity);
          setPressure(data.pressure);
          setResolvedCity(data.cityName);
          if (options?.city) {
            setWeatherCity(options.city);
          }
          setCustomWeatherAdvice(data.advice);
        } else {
          setWeatherError("Não foi possível obter a previsão para esta localização.");
        }
      } else {
        setWeatherError("Erro na resposta do servidor de clima.");
      }
    } catch (err) {
      console.error("Error fetching real-time weather advice:", err);
      setWeatherError("Erro ao conectar com o serviço de previsão do tempo.");
    } finally {
      setIsFetchingWeather(false);
    }
  };

  const handleFetchGPSWeather = () => {
    if (!navigator.geolocation) {
      setWeatherError("Geolocalização não é suportada por este navegador.");
      return;
    }
    setIsFetchingWeather(true);
    setWeatherError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleFetchRealtimeWeather({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setWeatherError("Permissão de localização recusada ou indisponível. Buscando São Paulo...");
        handleFetchRealtimeWeather({ city: "São Paulo" });
      }
    );
  };

  // Initial real-time weather load on mount
  useEffect(() => {
    handleFetchRealtimeWeather({ city: "São Paulo" });
  }, []);

  useEffect(() => {
    localStorage.setItem("daniele_copilot_reminders", JSON.stringify(scheduledReminders));
  }, [scheduledReminders]);

  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      
      // Beautiful triple focus chimes
      playTone(523.25, ctx.currentTime, 0.4); // C5
      playTone(659.25, ctx.currentTime + 0.15, 0.5); // E5
      playTone(783.99, ctx.currentTime + 0.3, 0.7); // G5
    } catch (e) {
      console.warn("Audio Context blocked:", e);
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          playChime();
        }
      } catch (err) {
        console.error("Erro ao solicitar permissão de notificações:", err);
      }
    }
  };

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentHourMin = `${hours}:${minutes}`;
      const todayStr = now.toDateString();

      let updated = false;
      const newReminders = scheduledReminders.map(rem => {
        if (rem.active && rem.time === currentHourMin && rem.lastTriggeredDate !== todayStr) {
          // Trigger the alert!
          setActiveTriggeredReminder(rem);
          playChime();
          
          if ("Notification" in window && Notification.permission === "granted") {
            try {
              new Notification("MOM: Hora do seu Foco tático!", {
                body: `Daniele, é hora de focar em: "${rem.taskTitle}"`,
                tag: rem.id
              });
            } catch (err) {
              console.error(err);
            }
          }
          updated = true;
          return { ...rem, lastTriggeredDate: todayStr };
        }
        return rem;
      });

      if (updated) {
        setScheduledReminders(newReminders);
      }
    };

    checkAlarms();
    const interval = setInterval(checkAlarms, 10000);
    return () => clearInterval(interval);
  }, [scheduledReminders]);

  // Auto-migrate local storage cache to the afternoon briefing state
  useEffect(() => {
    const isMigrated = localStorage.getItem("daniele_copilot_v3_afternoon");
    if (!isMigrated) {
      setTasks(initialTasks);
      setCopilotAdvice({
        advice: "Daniele, você foi uma guerreira e concluiu 13 pendências sob exaustão! Agora, seu briefing de sobrevivência da tarde foi enxugado ao máximo. Poupe sua mente, faça apenas o que é essencial para o conforto imediato do Pedrinho, da Rebeca e seu.",
        topThree: [
          "Pedir o almoço por delivery (Sem cozinhar mais hoje!).",
          "Finalizar a papa do Pedro com fubá.",
          "Passar o pano na cozinha (Rápido e sem esforço).",
          "Arrumar a Rebeca para o jogo."
        ]
      });
      localStorage.setItem("daniele_copilot_v3_afternoon", "true");
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("daniele_copilot_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("daniele_copilot_context2", JSON.stringify(userContext));
  }, [userContext]);

  // Request a custom execution plan using our backend endpoint powered by Gemini
  const generateAIPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasks: tasks.map(t => ({
            id: t.id,
            title: t.title,
            category: t.category,
            scheduleDecision: t.scheduleDecision,
            estimatedTimeMinutes: t.estimatedTimeMinutes,
            executiveReasoning: t.executiveReasoning
          })),
          userContext
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar roteiro estratégico com o Gemini no servidor.");
      }

      const data: CopilotResponse = await response.json();
      if (data.advice) {
        setCopilotAdvice({
          advice: data.advice,
          topThree: data.topThree || []
        });
        setBriefingDone(false);
        setCompletedMicroSteps({});
        setShowMomAdvice(true);

        if (data.categorizedTasks && data.categorizedTasks.length > 0) {
          // Update the localized scheduling and estimates from the AI adviser
          setTasks(prev => {
            return prev.map(t => {
              const matched = data.categorizedTasks?.find(ct => ct.id === t.id || ct.title.toLowerCase() === t.title.toLowerCase());
              if (matched) {
                return {
                  ...t,
                  scheduleDecision: matched.scheduleDecision as any,
                  estimatedTimeMinutes: matched.estimatedTimeMinutes,
                  executiveReasoning: matched.executiveReasoning
                };
              }
              return t;
            });
          });
        }
      }
    } catch (error) {
      console.error(error);
      alert("Houve um erro técnico temporário ao rodar o Copiloto. Mantendo as regras salvas localmente.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Toggle checklist completion
  const toggleTaskCompletion = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Move task schedule manually
  const updateTaskSchedule = (id: number, decision: Task["scheduleDecision"]) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, scheduleDecision: decision } : t));
  };

  // Add new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      originalIndex: tasks.length + 1,
      title: newTaskTitle,
      category: newTaskCategory,
      scheduleDecision: "HOJE", // defaults to today
      estimatedTimeMinutes: 15,
      executiveReasoning: "Adicionado manualmente. Pronto para triagem executiva pelo copiloto.",
      completed: false
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle("");
    setShowAddNew(false);
  };

  // Import raw text directly (no AI)
  const handleDirectImport = () => {
    if (!smartImportText.trim()) return;

    // Split by line to support multi-line direct inserts, and also split by '+' to ensure task atomicity
    const lines: string[] = [];
    smartImportText.split("\n").forEach(line => {
      const cleanedLine = line.replace(/^[-*•\d.]+\s*/, "").trim(); // clean list symbols like - or * or bullet points
      if (cleanedLine) {
        if (cleanedLine.includes("+")) {
          const parts = cleanedLine.split("+").map(p => p.trim()).filter(p => p.length > 0);
          lines.push(...parts);
        } else {
          lines.push(cleanedLine);
        }
      }
    });

    if (lines.length === 0) return;

    const newTasksList: Task[] = lines.map((title, index) => ({
      id: Date.now() + index,
      originalIndex: tasks.length + index + 1,
      title: title,
      category: "OUTROS",
      scheduleDecision: "HOJE",
      estimatedTimeMinutes: 15,
      executiveReasoning: "Adicionado via importação direta rápida na sexta-feira.",
      completed: false
    }));

    setTasks(prev => [...newTasksList, ...prev]);
    setSmartImportText("");
  };

  // Import using Gemini AI parsing
  const handleSmartImport = async () => {
    if (!smartImportText.trim()) return;
    setIsImporting(true);

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: smartImportText,
          userContext
        })
      });

      if (!response.ok) {
        throw new Error("Erro de comunicação com o copiloto.");
      }

      const data = await response.json();
      if (data.tasks && Array.isArray(data.tasks) && data.tasks.length > 0) {
        const newTasksList: Task[] = data.tasks.map((parsed: any, index: number) => ({
          id: Date.now() + index,
          originalIndex: tasks.length + index + 1,
          title: parsed.title,
          category: parsed.category || "OUTROS",
          scheduleDecision: parsed.scheduleDecision || "HOJE",
          estimatedTimeMinutes: parsed.estimatedTimeMinutes || 15,
          executiveReasoning: parsed.executiveReasoning || "Sua mente livre de culpa pelo copiloto.",
          completed: false
        }));

        setTasks(prev => [...newTasksList, ...prev]);
        setSmartImportText("");
      } else {
        // Fallback if AI returned empty or formatted weirdly
        handleDirectImport();
      }
    } catch (e) {
      console.error(e);
      // Friendly fallback to direct import if API fails (so user is not blocked)
      alert("Conexão ao Copiloto instável. Importamos suas tarefas diretamente para você sem atrasos!");
      handleDirectImport();
    } finally {
      setIsImporting(false);
    }
  };

  // Remove task
  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Revert / Reset to original state
  const handleResetToDefault = () => {
    if (window.confirm("Deseja redefinir a lista para as 28 tarefas originais enviadas?")) {
      setTasks(initialTasks);
      setUserContext(initialUserContext);
      localStorage.removeItem("daniele_copilot_tasks");
      localStorage.removeItem("daniele_copilot_context2");
    }
  };

  // Category Colors & Icons Helper for Dark Theme
  const getCategoryTheme = (cat: Task["category"]) => {
    switch (cat) {
      case "DOMESTICO":
        return { 
          bg: "bg-slate-800 text-slate-300 border-slate-700/60", 
          icon: <Home className="w-3.5 h-3.5 text-slate-400" />, 
          label: "Casa e Louça" 
        };
      case "MATERNIDADE":
        return { 
          bg: "bg-rose-500/10 text-rose-300 border-rose-500/20", 
          icon: <Brain className="w-3.5 h-3.5 text-rose-450" />, 
          label: "Filhos e Bebê" 
        };
      case "PROFISSIONAL":
        return { 
          bg: "bg-amber-500/10 text-amber-300 border-amber-500/20", 
          icon: <Briefcase className="w-3.5 h-3.5 text-amber-400" />, 
          label: "Projetos e Blog" 
        };
      case "SAUDE_PESSOAL":
        return { 
          bg: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20", 
          icon: <Stethoscope className="w-3.5 h-3.5 text-fuchsia-400" />, 
          label: "Saúde e Mente" 
        };
      default:
        return { 
          bg: "bg-slate-800 text-slate-300 border-slate-700/60", 
          icon: <HelpCircle className="w-3.5 h-3.5 text-slate-400" />, 
          label: "Outros" 
        };
    }
  };

  // Calculations for dashboard
  const todayTasks = tasks.filter(t => t.scheduleDecision === "HOJE");
  const nextWeekTasks = tasks.filter(t => t.scheduleDecision === "SEMANA_QUE_VEM");
  const delegateTasks = tasks.filter(t => t.scheduleDecision === "DELEGAR_OU_APOIAR");

  const completedTodayCount = todayTasks.filter(t => t.completed).length;
  const totalTodayCount = todayTasks.length;
  const progressTodayPercentage = totalTodayCount > 0 ? Math.round((completedTodayCount / totalTodayCount) * 100) : 0;

  // Sum estimated time of remaining tasks for today
  const totalMinutesToday = todayTasks.filter(t => !t.completed).reduce((acc, t) => acc + t.estimatedTimeMinutes, 0);

  // Filter tasks based on selected tab
  const filteredTasks = tasks.filter(t => {
    if (activeTab === "TODOS") return true;
    return t.scheduleDecision === activeTab;
  });

  const renderTaskRow = (task: Task) => {
    const theme = getCategoryTheme(task.category);
    return (
      <div 
        key={task.id} 
        className={`p-4 hover:bg-slate-900/40 transition-all ${
          task.completed ? "bg-slate-950/20" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-start space-x-3.5 flex-1">
            {/* Checkbox selector */}
            <button
              onClick={() => toggleTaskCompletion(task.id)}
              className="text-slate-500 hover:text-teal-400 transition-all mt-0.5 cursor-pointer flex-shrink-0"
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-teal-400 fill-teal-950/20" />
              ) : (
                <Circle className="w-5 h-5 text-slate-700" />
              )}
            </button>

            <div className="space-y-1 font-sans">
              {/* Task Title */}
              <p className={`text-xs md:text-sm font-medium leading-relaxed ${
                task.completed ? "text-slate-500 line-through" : "text-slate-200"
              }`}>
                {task.title}
              </p>

              {/* Task information pills and metadata */}
              <div className="flex flex-wrap gap-2.5 items-center text-[10px]">
                
                {/* Decided Time Tag */}
                <span className="font-mono bg-slate-950/80 text-slate-400 border border-slate-900 px-2 py-0.5 rounded flex items-center space-x-1.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{task.estimatedTimeMinutes} min</span>
                </span>

                {/* Category Badge */}
                <span className={`px-2 py-0.5 rounded border ${theme.bg} flex items-center space-x-1.5`}>
                  {theme.icon}
                  <span className="font-medium">{theme.label}</span>
                </span>

                {/* Reasoning disclosure dropdown switcher */}
                {task.executiveReasoning && (
                  <button
                    onClick={() => setViewingReasoning(viewingReasoning === task.id ? null : task.id)}
                    className="text-teal-400 hover:text-teal-350 font-bold flex items-center space-x-0.5 cursor-pointer"
                  >
                    <span>Visão da MOM:</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${viewingReasoning === task.id ? "rotate-180" : ""}`} />
                  </button>
                )}

              </div>
            </div>
          </div>

          {/* Interactive Executive Rescheduling and deleting controls */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            
            {/* Reschedule control select switcher */}
            <div className="hidden sm:flex items-center space-x-1.5">
              <span className="text-[10px] text-slate-500 font-mono">Agendar:</span>
              <select
                value={task.scheduleDecision}
                onChange={(e) => updateTaskSchedule(task.id, e.target.value as any)}
                className="text-[11px] bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded px-2 py-1 font-medium text-slate-300 focus:outline-none focus:border-teal-500"
              >
                <option value="HOJE">Fazer Hoje</option>
                <option value="SEMANA_QUE_VEM">Fim de Semana / Próxima Semana</option>
                <option value="DELEGAR_OU_APOIAR">Delegar / Pedir Apoio</option>
              </select>
            </div>

            {/* Delete */}
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1 px-1.5 text-slate-700 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-all cursor-pointer"
              title="Remover do cérebro"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>

        {/* Mobile friendly rescheduling control */}
        <div className="sm:hidden mt-3 pt-2.5 border-t border-slate-900 flex items-center space-x-2 font-sans">
          <span className="text-[10px] text-slate-500">Agendamento:</span>
          <div className="flex gap-1 flex-wrap">
            {["HOJE", "SEMANA_QUE_VEM", "DELEGAR_OU_APOIAR"].map((opt) => (
              <button
                key={opt}
                onClick={() => updateTaskSchedule(task.id, opt as any)}
                className={`text-[9px] px-2 py-0.5 rounded border font-medium ${
                  task.scheduleDecision === opt
                    ? "bg-teal-500 text-slate-950 border-teal-500"
                    : "bg-slate-950 text-slate-400 border-slate-800"
                }`}
              >
                {opt === "HOJE" ? "Hoje" : opt === "SEMANA_QUE_VEM" ? "Adiar" : "Delegar"}
              </button>
            ))}
          </div>
        </div>

        {/* Disclosed Executive Reasoning display */}
        <AnimatePresence>
          {viewingReasoning === task.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 ml-8 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400 leading-relaxed font-sans"
            >
              <div className="font-bold text-[9px] text-teal-400 uppercase tracking-widest mb-1.5 flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-teal-400" />
                <span>Conselho de Gestão de Carga</span>
              </div>
              {task.executiveReasoning}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-900 selection:text-teal-200">
      
      {/* Premium Dark Glassmorphism Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 print:hidden font-sans">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between font-sans">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-650 to-indigo-650 flex items-center justify-center text-white shadow-lg shadow-teal-950/40">
              <Sparkles className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <span className="font-sans font-black text-lg tracking-wider text-white">M.O.M.</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 font-sans">
            <div className="text-[11px] font-mono text-slate-500 flex items-center space-x-1.5">
              <span className="w-1 h-1 rounded-full bg-teal-400/80 animate-pulse"></span>
              <span>{currentDateTime || "Carregando..."}</span>
            </div>
            <button
              onClick={handleResetToDefault}
              title="Restaurar tarefas padrão"
              className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-900 rounded-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6 print:hidden font-sans">
        
        {/* Personalized Welcoming Heading */}
        <div className="py-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-350">
            Olá, Daniele. Como você está hoje?
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Aqui está o seu Painel Executivo e suporte pessoal para gerenciar o dia de hoje.
          </p>
        </div>

        {/* Main Advisory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Controle de Danos e Sobrecarga (Left, 1 column) */}
          <div className="lg:col-span-1 space-y-6">
            <motion.section 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-indigo-950/20 border border-slate-800/85 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col space-y-5"
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-550/10 rounded-full blur-3xl pointer-events-none" style={{ animationDelay: "1s" }}></div>
              
              <div className="space-y-4 relative z-10">
                <div className="space-y-1.5 font-sans">
                  <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>Controle de Danos e Sobrecarga</span>
                  </h2>
                </div>

                {/* Toggles - INVERTED ORDER: Sleep Quality first, then Headache severity */}
                <div className="space-y-3 pt-1 font-sans">
                  
                  {/* Qualidade do Sono first */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest block flex items-center space-x-1 font-sans uppercase">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Qualidade de Sono Recente</span>
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setUserContext(p => ({ ...p, hasSleptWell: true }))}
                        className={`flex-1 text-[11px] py-2 rounded-lg font-bold transition-all cursor-pointer ${
                          userContext.hasSleptWell 
                            ? "bg-indigo-600 text-white shadow-md font-bold text-teal-200" 
                            : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80"
                        }`}
                      >
                        Dormi bem
                      </button>
                      <button
                        onClick={() => setUserContext(p => ({ ...p, hasSleptWell: false }))}
                        className={`flex-1 text-[11px] py-2 rounded-lg font-bold transition-all cursor-pointer ${
                          !userContext.hasSleptWell 
                            ? "bg-amber-500 text-slate-950 shadow-md font-bold" 
                            : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80"
                        }`}
                      >
                        Sem Dormir
                      </button>
                    </div>
                  </div>

                  {/* Intensidade Ocular da Dor second */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest block flex items-center space-x-1 font-sans uppercase">
                      <Sliders className="w-3.5 h-3.5 text-teal-400" />
                      <span>Intensidade Ocular da Dor</span>
                    </span>
                    <div className="flex space-x-1.5">
                      {["NENHUMA", "LEVE", "FORTE"].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setUserContext(p => ({ ...p, headacheLevel: lvl as any }))}
                          className={`flex-1 text-[10px] py-2 rounded-lg font-bold transition-all cursor-pointer ${
                            userContext.headacheLevel === lvl 
                              ? "bg-teal-500 text-slate-950 shadow-md font-bold" 
                              : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Button - TRANSPARENT BACKGROUND (No backdrop/border, seamless integration) */}
              <div className="pt-2 bg-transparent p-0 border-0 shadow-none flex flex-col space-y-2 relative z-10">
                <div className="flex items-center space-x-1 text-[10px] text-teal-400 font-mono font-bold tracking-wider font-sans">
                  <Sparkles className="w-3 h-3 text-teal-400 animate-spin" />
                  <span>INTELIGÊNCIA SENSORIAL</span>
                </div>
                <button
                  onClick={generateAIPlan}
                  disabled={isGeneratingPlan}
                  className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:brightness-110 text-white py-3 px-4 rounded-xl text-xs font-extrabold shadow-xl shadow-purple-950/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 font-sans"
                >
                  {isGeneratingPlan ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>MOM está reorganizando...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 text-white fill-white animate-bounce" />
                      <span className="tracking-wide text-xs text-white">MOM, filtre minhas prioridades</span>
                    </>
                  )}
                </button>
                {briefingDone && (
                  <button
                    onClick={() => {
                      setBriefingDone(false);
                      localStorage.setItem("daniele_copilot_briefing_done", "false");
                    }}
                    className="text-[10px] text-teal-400 hover:text-teal-350 text-center font-bold tracking-wider underline cursor-pointer mt-2 transition-all bg-transparent border-none"
                  >
                    Mostrar Briefing do Dia
                  </button>
                )}
              </div>
            </motion.section>
          </div>

          {/* Column 2: Prioridades Máximas & Sobrevivência (Right, 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            <AnimatePresence>
              {!briefingDone && todayTasks.length > 0 && todayTasks.some(t => !t.completed) && (
                <motion.section 
                  key="briefing-do-dia-card"
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-5 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  {/* Header Title with Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 relative z-10">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-sans">
                        <HeartHandshake className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm tracking-tight text-white font-sans">Prioridades Máximas & Sobrevivência</h3>
                        <p className="text-[10px] text-slate-400 font-mono">Nosso plano de ação prioritário integrado para hoje</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setBriefingDone(true)}
                      className="text-[11px] bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 hover:text-white border border-teal-500/20 hover:border-teal-450 px-3 py-1.5 rounded-lg font-extrabold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer font-sans self-start sm:self-auto"
                      title="Marcar como feito e ocultar briefing"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                      <span>Concluir Bloco</span>
                    </button>
                  </div>

                  {/* MOM Advice Box (dynamic / dismissable) */}
                  <AnimatePresence>
                    {showMomAdvice && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="text-xs text-slate-200 leading-relaxed italic bg-slate-950/75 p-4 border border-slate-850 rounded-xl font-sans relative z-10 flex gap-3 items-start overflow-hidden"
                      >
                        <div className="flex-1 mt-0.5">
                          <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-teal-300 font-mono font-bold">Conselho da MOM</span>
                          <p className="mt-1.5">"{copilotAdvice.advice}"</p>
                        </div>
                        <button
                          onClick={() => setShowMomAdvice(false)}
                          className="text-slate-500 hover:text-rose-450 transition-all font-sans text-xs font-bold p-1 rounded hover:bg-slate-900 border-none cursor-pointer self-start"
                          title="Ocultar Conselho"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!showMomAdvice && (
                    <div className="flex justify-end relative z-10 -mt-2">
                      <button
                        onClick={() => setShowMomAdvice(true)}
                        className="text-[10px] text-teal-400 hover:text-teal-350 hover:underline bg-transparent border-none cursor-pointer font-bold tracking-wide flex items-center space-x-1"
                      >
                        <span>💡 Exibir conselho da MOM</span>
                      </button>
                    </div>
                  )}

                  {/* Combined Grid: Micro-passos (Piloto) e Prescrições de Sobrevivência */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10 pt-2 border-t border-slate-800/40">
                    
                    {/* Column A: Micro-passos */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-1.5">
                        <PlayCircle className="w-4 h-4 text-teal-400" />
                        <span className="text-[11px] font-bold text-teal-400 uppercase tracking-widest block font-mono">
                          Micro-Passos (Piloto Automático):
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {copilotAdvice.topThree.map((step, idx) => {
                          const isCheck = !!completedMicroSteps[step];
                          return (
                            <div 
                              key={idx} 
                              onClick={() => {
                                setCompletedMicroSteps(prev => ({ ...prev, [step]: !prev[step] }));
                              }}
                              className={`bg-slate-950/75 border p-3.5 rounded-xl flex items-start space-x-3 shadow-xs cursor-pointer select-none transition-all duration-200 ${
                                isCheck 
                                  ? "border-teal-500/20 bg-teal-950/5 opacity-60" 
                                  : "border-slate-850 hover:border-slate-800 hover:bg-slate-1050"
                              }`}
                            >
                              <button
                                type="button"
                                className="text-slate-500 hover:text-teal-400 transition-all cursor-pointer flex-shrink-0 mt-0.5 bg-transparent border-none focus:outline-none"
                              >
                                {isCheck ? (
                                  <CheckCircle2 className="w-4.5 h-4.5 text-teal-400 fill-teal-950/30" />
                                ) : (
                                  <Circle className="w-4.5 h-4.5 text-slate-700" />
                                )}
                              </button>
                              
                              <div className="flex-1 flex flex-col">
                                <span className={`font-medium text-[11px] leading-relaxed font-sans ${isCheck ? "text-slate-500 line-through" : "text-slate-200"}`}>
                                  {step}
                                </span>
                                {(() => {
                                  const rem = scheduledReminders.find(r => 
                                    r.taskTitle.toLowerCase().trim() === step.toLowerCase().trim()
                                  );
                                  if (rem && rem.active) {
                                    return (
                                      <div className="mt-1.5 flex items-center space-x-1 text-[9px] font-bold font-mono text-teal-400 bg-teal-950/40 border border-teal-900/30 px-1.5 py-0.5 rounded-md w-max">
                                        <Clock className="w-3 h-3 text-teal-400 animate-pulse" />
                                        <span>Foco MOM agendado às {rem.time}</span>
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column B: Prescrições */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-1.5">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">
                          Prescrições de Saúde & Conforto:
                        </span>
                      </div>

                      <div className="space-y-2">
                        {getSurvivalSuggestions(userContext.headacheLevel, userContext.hasSleptWell).map((sug) => {
                          const isCheck = !!completedSuggestions[sug.id];
                          return (
                            <div 
                              key={sug.id}
                              onClick={() => toggleSuggestionCheck(sug.id)}
                              className={`bg-slate-950/75 border p-3.5 rounded-xl flex items-start space-x-3 shadow-xs cursor-pointer select-none transition-all duration-200 ${
                                isCheck 
                                  ? "border-indigo-500/20 bg-indigo-950/5 opacity-60" 
                                  : "border-slate-850 hover:border-slate-800 hover:bg-slate-1050"
                              }`}
                            >
                              <button
                                type="button"
                                className="text-slate-500 hover:text-indigo-400 transition-all cursor-pointer flex-shrink-0 mt-0.5 bg-transparent border-none focus:outline-none"
                              >
                                {isCheck ? (
                                  <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 fill-indigo-950/30" />
                                ) : (
                                  <Circle className="w-4.5 h-4.5 text-slate-700" />
                                )}
                              </button>

                              <div className="flex-1 space-y-0.5">
                                <div className="flex items-center justify-between">
                                  <h4 className={`text-[11px] font-bold leading-relaxed font-sans ${isCheck ? "text-slate-505 line-through" : "text-white"}`}>
                                    {sug.title}
                                  </h4>
                                  <span className="text-[8px] font-bold font-mono text-indigo-400 uppercase tracking-wider bg-indigo-950/50 px-1.5 py-0.2 rounded border border-indigo-900/30">
                                    {sug.tag}
                                  </span>
                                </div>
                                <p className={`text-[10px] leading-relaxed font-sans ${isCheck ? "text-slate-605 line-through" : "text-slate-400"}`}>
                                  {sug.text}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Central de Lembretes Agendados MOM */}
                  <div className="mt-5 pt-5 border-t border-slate-800/60 relative z-10 space-y-4">
                    
                    {/* Quick Add Custom Reminder - Rodapé */}
                    <div className="bg-slate-950/45 border border-slate-850/60 p-3 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-teal-400 font-mono uppercase tracking-widest flex items-center space-x-1.5">
                            <Bell className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                            <span>Agendar Novo Lembrete de Foco (MOM)</span>
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => setShowScheduledList(!showScheduledList)}
                            className="text-[9px] font-mono text-slate-400 hover:text-white underline cursor-pointer"
                          >
                            {showScheduledList ? "Ocultar Central de Lembretes ✕" : `Ver Lembretes Agendados (${scheduledReminders.filter(r => r.active).length} ativos)`}
                          </button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <select
                            value={selectedReminderTask}
                            onChange={(e) => {
                              setSelectedReminderTask(e.target.value);
                            }}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-slate-700 flex-1 min-w-[200px]"
                          >
                            <option value="" disabled>Escolha uma das Prioridades da Tarde...</option>
                            {copilotAdvice.topThree.map((step, sIdx) => (
                              <option key={sIdx} value={step}>
                                {step}
                              </option>
                            ))}
                            <option value="custom">-- Digitar Outro Lembrete Personalizado --</option>
                          </select>
                          
                          {selectedReminderTask === "custom" && (
                            <input
                              type="text"
                              placeholder="Descreva o seu lembrete personalizado..."
                              value={customReminderText}
                              onChange={(e) => setCustomReminderText(e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-slate-700 flex-1"
                            />
                          )}
                          
                          <input
                            type="time"
                            value={newReminderTime}
                            onChange={(e) => setNewReminderTime(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-slate-700 w-24 self-start sm:self-auto"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          let title = selectedReminderTask;
                          if (title === "custom") {
                            title = customReminderText.trim();
                          }
                          
                          if (!title) {
                            alert("Por favor, selecione ou escreva o assunto do lembrete.");
                            return;
                          }
                          
                          const time = newReminderTime || "15:00";
                          const newId = String(Date.now());
                          
                          setScheduledReminders(prev => [
                            ...prev,
                            { id: newId, taskTitle: title, time, active: true }
                          ]);
                          
                          // Reset fields
                          setSelectedReminderTask("");
                          setCustomReminderText("");
                          
                          // Play chime for confirmation
                          playChime();
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-[11px] font-sans rounded-lg shadow-sm transition-all duration-150 self-end md:self-center flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agendar Lembrete</span>
                      </button>
                    </div>

                    {/* Collapsible Scheduled List and Settings */}
                    {showScheduledList && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 bg-slate-950/20 p-4 rounded-xl border border-slate-850/50 mt-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-900/60">
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
                              <span>Central de Lembretes Agendados MOM</span>
                            </h4>
                            <p className="text-[9px] text-slate-400 font-sans">
                              A MOM enviará alertas com som e notificações para guiar seu foco nos blocos da tarde.
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 self-start sm:self-center">
                            <button
                              type="button"
                              onClick={requestNotificationPermission}
                              className="px-2.5 py-1 text-[9px] font-bold font-mono text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 rounded border border-slate-750 transition-all flex items-center space-x-1.5 cursor-pointer"
                              title="Permitir notificações do sistema"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                              <span>Notificar no Computador</span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={playChime}
                              className="px-2.5 py-1 text-[9px] font-bold font-mono text-amber-400 hover:text-amber-300 bg-amber-950/20 hover:bg-amber-950/40 rounded border border-amber-900/40 transition-all flex items-center space-x-1 cursor-pointer"
                            >
                              <span>Testar Som 🔊</span>
                            </button>
                          </div>
                        </div>

                        {scheduledReminders.length === 0 ? (
                          <p className="text-[10px] text-slate-500 font-sans italic text-center py-2">
                            Nenhum lembrete agendado no momento. Use o formulário acima para agendar!
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {scheduledReminders.map(rem => (
                              <div 
                                key={rem.id}
                                className={`bg-slate-1000/60 border rounded-xl p-3 flex flex-col justify-between space-y-3 transition-all duration-200 ${
                                  rem.active 
                                    ? "border-slate-800 hover:border-slate-750 bg-slate-950/40" 
                                    : "border-slate-900/50 opacity-50 hover:opacity-75"
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-start justify-between gap-1">
                                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                                      Lembrete #{rem.id}
                                    </span>
                                    
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setScheduledReminders(prev => prev.map(r => r.id === rem.id ? { ...r, active: !r.active } : r));
                                      }}
                                      className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                                        rem.active
                                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 hover:bg-emerald-950/60"
                                          : "bg-slate-850 text-slate-500 border border-slate-800 hover:bg-slate-800"
                                      }`}
                                    >
                                      {rem.active ? "ATIVO" : "INATIVO"}
                                    </button>
                                  </div>
                                  
                                  <p className="text-[11px] font-medium text-slate-200 leading-tight">
                                    {rem.taskTitle}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-slate-900/30">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-slate-500" />
                                    <input
                                      type="time"
                                      value={rem.time}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (val) {
                                          setScheduledReminders(prev => prev.map(r => r.id === rem.id ? { ...r, time: val } : r));
                                        }
                                      }}
                                      className="bg-slate-900/80 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-200 focus:outline-none focus:border-slate-700 w-16"
                                    />
                                  </div>
                                  
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setScheduledReminders(prev => prev.filter(r => r.id !== rem.id));
                                    }}
                                    className="text-slate-600 hover:text-red-400 transition-all p-1 hover:bg-slate-900/50 rounded cursor-pointer"
                                    title="Remover lembrete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                </motion.section>
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* Shiny Premium Dark Scorecards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
          <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-4 flex items-center space-x-4 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Carga Estimada de Hoje</span>
              <span className="text-lg font-semibold text-white">{totalMinutesToday} min</span>
              <span className="text-[10px] text-teal-400 block leading-none mt-1">Acordou cansada? Reduzimos o escopo.</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-4 flex items-center space-x-4 shadow-sm font-sans">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] text-slate-400 block font-medium">Progresso Hoje</span>
              <span className="text-lg font-semibold text-white">{completedTodayCount} / {totalTodayCount}</span>
              <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-800">
                <div 
                  className="bg-indigo-500 bg-gradient-to-r from-teal-400 to-indigo-505 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressTodayPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-4 flex items-center space-x-4 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-505/20 flex items-center justify-center text-amber-450 flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Transferido para Próxima Semana</span>
              <span className="text-lg font-semibold text-amber-450">{nextWeekTasks.length} Tarefas</span>
              <span className="text-[10px] text-slate-400 block leading-snug mt-1 font-sans">
                {nextWeekTasks.length} tarefas bloqueadas pela MOM na sua agenda hoje.
              </span>
            </div>
          </div>
        </div>

        {/* Content scheduling dashboard manager with dark tabs */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-3 border border-slate-900 rounded-xl shadow-xs">
            <div className="flex flex-wrap gap-1.5 font-sans">
              {[
                { id: "HOJE", label: `Fazer Hoje (${todayTasks.length})` },
                { id: "SEMANA_QUE_VEM", label: `Próxima semana / Adiado (${nextWeekTasks.length})` },
                { id: "DELEGAR_OU_APOIAR", label: `Delegar / Apoio do Rapha (${delegateTasks.length})` },
                { id: "TODOS", label: `Ver Todas (${tasks.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-xs px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? "bg-slate-800 text-teal-300 border border-slate-700/60 shadow-sm" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddNew(!showAddNew)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700/60 px-3.5 py-1.5 rounded-lg font-bold flex items-center space-x-1 shadow-xs transition-all cursor-pointer ml-auto sm:ml-0 font-sans"
            >
              <Plus className="w-4 h-4 text-teal-300" />
              <span>Inserir Atividade Manual</span>
            </button>
          </div>

          {/* Add custom Task form overlay styled as Dark Elegant Drawer */}
          <AnimatePresence>
            {showAddNew && (
              <motion.form 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleAddTask}
                className="bg-slate-900/60 p-5 border border-slate-800 rounded-xl space-y-4 shadow-md font-sans"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                  <div className="space-y-1.5 md:col-span-2 col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">O que você precisa listar?</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Fazer compra simples de frutas..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-teal-500 text-white font-sans"
                    />
                  </div>
                  
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">Categoria</label>
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-teal-500 font-sans"
                    >
                      <option value="DOMESTICO">Casa e Louça</option>
                      <option value="MATERNIDADE">Filhos e Bebê</option>
                      <option value="PROFISSIONAL">Projetos e Blog</option>
                      <option value="SAUDE_PESSOAL">Saúde e Mente</option>
                      <option value="OUTROS">Outros</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 font-sans">
                  <button
                    type="button"
                    onClick={() => setShowAddNew(false)}
                    className="text-xs px-3.5 py-1.5 text-slate-400 hover:text-slate-100 rounded-lg font-sans"
                  >
                    Mudei de ideia
                  </button>
                  <button
                    type="submit"
                    className="text-xs bg-teal-500 hover:bg-teal-450 text-slate-950 px-4 py-1.5 rounded-lg font-bold cursor-pointer font-sans"
                  >
                    Adicionar para Triagem
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Interactive Core Executable Task List Panel in Dark Mode */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl shadow-md overflow-hidden">
            {filteredTasks.length === 0 ? (
              <div className="p-16 text-center space-y-3.5 font-sans">
                <Smile className="w-10 h-10 text-teal-400/40 mx-auto" />
                <p className="text-[13px] font-semibold text-slate-300 font-sans">Não há tarefas aqui!</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                  Excelente decisão! Isso poupará seu cérebro de sobrecargas e trará alívio mental para o fim de semana.
                </p>
              </div>
            ) : (
              <div>
                {/* Active tasks list */}
                {filteredTasks.filter(t => !t.completed).length > 0 ? (
                  <div className="divide-y divide-slate-900/80">
                    {filteredTasks.filter(t => !t.completed).map((task) => renderTaskRow(task))}
                  </div>
                ) : (
                  <div className="p-12 text-center space-y-2.5 bg-slate-950/15 border-b border-slate-900 font-sans">
                    <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto opacity-75" />
                    <p className="text-xs font-semibold text-teal-300">Todas as tarefas ativadas estão concluídas! 🎉</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Você limpou seu campo visual com competência executiva. Descanse os olhos e aproveite este momento!
                    </p>
                  </div>
                )}

                {/* Collapsible Completed Tasks Archive ("Arquivo de Alívio") */}
                {filteredTasks.filter(t => t.completed).length > 0 && (
                  <div className="border-t border-slate-900 bg-slate-950/20 font-sans">
                    <button
                      type="button"
                      onClick={() => setShowCompletedArchive(!showCompletedArchive)}
                      className="w-full flex items-center justify-between p-4 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all font-sans cursor-pointer shadow-xs border-none outline-none bg-transparent"
                    >
                      <div className="flex items-center space-x-2 font-sans">
                        <Archive className="w-4 h-4 text-teal-400" />
                        <span>Arquivo de Alívio ({filteredTasks.filter(t => t.completed).length} {filteredTasks.filter(t => t.completed).length === 1 ? "tarefa concluída" : "tarefas concluídas"})</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500 text-[11px] font-mono font-sans">
                        <span>{showCompletedArchive ? "Recolher" : "Mostrar"}</span>
                        {showCompletedArchive ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </button>

                    {showCompletedArchive && (
                      <div className="divide-y divide-slate-900/60 border-t border-slate-900/85 bg-slate-950/45 font-sans">
                        {filteredTasks.filter(t => t.completed).map((task) => renderTaskRow(task))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Caixa de Entrada da MOM (Despejo Mental) - MOVED HERE, BELOW ACTIVE TASKS */}
        <section className="bg-slate-900/25 border border-slate-900/60 rounded-2xl p-5 shadow-inner space-y-4 font-sans mt-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Sparkles className="w-4.5 h-4.5 text-teal-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white font-sans">
                Caixa de Entrada da MOM (Despejo Mental)
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-0.5">
                Cole suas mensagens caóticas do WhatsApp ou anotações apressadas para a MOM fatiar em tarefas menores e atômicas de alívio rápido.
              </p>
            </div>
          </div>

          <div className="space-y-3 font-sans">
            <textarea
              rows={3}
              value={smartImportText}
              disabled={isImporting}
              onChange={(e) => setSmartImportText(e.target.value)}
              placeholder="MOM, assume isso aqui: (Cole suas mensagens caóticas ou anotações para eu transformar em tarefas estruturadas)."
              className="w-full text-xs p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 text-slate-200 placeholder:text-slate-500 focus:ring-1 focus:ring-teal-500/20 leading-relaxed font-sans resize-y"
            />

            <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2.5">
              {smartImportText.trim() && (
                <button
                  type="button"
                  onClick={() => setSmartImportText("")}
                  disabled={isImporting}
                  className="text-xs text-slate-500 hover:text-slate-350 px-2 py-1.5 transition-all outline-none cursor-pointer bg-transparent border-none"
                >
                  Limpar caixa
                </button>
              )}
              
              <button
                type="button"
                onClick={handleDirectImport}
                disabled={isImporting || !smartImportText.trim()}
                className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60 px-4 py-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              >
                <span>Adicionar Direto ⚡</span>
              </button>

              <button
                type="button"
                onClick={handleSmartImport}
                disabled={isImporting || !smartImportText.trim()}
                className="text-xs bg-gradient-to-r from-teal-500 to-emerald-600 hover:brightness-110 text-slate-950 px-4 py-2 rounded-lg font-extrabold flex items-center justify-center space-x-1.5 shadow-lg shadow-teal-950/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              >
                {isImporting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Classificando com a MOM ...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 text-slate-950" />
                    <span>Processar com Inteligência 🔮</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Dynamic Weather-Based Health Advice Section */}
        <section className="bg-slate-900/35 border border-slate-800/80 rounded-2xl p-6 space-y-6 font-sans mt-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-900/60">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-orange-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                <CloudSun className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <span>M.O.M Clima & Prevenção Real</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                </h4>
                <p className="text-[10px] text-slate-400">Conselhos automáticos e personalizados com base no clima real da sua cidade para Daniele, Pedro e Rebeca.</p>
              </div>
            </div>

            {/* Real-time search and GPS controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFetchRealtimeWeather();
                }}
                className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 w-full sm:w-auto"
              >
                <input
                  type="text"
                  value={weatherCity}
                  onChange={(e) => setWeatherCity(e.target.value)}
                  placeholder="Buscar Cidade (Ex: Campinas)"
                  className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full sm:w-48 font-sans"
                />
                <button
                  type="submit"
                  disabled={isFetchingWeather}
                  className="text-slate-400 hover:text-white transition-all ml-1"
                  title="Buscar Clima"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              <button
                type="button"
                onClick={handleFetchGPSWeather}
                disabled={isFetchingWeather}
                className="text-xs bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 font-bold disabled:opacity-50"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Usar GPS 📍</span>
              </button>

              <button
                type="button"
                onClick={() => handleFetchRealtimeWeather()}
                disabled={isFetchingWeather}
                className="p-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                title="Sincronizar Novamente"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingWeather ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Active location indicator banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-slate-950/30 p-3 rounded-xl border border-slate-850/60">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Localidade Ativa:</span>
              <span className="font-bold text-teal-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-400" />
                {resolvedCity}
              </span>
            </div>
            <div className="flex items-center gap-3.5 text-[11px] font-mono">
              <span className="text-orange-400 font-semibold">{temperature}°C</span>
              <span className="text-slate-500">•</span>
              <span className="text-sky-400 font-semibold">{humidity}% Umidade</span>
              <span className="text-slate-500">•</span>
              <span className="text-teal-400 font-semibold">{pressure} hPa</span>
            </div>
          </div>

          {/* Weather error message */}
          {weatherError && (
            <div className="p-3 bg-rose-500/5 border border-rose-500/20 text-rose-300 rounded-xl text-[11px] font-sans">
              ⚠️ {weatherError}
            </div>
          )}

          {/* Simulation Drawer (Collapsible sliders if they want to try weather extremes manually) */}
          <div className="bg-slate-950/20 p-4 rounded-xl border border-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Simulador de Extremos de Clima (Controle Manual)</span>
              <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Ajuste Temporário</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Temp Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                    <Thermometer className="w-3 h-3 text-orange-400" />
                    <span>Temperatura</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-orange-400">{temperature}°C</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="42"
                  step="1"
                  value={temperature}
                  onChange={(e) => {
                    setTemperature(Number(e.target.value));
                    setCustomWeatherAdvice(null);
                  }}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Humidity Control */}
              <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-900 sm:pl-4 pt-3 sm:pt-0">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                    <Droplets className="w-3 h-3 text-sky-400" />
                    <span>Umidade do Ar</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-sky-400">{humidity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={humidity}
                  onChange={(e) => {
                    setHumidity(Number(e.target.value));
                    setCustomWeatherAdvice(null);
                  }}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              {/* Pressure Control */}
              <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-900 sm:pl-4 pt-3 sm:pt-0">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                    <Gauge className="w-3 h-3 text-teal-400" />
                    <span>Pressão Atmosf.</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-teal-400">{pressure} hPa</span>
                </div>
                <input
                  type="range"
                  min="990"
                  max="1030"
                  step="1"
                  value={pressure}
                  onChange={(e) => {
                    setPressure(Number(e.target.value));
                    setCustomWeatherAdvice(null);
                  }}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>
            </div>
            <p className="text-[9px] text-slate-500 font-sans italic leading-none">
              Dica: Ajustar estes controles permite que você visualize na hora o impacto fisiológico que o clima gera na sua rotina e na enxaqueca (Topiramato).
            </p>
          </div>

          {/* Current Warning Alert */}
          {(() => {
            const currentAdvice = customWeatherAdvice || getLocalWeatherAdvice(temperature, humidity, pressure);
            if (!currentAdvice.generalWarning) return null;
            return (
              <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 text-amber-300 rounded-xl text-[11px] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase font-mono mr-1">Alerta Climático MOM:</span>
                  <span>{currentAdvice.generalWarning}</span>
                </div>
              </div>
            );
          })()}

          {/* Dynamic Advice Cards (3 Columns) */}
          {(() => {
            const currentAdvice = customWeatherAdvice || getLocalWeatherAdvice(temperature, humidity, pressure);

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mom Card */}
                <div className="bg-slate-950/20 border border-slate-850/60 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-rose-300">
                      <HeartHandshake className="w-4 h-4 text-rose-400" />
                      <h5 className="text-[11px] font-bold uppercase tracking-wider font-mono">Saúde da Mãe (Daniele)</h5>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                      {currentAdvice.momAdvice}
                    </p>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono pt-2 border-t border-slate-900/30 flex items-center justify-between">
                    <span>Foco: Topiramato e Lactação</span>
                    <span className="text-[8px] px-1 bg-rose-500/10 text-rose-400 rounded">Mãe</span>
                  </div>
                </div>

                {/* Baby Card */}
                <div className="bg-slate-950/20 border border-slate-850/60 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-cyan-300">
                      <Smile className="w-4 h-4 text-cyan-400" />
                      <h5 className="text-[11px] font-bold uppercase tracking-wider font-mono">Cuidado com o Bebê (Pedro)</h5>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                      {currentAdvice.babyAdvice}
                    </p>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono pt-2 border-t border-slate-900/30 flex items-center justify-between">
                    <span>Foco: Pedro (6 meses)</span>
                    <span className="text-[8px] px-1 bg-cyan-500/10 text-cyan-400 rounded">Bebê</span>
                  </div>
                </div>

                {/* Child Card */}
                <div className="bg-slate-950/20 border border-slate-850/60 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-purple-300">
                      <UserPlus className="w-4 h-4 text-purple-400" />
                      <h5 className="text-[11px] font-bold uppercase tracking-wider font-mono">Cuidado com a Criança (Rebeca)</h5>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                      {currentAdvice.childAdvice}
                    </p>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono pt-2 border-t border-slate-900/30 flex items-center justify-between">
                    <span>Foco: Rebeca (11 anos)</span>
                    <span className="text-[8px] px-1 bg-purple-500/10 text-purple-400 rounded">Criança</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Controls to fetch further AI advice and general disclaimer / printing */}
          <div className="pt-4 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => handleFetchRealtimeWeather()}
                disabled={isFetchingWeather}
                className="text-xs bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 text-slate-950 px-4 py-2.5 rounded-xl font-extrabold flex items-center space-x-1.5 shadow-md shadow-amber-950/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFetchingWeather ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Buscando Clima & Consolidando com IA...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 text-slate-950" />
                    <span>MOM, Sincronizar Clima e Conselhos Ativos 🔮</span>
                  </>
                )}
              </button>

              {customWeatherAdvice && (
                <button
                  type="button"
                  onClick={() => setCustomWeatherAdvice(null)}
                  className="text-xs text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 px-3 py-2 rounded-xl transition-all cursor-pointer border border-slate-800"
                >
                  Usar Conselhos Instantâneos
                </button>
              )}
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => window.print()}
                title="Exportar Relatório PDF"
                className="text-xs bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 hover:text-white border border-teal-500/20 px-4 py-2 rounded-xl font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-teal-400" />
                <span>Exportar Relatório Diário (PDF)</span>
              </button>
            </div>
          </div>

          <div className="text-[9px] text-slate-500 leading-relaxed border-t border-slate-900/60 pt-3">
            <em><strong>Aviso legal importante:</strong> Este painel destina-se exclusivamente para fins informativos e de suporte à organização pessoal da rotina. Não constitui aconselhamento médico de qualquer natureza, diagnóstico clínico ou indicação de tratamento. Procure sempre orientação de um médico especialista ou profissional de saúde qualificado antes de realizar qualquer alteração em seu tratamento ou rotina de saúde.</em>
          </div>
        </section>

      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-8 mt-12 print:hidden font-sans">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-3.5">
          <p className="text-xs text-slate-500 leading-relaxed">
            Co-piloto Executivo criado especialmente para Daniele com amor, clareza e estrutura.
          </p>
          <p className="text-[11px] text-slate-600 font-mono">
            Minha Outra Mente • Versão 1.0.1.1
          </p>
          <div className="flex justify-center space-x-4 text-[10px] font-mono text-slate-600">
            <span>Pedrinho & Rebeca safe spaces</span>
            <span>•</span>
            <span>Educar na Prática</span>
            <span>•</span>
            <span>Fiquei Grávida</span>
          </div>
        </div>
      </footer>

      {/* MOM Focus Alarm Trigger Overlay Modal */}
      <AnimatePresence>
        {activeTriggeredReminder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-amber-500/40 max-w-lg w-full rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden"
            >
              {/* Pulsing ambient glow effect */}
              <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 to-transparent pointer-events-none animate-pulse" />

              <div className="text-center space-y-3 relative z-10">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/10 animate-bounce">
                  <Bell className="w-7 h-7" />
                </div>
                
                <div>
                  <span className="text-[10px] font-bold font-mono text-amber-400 uppercase tracking-widest bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-900/30">
                    Alerta de Foco Tático • MOM
                  </span>
                  <h2 className="text-xl font-bold text-white mt-2">
                    Daniele, é hora de focar!
                  </h2>
                  <p className="text-xs text-slate-400">
                    Sua Outra Mente programou este bloco para garantir seu conforto e o das crianças.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl text-center space-y-2 relative z-10 shadow-inner">
                <p className="text-xs text-slate-400 font-mono">Tarefa Designada:</p>
                <p className="text-base font-bold text-teal-300">
                  "{activeTriggeredReminder.taskTitle}"
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  Planejado para às {activeTriggeredReminder.time}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    // Dispensar lembrete
                    setActiveTriggeredReminder(null);
                  }}
                  className="flex-1 py-3 text-xs font-bold font-sans text-slate-400 hover:text-slate-200 bg-slate-850 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all cursor-pointer"
                >
                  Adiar / Dispensar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    // Marcar como concluído diretamente
                    // Find the task corresponding to the reminder
                    const taskToComplete = tasks.find(t => t.title.toLowerCase().trim() === activeTriggeredReminder.taskTitle.toLowerCase().trim());
                    if (taskToComplete) {
                      setTasks(prev => prev.map(t => t.id === taskToComplete.id ? { ...t, completed: true } : t));
                    } else {
                      // Maybe it was a custom topThree string - check if there's matching step and toggle completion in micro steps
                      setCompletedMicroSteps(prev => ({ ...prev, [activeTriggeredReminder.taskTitle]: true }));
                    }
                    setActiveTriggeredReminder(null);
                    playChime();
                  }}
                  className="flex-1 py-3 text-xs font-bold font-sans text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-350 hover:to-emerald-350 rounded-xl shadow-lg hover:shadow-teal-500/10 transition-all cursor-pointer"
                >
                  Concluí Agora! ✨
                </button>
              </div>

              <div className="text-center relative z-10 pt-1">
                <button
                  type="button"
                  onClick={playChime}
                  className="text-[10px] font-semibold text-slate-500 hover:text-slate-400 bg-transparent border-none cursor-pointer hover:underline"
                >
                  Repetir Som de Alerta 🔊
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        PRINTABLE REPORT SECTION 
        This is completely hidden on screens, but fully styled for print output.
        Using clean, high-contrast black on white styles so it looks professional when printed or saved as PDF.
      */}
      <div className="hidden print:block bg-white text-slate-900 p-8 space-y-8 font-sans">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Daniele • Copiloto Executivo</h1>
            <p className="text-sm text-slate-500 font-mono">MOM Advisory & Survival Intelligence Report</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">{currentDateTime ? currentDateTime.split(" • ")[0] : "Hoje"}</p>
            <p className="text-xs text-slate-500 font-mono">Status: Planejamento Ativo</p>
          </div>
        </div>

        {/* Diagnostic Metadata & Status Overview */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Parâmetros de Saúde</h3>
            <ul className="text-xs space-y-1.5 text-slate-700">
              <li><strong>💊 Medicação:</strong> Transição para Topiramato (1ª semana)</li>
              <li><strong>⚡ Intensidade da Dor:</strong> {userContext.headacheLevel}</li>
              <li><strong>😴 Qualidade do Sono:</strong> {userContext.hasSleptWell ? "Dormiu Bem" : "Privada de Sono / Exaustão"}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 text-slate-500">Métricas de Alívio Realizadas</h3>
            <ul className="text-xs space-y-1.5 text-slate-700">
              <li><strong>📋 Conclusão Geral:</strong> {completedTodayCount} de {totalTodayCount} tarefas ({progressTodayPercentage}%)</li>
              <li><strong>⏳ Tempo Pendente Hoje:</strong> {totalMinutesToday} minutos</li>
              <li><strong>💡 Escopo do Dia:</strong> {userContext.headacheLevel === "FORTE" ? "Altamente Reduzido (Proteção Ocular)" : "Padrão Gerenciável"}</li>
            </ul>
          </div>
        </div>

        {/* Parecer do Copiloto */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Análise Clínica & Parecer do Seu Copiloto</h2>
          <p className="text-xs text-slate-700 italic leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
            "{copilotAdvice.advice}"
          </p>
        </div>

        {/* Micro-Pilotos Imediatos (Top 3) */}
        {copilotAdvice.topThree && copilotAdvice.topThree.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Micro-Pilotos Imediatos (Próximas 2h)</h2>
            <ol className="text-xs text-slate-800 space-y-2">
              {copilotAdvice.topThree.map((step, idx) => (
                <li key={idx} className="flex space-x-2 items-start bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-900 flex-shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Prescrições de Sobrevivência do Dia */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Prescrições de Sobrevivência do Dia</h2>
          <div className="grid grid-cols-2 gap-4">
            {getSurvivalSuggestions(userContext.headacheLevel, userContext.hasSleptWell).map((sug) => {
              const isChecked = completedSuggestions[sug.id];
              return (
                <div key={sug.id} className="p-3 bg-slate-50/50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono bg-slate-200 px-1.5 py-0.5 rounded">
                    {sug.tag}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1">
                    <span>{isChecked ? "✅" : "⬜"}</span>
                    <span>{sug.title}</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{sug.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tarefas de Hoje */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Roteiro de Tarefas Selecionadas para Hoje</h2>
          {todayTasks.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Nenhuma tarefa pendente para hoje. Alinhamento de total alívio mental!</p>
          ) : (
            <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200 text-xs">
              {todayTasks.map((task) => (
                <div key={task.id} className="p-3 space-y-1.5 bg-white">
                  <div className="flex items-start justify-between">
                    <span className="font-medium text-slate-900 flex items-center space-x-1.5">
                      <span>{task.completed ? "✅" : "⬜"}</span>
                      <span className={task.completed ? "line-through text-slate-400" : ""}>
                        {task.title}
                      </span>
                    </span>
                    <div className="flex space-x-2 text-[10px] font-mono text-slate-500 flex-shrink-0">
                      <span>{task.estimatedTimeMinutes} min</span>
                      <span>•</span>
                      <span>{task.category}</span>
                    </div>
                  </div>
                  {task.executiveReasoning && (
                    <div className="text-[10px] text-slate-500 leading-relaxed pl-5 italic">
                      <strong>Orientação do Copiloto:</strong> {task.executiveReasoning}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info blocks */}
        <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>Relatório gerado em {currentDateTime || "19/06/2026"}</span>
          <span>MOM Advisory & Copilot System | Curitiba</span>
        </div>
      </div>

    </div>
  );
}
