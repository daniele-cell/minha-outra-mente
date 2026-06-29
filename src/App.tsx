import { useState, useEffect, useRef } from "react";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:       "#0d0d0d",
  s1:       "#141414",
  s2:       "#1c1c1c",
  border:   "#272727",
  teal:     "#2dd4bf",
  tealDim:  "#0f3330",
  rose:     "#fb7185",
  roseDim:  "#2d0a12",
  amber:    "#fbbf24",
  amberDim: "#2d1a00",
  purple:   "#a78bfa",
  text:     "#f2f2f2",
  sub:      "#a3a3a3",
  muted:    "#525252",
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface LocalTask {
  id: number;
  text: string;
  time: string;
  cat: string;
  done: boolean;
  urgent: boolean;
  later: boolean;
}

// ─── Atoms ─────────────────────────────────────────────────────────────────────
interface ChipProps {
  label: string;
  color: string;
}

const Chip = ({ label, color }: ChipProps) => (
  <span style={{
    display:"inline-block", fontSize:9, fontWeight:700,
    letterSpacing:"0.12em", textTransform:"uppercase",
    padding:"2px 7px", borderRadius:3,
    background: color+"1a", color,
  }}>{label}</span>
);

interface DividerProps {
  label: string;
}

const Divider = ({ label }: DividerProps) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, margin:"24px 0 14px" }}>
    <div style={{ flex:1, height:1, background:T.border }} />
    <span style={{
      fontSize:10, color:T.muted, fontWeight:600,
      letterSpacing:"0.12em", textTransform:"uppercase", whiteSpace:"nowrap",
    }}>{label}</span>
    <div style={{ flex:1, height:1, background:T.border }} />
  </div>
);

interface PulseProps {
  color: string;
}

const Pulse = ({ color }: PulseProps) => (
  <span style={{
    display:"inline-block", width:7, height:7, borderRadius:"50%",
    background: color, marginRight:6,
    boxShadow:`0 0 0 2px ${color}33`,
  }}/>
);

// ─── Task row ──────────────────────────────────────────────────────────────────
const catColor = {
  "Sua saúde":    "#2dd4bf",
  "Filhos e Bebê":"#fb7185",
  "Casa":         "#fbbf24",
  "Projetos":     "#a78bfa",
};

interface TaskRowProps {
  key?: any;
  task: LocalTask;
  onToggle: (id: number) => void;
}

