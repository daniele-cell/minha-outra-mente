import { Task } from "./types";

export const initialTasks: Task[] = [
  {
    id: 1,
    originalIndex: 1,
    title: "Comprar 3 cadernos (inglês, matemática e português) para a Rebeca",
    category: "MATERNIDADE",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 40,
    executiveReasoning: "Os cadernos atuais estão perto do fim mas ainda duram alguns dias. Compre online ou planeje uma saída tranquila na segunda-feira.",
    completed: false
  },
  {
    id: 2,
    originalIndex: 2,
    title: "Lavar roupas (cargas pendentes: Toalhas, Coberta, Robes, Tapetes do banheiro, Roupas escuras, Panos de chão)",
    category: "DOMESTICO",
    scheduleDecision: "HOJE",
    estimatedTimeMinutes: 150,
    executiveReasoning: "Lave apenas 1 carga super prioritária (ex: Toalhas) de forma passiva hoje. Deixe panos de chão e cobertas para a próxima semana para não encher o fds de roupas para dobrar.",
    completed: false
  },
  {
    id: 3,
    originalIndex: 3,
    title: "Comprar carne de panela e frango + cozinhar batata, cenoura e abobrinha para fazer a papa do Pedrinho",
    category: "MATERNIDADE",
    scheduleDecision: "HOJE",
    estimatedTimeMinutes: 60,
    executiveReasoning: "Prioridade humana e alimentar para o fim de semana do bebê. Faça uma quantidade maior para congelar e aliviar os próximos dias.",
    completed: false
  },
  {
    id: 4,
    originalIndex: 4,
    title: "Cozinhar batata doce",
    category: "DOMESTICO",
    scheduleDecision: "HOJE",
    estimatedTimeMinutes: 25,
    executiveReasoning: "Cozinhe junto com o frango ou logo após o papá do Pedrinho para aproveitar o vapor e o tempo de fogão.",
    completed: false
  },
  {
    id: 5,
    originalIndex: 5,
    title: "Fazer arroz",
    category: "DOMESTICO",
    scheduleDecision: "HOJE",
    estimatedTimeMinutes: 20,
    executiveReasoning: "Tarefa rápida de fogão, essencial para garantir a base alimentar simples da casa para o fds.",
    completed: false
  },
  {
    id: 6,
    originalIndex: 6,
    title: "Refogar o feijão",
    category: "DOMESTICO",
    scheduleDecision: "HOJE",
    estimatedTimeMinutes: 15,
    executiveReasoning: "Use temperos simples. Se o feijão já estiver cozido, é uma atividade de baixíssimo esforço de 15 minutos.",
    completed: false
  },
  {
    id: 7,
    originalIndex: 7,
    title: "Jogar o lixo fora",
    category: "DOMESTICO",
    scheduleDecision: "HOJE",
    estimatedTimeMinutes: 5,
    executiveReasoning: "Microatividade física rápida. Ajuda a 'limpar a mente' e renova a energia e a higiene do ambiente.",
    completed: false
  },
  {
    id: 8,
    originalIndex: 8,
    title: "Falar de novo com o encanador",
    category: "DOMESTICO",
    scheduleDecision: "HOJE",
    estimatedTimeMinutes: 10,
    executiveReasoning: "Urgência estrutural da casa. Dê um telefonema rápido pela manhã para deixar pré-agendado, tirando isso da sua memória de trabalho.",
    completed: false
  },
  {
    id: 9,
    originalIndex: 9,
    title: "Lavar a louça acumulada",
    category: "DOMESTICO",
    scheduleDecision: "HOJE",
    estimatedTimeMinutes: 20,
    executiveReasoning: "Ver a pia limpa acalma o sistema nervoso. Faça de forma ritmada, ouvindo uma música tranquila.",
    completed: false
  },
  {
    id: 10,
    originalIndex: 10,
    title: "Continuar a leitura dos livros (Comunicação Eficaz, Comunicação Não Violenta, 7 Níveis de PDF)",
    category: "SAUDE_PESSOAL",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 90,
    executiveReasoning: "Ler livros de alto desenvolvimento com dor de cabeça e privação de sono pesada é contraproducente. Adie sem culpa.",
    completed: false
  },
  {
    id: 11,
    originalIndex: 11,
    title: "Ler o livro '12 Regras para a Vida' (Jordan Peterson)",
    category: "SAUDE_PESSOAL",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 60,
    executiveReasoning: "Conteúdo denso que exige alta capacidade de foco. Deixe para focar na próxima semana, com a mente mais leve.",
    completed: false
  },
  {
    id: 12,
    originalIndex: 12,
    title: "Finalizar a edição do vídeo sobre Sugestologia no Capcut",
    category: "PROFISSIONAL",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 120,
    executiveReasoning: "Edições minuciosas e barulho de áudio no fone pioram vertiginosamente a enxaqueca (ainda mais na transição para o Topiramato). Pare de editar hoje.",
    completed: false
  },
  {
    id: 13,
    originalIndex: 13,
    title: "Subir os vídeos de introdução do canal prontos no YouTube",
    category: "PROFISSIONAL",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 30,
    executiveReasoning: "Mesmo prontos, o upload e otimização de telas exigem concentração. Guarde para segunda-feira em bloco profissional.",
    completed: false
  },
  {
    id: 14,
    originalIndex: 14,
    title: "Encontrar os vídeos digitais do processo de Lozanov",
    category: "PROFISSIONAL",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 20,
    executiveReasoning: "Busca de arquivos digitais consome córtex visual. Poupe seus olhos e sua dor de cabeça hoje.",
    completed: false
  },
  {
    id: 15,
    originalIndex: 15,
    title: "Terminar planejamento inbound do canal Educar na Prática e blog Fiquei Grávida (com NotebookLM)",
    category: "PROFISSIONAL",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 180,
    executiveReasoning: "Trabalho estratégico pesado. Daniele, você está amamentando e cansada; seu cérebro precisa de repouso estruturado para formular ideias brilhantes.",
    completed: false
  },
  {
    id: 16,
    originalIndex: 16,
    title: "Finalizar eBook 'Decifrando seu Filho' e diagramar",
    category: "PROFISSIONAL",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 240,
    executiveReasoning: "Horas de digitação e diagramação visual pesada. Adie totalmente para a próxima semana.",
    completed: false
  },
  {
    id: 17,
    originalIndex: 17,
    title: "Subir eBook 'Decifrando seu Filho' na Amazon e precificar",
    category: "PROFISSIONAL",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 40,
    executiveReasoning: "Depende da finalização e diagramação do livro. Só será feito após o item anterior ser concluído.",
    completed: false
  },
  {
    id: 18,
    originalIndex: 18,
    title: "Subir blogpost e TikTok sobre TDAH com isca digital",
    category: "PROFISSIONAL",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 60,
    executiveReasoning: "Trabalho que pode aguardar sem prejudicar a marca. Foque em passar o fim de semana em paz com seus filhos.",
    completed: false
  },
  {
    id: 19,
    originalIndex: 19,
    title: "Dobrar roupas que estão na sala",
    category: "DOMESTICO",
    scheduleDecision: "HOJE",
    estimatedTimeMinutes: 30,
    executiveReasoning: "Ajuda a clarear o visual da sala de estar para o fim de semana. Faça devagar, em etapas, talvez conversando com a Rebeca.",
    completed: false
  },
  {
    id: 20,
    originalIndex: 20,
    title: "Comprar álcool, xampu e condicionador",
    category: "DOMESTICO",
    scheduleDecision: "HOJE",
    estimatedTimeMinutes: 30,
    executiveReasoning: "Compre via aplicativo de entrega rápida (Rappi/IFood) ou peça para o Rapha trazer no caminho para evitar que você gaste energia física saindo de casa.",
    completed: false
  },
  {
    id: 21,
    originalIndex: 21,
    title: "Apagar quadro escolar da Rebeca",
    category: "DOMESTICO",
    scheduleDecision: "HOJE",
    estimatedTimeMinutes: 5,
    executiveReasoning: "Extremamente físico, rápido e satisfatório. 5 minutos para eliminar uma pendência visual antiga.",
    completed: false
  },
  {
    id: 22,
    originalIndex: 22,
    title: "Tirar adesivo da parede da sala",
    category: "DOMESTICO",
    scheduleDecision: "HOJE",
    estimatedTimeMinutes: 15,
    executiveReasoning: "Atividade manual leve. Faça ouvindo o Pedrinho respirar ou brincando com a Rebeca. Reduz a poluição visual.",
    completed: false
  },
  {
    id: 23,
    originalIndex: 23,
    title: "Agenda de Saúde: Vacinar Pedro (até 26/06), Fazer exames jejum, Agendar panorâmica dente, Agendar neuropsicólogo Rebeca, Agendar fisioterapia Dani, Agendar nutrólogo (bioimpedância)",
    category: "SAUDE_PESSOAL",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 120,
    executiveReasoning: "Agende tudo online em bloco na segunda de manhã (leva 15 min de ligações/mensagens). A vacina do Pedro tem prazo até sexta 26; agende para terça/quarta que vem para ficar confortável.",
    completed: false
  },
  {
    id: 24,
    originalIndex: 24,
    title: "Ir ao brechó trocar as roupas do Pedrinho",
    category: "OUTROS",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 60,
    executiveReasoning: "Exige deslocamento e escolha cuidadosa de peças. Deixe para quando sua dor de cabeça passar e você estiver descansada.",
    completed: false
  },
  {
    id: 25,
    originalIndex: 25,
    title: "Levar roupas de doação para amiga da Bia e pegar mamadeira do Pedro",
    category: "OUTROS",
    scheduleDecision: "DELEGAR_OU_APOIAR",
    estimatedTimeMinutes: 40,
    executiveReasoning: "Peça para o Rapha levar no porta-malas do carro ou mande de Uber Entrega se for urgente. Peça para pegar a mamadeira do Pedro para tirar essa viagem das suas costas.",
    completed: false
  },
  {
    id: 26,
    originalIndex: 26,
    title: "Projeto Faísca: Finalizar teste de perfil comportamental infantil DISC Kids",
    category: "PROFISSIONAL",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 120,
    executiveReasoning: "Exige alta reflexão metodológica infantil. Adie sem culpa para a próxima semana de produção estruturada.",
    completed: false
  },
  {
    id: 27,
    originalIndex: 27,
    title: "Publicar testes de raciocínio logicamente elaborados pelo Claude",
    category: "PROFISSIONAL",
    scheduleDecision: "SEMANA_QUE_VEM",
    estimatedTimeMinutes: 40,
    executiveReasoning: "Adorei os testes, mas revisar e postar exige foco e trabalho de digitação. Próxima semana você lida com isso num bloco ágil.",
    completed: false
  },
  {
    id: 28,
    originalIndex: 28,
    title: "Repassar para o Rapha as versões finais para go-live",
    category: "PROFISSIONAL",
    scheduleDecision: "HOJE",
    estimatedTimeMinutes: 15,
    executiveReasoning: "Mande uma mensagem clara de 2 minutos alinhando o que está pronto e o que ficou para segunda. Alinhamento de casal evita estresse de canal de comunicação.",
    completed: false
  }
];

export const initialUserContext = {
  headacheLevel: "FORTE" as const,
  hasSleptWell: false,
  isLactating: true,
  switchedToTopiramate: true,
  notes: "Rotina exaustiva com bebê de 6 meses (Pedro, não dormiu bem esta semana) e Rebeca de 11 anos. Dieta ativa (Tomando Femibion 3, transição de Sertralina para Topiramato há 1 semana)."
};
