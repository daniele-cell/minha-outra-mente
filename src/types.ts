export interface Task {
  id: number;
  originalIndex: number;
  title: string;
  category: "DOMESTICO" | "MATERNIDADE" | "PROFISSIONAL" | "SAUDE_PESSOAL" | "OUTROS";
  scheduleDecision: "HOJE" | "SEMANA_QUE_VEM" | "DELEGAR_OU_APOIAR";
  estimatedTimeMinutes: number;
  executiveReasoning: string;
  completed: boolean;
}

export interface UserContext {
  headacheLevel: "NENHUMA" | "LEVE" | "FORTE";
  hasSleptWell: boolean;
  isLactating: boolean;
  switchedToTopiramate: boolean;
  notes: string;
}

export interface CopilotResponse {
  advice: string;
  topThree: string[];
  categorizedTasks?: {
    id: number;
    title: string;
    scheduleDecision: "HOJE" | "SEMANA_QUE_VEM" | "DELEGAR_OU_APOIAR";
    estimatedTimeMinutes: number;
    executiveReasoning: string;
  }[];
}