function TaskRow({ task, onToggle }: TaskRowProps) {
  const c = catColor[task.cat as keyof typeof catColor] || T.sub;
  return (
    <div
      onClick={() => onToggle(task.id)}
      style={{
        display:"flex", alignItems:"flex-start", gap:12,
        padding:"12px 0", cursor:"pointer",
        borderBottom:`1px solid ${T.border}`,
        opacity: task.done ? 0.4 : 1,
        transition:"opacity .2s",
      }}
    >
      <div style={{
        flexShrink:0, marginTop:2,
        width:20, height:20, borderRadius:"50%",
        border:`1.5px solid ${task.done ? T.teal : T.border}`,
        background: task.done ? T.teal : "transparent",
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all .2s",
      }}>
        {task.done && (
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polyline points="1.5,5 4,7.5 8.5,2" fill="none" stroke={T.bg} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <div style={{ flex:1 }}>
        <p style={{
          fontSize:14, color: task.done ? T.muted : T.text,
          textDecoration: task.done ? "line-through" : "none",
          lineHeight:1.4, marginBottom:5,
        }}>{task.text}</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <Chip label={task.cat} color={c} />
          <Chip label={"⏱ " + task.time} color={T.muted} />
          {task.urgent && <Chip label="urgente" color={T.rose} />}
        </div>
      </div>
    </div>
  );
}

// ─── Tarefas iniciais ─────────────────────────────────────────────────────────
const INITIAL_TASKS: LocalTask[] = [
  { id:1,  text:"Vacinar Pedrinho — prazo 26/06",        time:"1h",     cat:"Filhos e Bebê", done:false, urgent:true,  later:false },
  { id:2,  text:"Jogar lixo fora",                       time:"5 min",  cat:"Casa",          done:false, urgent:true,  later:false },
  { id:3,  text:"Lavar louça",                           time:"20 min", cat:"Casa",          done:false, urgent:true,  later:false },
  { id:4,  text:"Fazer papa do Pedro",                   time:"45 min", cat:"Filhos e Bebê", done:false, urgent:true,  later:false },
  { id:5,  text:"Fazer arroz",                           time:"30 min", cat:"Casa",          done:false, urgent:false, later:false },
  { id:6,  text:"Refogar feijão",                        time:"20 min", cat:"Casa",          done:false, urgent:false, later:false },
  { id:7,  text:"Cozinhar batata doce",                  time:"25 min", cat:"Casa",          done:false, urgent:false, later:false },
  { id:8,  text:"Agendar fisioterapia pélvica",          time:"5 min",  cat:"Sua saúde",     done:false, urgent:false, later:false },
  { id:9,  text:"Agendar exames de sangue",              time:"5 min",  cat:"Sua saúde",     done:false, urgent:false, later:false },
  { id:10, text:"Finalizar ebook Decifrando Seu Filho",  time:"2–3h",   cat:"Projetos",      done:false, urgent:false, later:true  },
  { id:11, text:"Passar versões finais pro Rapha",       time:"30 min", cat:"Projetos",      done:false, urgent:false, later:true  },
  { id:12, text:"Planejamento inbound canal e blog",     time:"2h",     cat:"Projetos",      done:false, urgent:false, later:true  },
  { id:13, text:"Subir vídeos de introdução no YouTube", time:"45 min", cat:"Projetos",      done:false, urgent:false, later:true  },
  { id:14, text:"Ir ao brechó trocar roupas do Pedrinho",time:"40 min", cat:"Filhos e Bebê", done:false, urgent:false, later:true  },
];

// ─── App principal ─────────────────────────────────────────────────────────────
export default function MOM() {
  const [sleep, setSleep]         = useState<string | null>(null);
  const [pain, setPain]           = useState<string | null>(null);
  const [filtered, setFiltered]   = useState(false);
  const [advice, setAdvice]       = useState("");
  const [loading, setLoading]     = useState(false);
  
  const [tasks, setTasks]         = useState<LocalTask[]>(() => {
    const saved = localStorage.getItem("daniele_copilot_tasks_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_TASKS;
      }
    }
    return INITIAL_TASKS;
  });

  const [inbox, setInbox]         = useState("");
  const [inboxRes, setInboxRes]   = useState<any[]>([]);
  const [inboxLoad, setInboxLoad] = useState(false);
  const [showLater, setShowLater] = useState(false);
  const adviceRef                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("daniele_copilot_tasks_v2", JSON.stringify(tasks));
  }, [tasks]);

  // ── voz ────────────────────────────────────────────────────────────────────
  const [isListening, setIsListening]     = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const interimRef     = useRef("");

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    setVoiceSupported(true);
    const rec = new SR();
    rec.lang = "pt-BR";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let final = "";
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      if (final) {
        interimRef.current = "";
        setInbox(p => (p + " " + final).trimStart());
      } else {
        interimRef.current = interim;
        setInbox(p => p); // força re-render para mostrar interim
      }
    };
    rec.onerror = () => setIsListening(false);
    rec.onend   = () => setIsListening(false);
    recognitionRef.current = rec;
    return () => { try { rec.stop(); } catch {} };
  }, []);

  function toggleVoice() {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (isListening) {
      rec.stop();
      setIsListening(false);
      interimRef.current = "";
    } else {
      try { rec.start(); setIsListening(true); } catch {}
    }
  }

  // ── dados derivados ─────────────────────────────────────────────────────────
  const today     = tasks.filter(t => !t.later);
  const urgent    = today.filter(t => t.urgent);
  const normal    = today.filter(t => !t.urgent);
  const later     = tasks.filter(t => t.later);
  const doneToday = today.filter(t => t.done).length;
  const pct       = today.length ? Math.round(doneToday / today.length * 100) : 0;
  const totalMin  = today.filter(t => !t.done).reduce((a, t) => {
    const n = parseInt(t.time); return a + (isNaN(n) ? 20 : n);
  }, 0);

  function toggleTask(id: number) {
    setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  // ── chamada IA com streaming para o /api/generate ──────────────────────────
  async function callAI(prompt: string, onChunk: (text: string) => void) {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, stream: true }),
    });
    if (!res.body) return;
    const reader = res.body.getReader();
    const dec    = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const textChunk = dec.decode(value, { stream: !done });
      for (const line of textChunk.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const s = line.slice(6).trim();
        if (s === "[DONE]") break;
        try {
          const d = JSON.parse(s);
          if (d.delta?.text) onChunk(d.delta.text);
        } catch {}
      }
    }
  }

  const SYSTEM = `Você é a MOM — Minha Outra Mente. Copiloto pessoal de Dani:
mãe de Pedro (6 meses, amamentando) e Rebeca (11 anos). Pós-parto.
Trocou sertralina por topiramato há 1 semana. Tem enxaqueca como efeito colateral.
Voz: direta, acolhedora, executiva. Frases curtas.
Nunca romantize o cansaço. Nunca use "e" comercial. Português brasileiro.`;

  async function filterPriorities() {
    if (!sleep || !pain) return;
    setLoading(true); setFiltered(true); setAdvice("");
    setTimeout(() => adviceRef.current?.scrollIntoView({ behavior:"smooth" }), 200);
    const prompt = `${SYSTEM}\n\nEstado agora: sono ${sleep === "bem" ? "bom" : "ruim"}, dor de cabeça ${pain}. Tarefas urgentes de hoje: ${urgent.map(t => t.text).join(", ")}. Outras tarefas: ${normal.map(t => t.text).join(", ")}. Dê seu conselho executivo em no máximo 3 frases curtas: o que priorizar e o que ignorar agora.`;
    await callAI(prompt, chunk => setAdvice(p => p + chunk));
    setLoading(false);
  }

  async function processInbox() {
    if (!inbox.trim()) return;
    setInboxLoad(true); setInboxRes([]);
    const prompt = `${SYSTEM}\n\nConverta este texto em tarefas atômicas. Retorne SOMENTE um array JSON com objetos {text,time,cat,urgent} onde cat é uma de: "Casa","Filhos e Bebê","Sua saúde","Projetos" e urgent é boolean. Máximo 6 itens. Texto: "${inbox}"`;
    let raw = "";
    await callAI(prompt, chunk => { raw += chunk; });
    try {
      const m = raw.match(/\[[\s\S]*\]/);
      if (m) setInboxRes(JSON.parse(m[0]));
    } catch {}
    setInboxLoad(false);
  }

  function addInboxTasks() {
    const news = inboxRes.map((t, i) => ({
      id: Date.now() + i, text: t.text, time: t.time || "?",
      cat: t.cat || "Casa", done: false, urgent: !!t.urgent, later: false,
    }));
    setTasks(p => [...p, ...news]);
    setInboxRes([]); setInbox("");
  }

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div id="app-main-container" style={{
      background: T.bg, minHeight:"100vh", color: T.text,
      fontFamily:"'Inter','DM Sans',system-ui,sans-serif",
      maxWidth:430, margin:"0 auto", paddingBottom:40,
    }}>

      {/* HEADER */}
      <div id="app-header" style={{
        padding:"18px 20px 14px", borderBottom:`1px solid ${T.border}`,
        position:"sticky", top:0, background:T.bg, zIndex:20,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:34, height:34, borderRadius:9,
              background:`linear-gradient(135deg,${T.teal},#0ea5e9)`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
            }}>✦</div>
            <div>
              <p style={{ fontWeight:800, fontSize:16, letterSpacing:"-0.02em", lineHeight:1 }}>M.O.M.</p>
              <p style={{ fontSize:10, color:T.sub, marginTop:1 }}>Minha Outra Mente</p>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:11, color:T.sub }}>
              {new Date().toLocaleDateString("pt-BR", { weekday:"short", day:"numeric", month:"short" })}
            </p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:4, marginTop:2 }}>
              <Pulse color={T.teal}/>
              <span style={{ fontSize:10, color:T.teal, fontWeight:600 }}>online</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontSize:11, color:T.sub }}>{doneToday} de {today.length} tarefas de hoje</span>
            <span style={{ fontSize:11, color:T.teal, fontWeight:700 }}>{pct}%</span>
          </div>
          <div style={{ height:3, background:T.s2, borderRadius:4 }}>
            <div style={{
              height:"100%", width:`${pct}%`,
              background:`linear-gradient(90deg,${T.teal},#0ea5e9)`,
              borderRadius:4, transition:"width .4s ease",
            }}/>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div id="app-body" style={{ padding:"0 20px" }}>

        {/* 1 — CONTROLE DE DANOS */}
        <div id="greeting-section" style={{ paddingTop:22 }}>
          <p style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.03em", lineHeight:1.2 }}>
            Olá, Dani.<br/>
            <span style={{ color:T.teal }}>Como você está agora?</span>
          </p>
          <p style={{ fontSize:13, color:T.sub, marginTop:6 }}>
            Seu painel. Sua mente extra. Só o que importa agora.
          </p>
        </div>

        <div id="card-damage-control" style={{ marginTop:18, padding:16, background:T.s1, border:`1px solid ${T.border}`, borderRadius:14 }}>
          <p style={{ fontSize:11, color:T.teal, fontWeight:700, letterSpacing:"0.1em", marginBottom:14 }}>
            <Pulse color={T.teal}/>CONTROLE DE DANOS
          </p>

          <p style={{ fontSize:12, color:T.sub, marginBottom:8 }}>Como foi seu sono?</p>
          <div id="sleep-buttons-container" style={{ display:"flex", gap:8, marginBottom:16 }}>
            {[["bem","Dormi bem"],["mal","Sem dormir"]].map(([v,l]) => (
              <button id={`btn-sleep-${v}`} key={v} onClick={() => setSleep(v)} style={{
                flex:1, padding:"9px 0", borderRadius:8, border:"1px solid",
                fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .15s",
                background: sleep===v ? (v==="mal" ? T.rose : T.teal) : "transparent",
                borderColor: sleep===v ? (v==="mal" ? T.rose : T.teal) : T.border,
                color: sleep===v ? T.bg : T.sub,
              }}>{l}</button>
            ))}
          </div>

          <p style={{ fontSize:12, color:T.sub, marginBottom:8 }}>Está com dor de cabeça?</p>
          <div id="pain-buttons-container" style={{ display:"flex", gap:8, marginBottom:18 }}>
            {[["nenhuma","Nenhuma"],["leve","Leve"],["forte","Forte"]].map(([v,l]) => (
              <button id={`btn-pain-${v}`} key={v} onClick={() => setPain(v)} style={{
                flex:1, padding:"9px 0", borderRadius:8, border:"1px solid",
                fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .15s",
                background: pain===v ? (v==="forte" ? T.rose : v==="leve" ? T.amber : T.teal) : "transparent",
                borderColor: pain===v ? (v==="forte" ? T.rose : v==="leve" ? T.amber : T.teal) : T.border,
                color: pain===v ? T.bg : T.sub,
              }}>{l}</button>
            ))}
          </div>

          <button
            id="btn-mom-filter"
            onClick={filterPriorities}
            disabled={!sleep || !pain || loading}
            style={{
              width:"100%", padding:14, borderRadius:10, border:"none",
              background: (sleep && pain && !loading) ? T.teal : T.s2,
              color: (sleep && pain && !loading) ? T.bg : T.muted,
              fontWeight:700, fontSize:14,
              cursor: (sleep && pain) ? "pointer" : "default",
              transition:"all .2s",
            }}>
            {loading ? "A MOM está pensando…" : "MOM, filtre minhas prioridades ⚡"}
          </button>
        </div>

        {/* 2 — VOZ DA MOM */}
        {(advice || loading) && (
          <div ref={adviceRef} id="card-mom-advice" style={{
            marginTop:12, padding:16,
            background:T.tealDim, border:`1px solid ${T.teal}33`, borderRadius:14,
          }}>
            <p style={{ fontSize:11, color:T.teal, fontWeight:700, letterSpacing:"0.1em", marginBottom:10 }}>
              <Pulse color={T.teal}/>VOZ DA MOM
            </p>
            <p style={{ fontSize:14, color:T.text, lineHeight:1.7, fontStyle:"italic" }}>
              {advice || <span style={{ color:T.sub }}>Analisando seu estado…</span>}
            </p>
          </div>
        )}

        {/* 3 — URGÊNCIAS */}
        <Divider label="Urgente — faça agora" />
        <div id="card-urgencies" style={{
          background:T.s1, border:`1px solid ${T.rose}33`,
          borderRadius:14, padding:"4px 16px",
          boxShadow:`0 0 24px ${T.rose}0a`,
        }}>
          {urgent.map(t => <TaskRow key={t.id} task={t} onToggle={toggleTask}/>)}
          {urgent.every(t => t.done) && (
            <p style={{ textAlign:"center", color:T.teal, fontSize:13, padding:"14px 0" }}>
              Bloco urgente concluído. 🌿
            </p>
          )}
        </div>

        {/* 4 — PRESCRIÇÕES */}
        <Divider label="Agora, para você" />
        <div id="card-prescriptions" style={{ background:T.s1, border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden" }}>
          {[
            { icon:"🛌", title:"Soneca agora — com o Pedro",  tag:"URGENTE",       color:T.rose,  desc:"Deita onde der. O berço pode esperar." },
            { icon:"💧", title:"Beba água agora",             tag:"TOPIRAMATO",    color:T.teal,  desc:"500ml gelada atenua o formigamento do remédio." },
            { icon:"📵", title:"Descanso de tela",            tag:"DOR DE CABEÇA", color:T.amber, desc:"Luz de monitor piora a enxaqueca inicial do Topiramato." },
          ].map((p, i, arr) => (
            <div id={`prescription-row-${i}`} key={i} style={{ padding:"14px 16px", borderBottom: i < arr.length-1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ fontSize:18 }}>{p.icon}</span>
                <span style={{ fontSize:14, fontWeight:600, color:T.text }}>{p.title}</span>
                <div style={{ marginLeft:"auto" }}><Chip label={p.tag} color={p.color}/></div>
              </div>
              <p style={{ fontSize:12, color:T.sub, lineHeight:1.5, paddingLeft:26 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* 5 — RESTO DO DIA */}
        <Divider label="Resto do dia" />
        <div id="card-rest-of-day" style={{ background:T.s1, border:`1px solid ${T.border}`, borderRadius:14, padding:"4px 16px" }}>
          {normal.map(t => <TaskRow key={t.id} task={t} onToggle={toggleTask}/>)}
        </div>

        <div id="estimated-time-summary" style={{
          marginTop:10, padding:"12px 16px",
          background:T.s1, border:`1px solid ${T.border}`,
          borderRadius:12, display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <div>
            <p style={{ fontSize:11, color:T.sub }}>Tempo estimado restante</p>
            <p style={{ fontSize:22, fontWeight:700, color:T.text }}>
              {totalMin} <span style={{ fontSize:12, color:T.sub }}>min</span>
            </p>
          </div>
          {totalMin <= 90 && (
            <p style={{ fontSize:11, color:T.teal, maxWidth:120, textAlign:"right", lineHeight:1.4 }}>
              Acordou cansada? Reduzimos o escopo.
            </p>
          )}
        </div>

        {/* 6 — JOGA AQUI */}
        <Divider label="Joga aqui" />
        <div id="card-joga-aqui" style={{
          background:T.s1,
          border:`1px solid ${isListening ? T.rose : T.border}`,
          borderRadius:14, padding:16,
          boxShadow: isListening ? `0 0 24px ${T.rose}22` : "none",
          transition:"all .3s",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div>
              <p style={{ fontSize:14, fontWeight:700, color:T.text, marginBottom:2 }}>
                WhatsApp, pensamento solto, lista bagunçada.
              </p>
              <p style={{ fontSize:12, color:T.sub }}>A MOM organiza.</p>
            </div>

            {/* botão de voz */}
            {voiceSupported && (
              <button
                id="btn-mom-voice"
                onClick={toggleVoice}
                title={isListening ? "Parar gravação" : "Falar tarefa"}
                style={{
                  flexShrink:0, marginLeft:12,
                  width:44, height:44, borderRadius:"50%", border:"none",
                  background: isListening ? T.rose : T.s2,
                  cursor:"pointer", transition:"all .2s",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow: isListening ? `0 0 0 4px ${T.rose}33, 0 0 0 8px ${T.rose}11` : "none",
                }}>
                {isListening ? (
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <rect x="2"   y="6" width="2.5" height="8"  rx="1.2" fill="white">
                      <animate attributeName="height" values="8;14;8"   dur=".8s" repeatCount="indefinite" begin="0s"/>
                      <animate attributeName="y"      values="6;3;6"    dur=".8s" repeatCount="indefinite" begin="0s"/>
                    </rect>
                    <rect x="6.5" y="4" width="2.5" height="12" rx="1.2" fill="white">
                      <animate attributeName="height" values="12;6;12"  dur=".8s" repeatCount="indefinite" begin=".15s"/>
                      <animate attributeName="y"      values="4;7;4"    dur=".8s" repeatCount="indefinite" begin=".15s"/>
                    </rect>
                    <rect x="11"  y="7" width="2.5" height="6"  rx="1.2" fill="white">
                      <animate attributeName="height" values="6;13;6"   dur=".8s" repeatCount="indefinite" begin=".3s"/>
                      <animate attributeName="y"      values="7;3.5;7"  dur=".8s" repeatCount="indefinite" begin=".3s"/>
                    </rect>
                    <rect x="15.5" y="5" width="2.5" height="10" rx="1.2" fill="white">
                      <animate attributeName="height" values="10;5;10"  dur=".8s" repeatCount="indefinite" begin=".1s"/>
                      <animate attributeName="y"      values="5;7.5;5"  dur=".8s" repeatCount="indefinite" begin=".1s"/>
                    </rect>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round">
                    <rect x="9" y="2" width="6" height="11" rx="3"/>
                    <path d="M5 10a7 7 0 0 0 14 0"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                    <line x1="9"  y1="22" x2="15" y2="22"/>
                  </svg>
                )}
              </button>
            )}
          </div>

          {isListening && (
            <div id="listening-indicator" style={{
              marginBottom:10, padding:"8px 12px",
              background:T.rose+"18", borderRadius:8,
              display:"flex", alignItems:"center", gap:8,
            }}>
              <Pulse color={T.rose}/>
              <span style={{ fontSize:12, color:T.rose, fontWeight:600 }}>
                Ouvindo… fale suas tarefas
              </span>
            </div>
          )}

          <div style={{ position:"relative" }}>
            <textarea
              id="txt-mom-inbox"
              value={inbox}
              onChange={e => setInbox(e.target.value)}
              placeholder="Cola aqui ou use o microfone. Eu organizo."
              style={{
                width:"100%", minHeight:90,
                background:T.s2,
                border:`1px solid ${isListening ? T.rose+"44" : T.border}`,
                borderRadius:10, padding:"10px 12px",
                color:T.text, fontSize:13, resize:"vertical",
                fontFamily:"inherit", outline:"none", lineHeight:1.6,
                boxSizing:"border-box", transition:"border-color .2s",
              }}
            />
            {isListening && interimRef.current && (
              <div id="voice-interim-text" style={{
                position:"absolute", bottom:10, left:12, right:12,
                fontSize:13, color:T.rose+"99", fontStyle:"italic",
                pointerEvents:"none", lineHeight:1.6,
              }}>
                {interimRef.current}
              </div>
            )}
          </div>

          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <button
              id="btn-add-direct"
              onClick={() => {
                if (!inbox.trim()) return;
                setTasks(p => [...p, { id:Date.now(), text:inbox, time:"?", cat:"Casa", done:false, urgent:false, later:false }]);
                setInbox("");
              }}
              style={{
                flex:1, padding:10, borderRadius:8,
                border:`1px solid ${T.border}`, background:"transparent",
                color:T.sub, fontSize:12, cursor:"pointer",
              }}>
              Adicionar do jeito que está ⚡
            </button>
            <button
              id="btn-mom-organize"
              onClick={processInbox}
              disabled={!inbox.trim() || inboxLoad}
              style={{
                flex:1, padding:10, borderRadius:8, border:"none",
                background: inbox.trim() ? T.teal : T.s2,
                color: inbox.trim() ? T.bg : T.muted,
                fontSize:12, fontWeight:700,
                cursor: inbox.trim() ? "pointer" : "default",
                transition:"all .2s",
              }}>
              {inboxLoad ? "Organizando…" : "MOM, organiza isso ⚡"}
            </button>
          </div>

          {inboxRes.length > 0 && (
            <div id="card-organized-inbox" style={{ marginTop:14, borderTop:`1px solid ${T.border}`, paddingTop:14 }}>
              <p style={{ fontSize:11, color:T.teal, fontWeight:700, letterSpacing:"0.1em", marginBottom:10 }}>
                <Pulse color={T.teal}/>TAREFAS ORGANIZADAS
              </p>
              {inboxRes.map((t, i) => (
                <div id={`organized-row-${i}`} key={i} style={{ padding:"10px 0", borderBottom: i < inboxRes.length-1 ? `1px solid ${T.border}` : "none" }}>
                  <p style={{ fontSize:13, color:T.text, marginBottom:4 }}>{t.text}</p>
                  <div style={{ display:"flex", gap:6 }}>
                    <Chip label={t.cat} color={catColor[t.cat as keyof typeof catColor] || T.sub}/>
                    <Chip label={"⏱ " + t.time} color={T.muted}/>
                  </div>
                </div>
              ))}
              <button
                id="btn-add-organized-tasks"
                onClick={addInboxTasks}
                style={{
                  width:"100%", marginTop:14, padding:12, borderRadius:8,
                  border:"none", background:T.teal, color:T.bg,
                  fontWeight:700, fontSize:13, cursor:"pointer",
                }}>
                Adicionar à lista de hoje ✓
              </button>
            </div>
          )}
        </div>

        {/* 7 — SEMANA QUE VEM */}
        <Divider label="Semana que vem" />
        <button
          id="btn-show-later"
          onClick={() => setShowLater(p => !p)}
          style={{
            width:"100%", padding:"12px 16px", borderRadius:12,
            border:`1px solid ${T.border}`, background:T.s1,
            color:T.sub, fontSize:13, cursor:"pointer",
            display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
          <span>{later.length} tarefas guardadas para depois</span>
          <span style={{ transition:"transform .2s", transform: showLater ? "rotate(180deg)" : "none" }}>↓</span>
        </button>

        {showLater && (
          <div id="card-later-tasks" style={{ marginTop:6, background:T.s1, border:`1px solid ${T.border}`, borderRadius:14, padding:"4px 16px" }}>
            {later.map(t => <TaskRow key={t.id} task={t} onToggle={toggleTask}/>)}
          </div>
        )}

        {/* 8 — CONCLUÍDAS */}
        <div id="card-completed-count" style={{
          marginTop:20, padding:"14px 16px",
          background:T.s1, border:`1px solid ${T.border}`,
          borderRadius:12, display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <p style={{ fontSize:13, color:T.sub }}>Concluídas com sucesso 🎯</p>
          <p style={{ fontSize:24, fontWeight:700, color:T.teal }}>{tasks.filter(t => t.done).length}</p>
        </div>

        <p id="app-footer-text" style={{ textAlign:"center", fontSize:11, color:T.muted, marginTop:24, marginBottom:8 }}>
          M.O.M. — Minha Outra Mente · feito por uma mãe, para mães
        </p>

      </div>
    </div>
  );
}
