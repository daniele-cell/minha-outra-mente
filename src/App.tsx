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
  Activity
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Task, UserContext, CopilotResponse } from "./types";
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
    advice: "Daniele, respire fundo. Hoje é sexta-feira, você está com enxaqueca (provável efeito da transição do Topiramato + exaustão) e o Pedro não dormiu. Seu foco hoje é puramente de Sobrevivência e Conforto. Vamos reduzir sua lista de 28 para apenas os itens urgentes e rápidos em blocos.",
    topThree: [
      "Fazer o papá do Pedrinho e comidinhas rápidas (arroz, feijão cozido simples com vegetais no mesmo vapor).",
      "Comprar xampu/álcool/condicionador por delivery (iFood/Rappi) ou pedir para o Rapha trazer (não saia!).",
      "Mandar alinhamento final curto de 1 minuto para o Rapha no WhatsApp."
    ]
  });
  const [activeTab, setActiveTab] = useState<"HOJE" | "SEMANA_QUE_VEM" | "DELEGAR_OU_APOIAR" | "TODOS">("HOJE");
  const [viewingReasoning, setViewingReasoning] = useState<number | null>(null);
  const [showAddNew, setShowAddNew] = useState(false);

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
          <div className="flex gap-1">
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
                              
                              <div className="flex-1">
                                <span className={`font-medium text-[11px] leading-relaxed font-sans ${isCheck ? "text-slate-500 line-through" : "text-slate-200"}`}>
                                  {step}
                                </span>
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

        {/* Informational block for Daniele to understand medication & recovery factors */}
        <section className="bg-amber-500/5 rounded-xl p-5 border border-amber-500/10 space-y-4 font-sans mt-6">
          <div className="flex items-center space-x-2 text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Conselhos gerais da MOM com base nas suas medicações</h4>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            Daniele, o **Topiramato** é conhecido por provocar fadiga mental, formigamentos discretos ou sensação de lentidão intelectual em suas primeiras semanas de introdução (especialmente se combinado com sonolência extrema decorrente da rotina do Pedrinho acordando na madrugada). Beber bastante água fria e adiar a leitura pesada dos seus novos livros ou tarefas de digitação visual intensa não é falta de produtividade; é **estratégia de sobrevivência biológica**. Cuide-se e poupe os seus olhos!
          </p>
          <div className="text-[10px] text-slate-500 leading-relaxed font-sans border-t border-slate-900/60 pt-3">
            <em><strong>Aviso legal:</strong> Este painel destina-se exclusivamente para fins informativos e de suporte à organização pessoal da rotina. Não constitui aconselhamento médico de qualquer natureza, diagnóstico clínico ou indicação de tratamento. Procure sempre orientação de um médico especialista ou profissional de saúde qualificado antes de realizar qualquer alteração em seu tratamento ou rotina de saúde.</em>
          </div>
          <div className="pt-2 border-t border-slate-900/40 flex flex-wrap gap-2 items-center">
            <button
              onClick={() => window.print()}
              title="Exportar Relatório PDF"
              className="text-xs bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 hover:text-white border border-teal-500/20 px-4 py-2 rounded-xl font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer font-sans"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              <span>Exportar Relatório Diário (PDF)</span>
            </button>
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
