import { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const LOGO_B64 = "data:image/png;base64,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";
const VERSION  = "v3.3.0";

// ─── BRAND ───────────────────────────────────────────────────────────────────
const C = {
  dark:"#0B3A4F", teal:"#3E8B7A", teal2:"#2D6B5C", sage:"#6BAA8C", sageL:"#A8CFBF",
  light:"#EEF6F3", mid:"#D4EBE4", white:"#FFFFFF", bg:"#F2F7F6", muted:"#567C72",
  text:"#0B3A4F", gray:"#64748B", border:"#C8DDD8",
};

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const DISCIPLINES = [
  {id:"forca",             name:"Força, controle e instrumentação", hhBase:8},
  {id:"iluminacao",        name:"Iluminação e tomadas",              hhBase:7},
  {id:"aterramento",       name:"Aterramento e SPDA",                hhBase:6},
  {id:"arranjo_sala",      name:"Arranjo de sala elétrica",          hhBase:8},
  {id:"rede_aerea",        name:"Rede aérea",                        hhBase:7},
  {id:"estrutural",        name:"Estrutural (fund. / forma / arm.)", hhBase:6},
  {id:"metalica",          name:"Estrutura metálica",                hhBase:9},
  {id:"arquitetura",       name:"Arquitetura",                       hhBase:5},
  {id:"drenagem",          name:"Drenagem pluvial / oleosa",         hhBase:6},
];
const DELIVERY_TYPES = [
  {id:"maquete",   name:"Maquete 3D",   desc:"Representação visual para validação conceitual — volumetria, layout e arranjo geral.",     allowedLOD:["lod200","lod300"], allowedLOI:["basico"]},
  {id:"projeto3d", name:"Projeto 3D",   desc:"Precisão geométrica para compatibilização de disciplinas e retirada de interferências.",   allowedLOD:["lod300","lod350"], allowedLOI:["basico","intermediario"]},
  {id:"bim",       name:"Projeto BIM",  desc:"Precisão geométrica e informação dos elementos. Aplicável ao ciclo de vida e gestão de ativos.", allowedLOD:["lod350","lod400"], allowedLOI:["intermediario","avancado"]},
];
const COMPLEXITY = [
  {id:"baixa",     name:"Baixa",     x:1.0, desc:"Greenfield, amplo espaço, poucas interferências, rotas simples."},
  {id:"media",     name:"Média",     x:1.1, desc:"Modernização/ampliação com infraestrutura existente, não totalmente congestionada."},
  {id:"alta",      name:"Alta",      x:1.3, desc:"Brownfield em área densa, muitos desvios, clash detection necessário."},
  {id:"muito_alta",name:"Muito Alta",x:1.4, desc:"Ambiente extremamente congestionado, tolerâncias mínimas, engenharia customizada."},
];
const LOD = [
  {id:"lod200",name:"LOD 200",sub:"Esquemático",           x:1.0},
  {id:"lod300",name:"LOD 300",sub:"Projeto detalhado",     x:1.1},
  {id:"lod350",name:"LOD 350",sub:"Projeto executivo",     x:1.3},
  {id:"lod400",name:"LOD 400",sub:"Fabricação / montagem", x:1.4},
];
const LOI = [
  {id:"basico",        name:"Básico",        x:1.0, desc:"Apenas geometria, sem dados não-gráficos."},
  {id:"intermediario", name:"Intermediário", x:1.2, desc:"TAG, material, dimensões — extração de BOM básica."},
  {id:"avancado",      name:"Avançado (BIM)",x:1.3, desc:"Dados completos para gestão do ciclo de vida do ativo."},
];
const DERIVED = [
  {id:"documentacao",name:"Documentação / Extração de formatos",unit:"formato",     hh:3.0},
  {id:"bom",         name:"Lista de materiais (BOM)",           unit:"disciplinas", hh:2.0},
  {id:"clash",       name:"Relatório de clash detection",       unit:"disciplinas", hh:3.0},
  {id:"federado",    name:"Modelo federado / coordenação",      unit:"disciplinas", hh:4.0},
];
const STEPS = ["Dados do orçamento","Disciplinas","Tipo de entrega","Parâmetros","Entregáveis derivados","Coordenação BIM","Resultado"];

const DEFAULT_SETTINGS = {
  hhModelador:160.00, hhCoordenador:195.00,
  licencaAnual:15509.77, horasAnuais:2000,
  margemEnabled:true, margemMaquete:5, margemProjeto3d:10, margemBim:15,
  disciplines:Object.fromEntries(DISCIPLINES.map(d=>[d.id,d.hhBase])),
  derivedHH:{documentacao:3.0,bom:2.0,clash:3.0,federado:4.0},
  complexityX:{baixa:1.0,media:1.1,alta:1.3,muito_alta:1.4},
  lodX:{lod200:1.0,lod300:1.1,lod350:1.3,lod400:1.4},
  loiX:{basico:1.0,intermediario:1.2,avancado:1.3},
  escalonamento:{
    enabled:true,
    faixas:[
      {id:"f1",label:"Até 20 A1",         upTo:20,   fator:1.00},
      {id:"f2",label:"21 a 50 A1",         upTo:50,   fator:0.80},
      {id:"f3",label:"51 a 100 A1",        upTo:100,  fator:0.60},
      {id:"f4",label:"Acima de 101 A1",    upTo:9999, fator:0.50},
    ]
  }
};
const initDisciplines = s => DISCIPLINES.map(d=>({...d,active:false,a1:1,hh:s.disciplines[d.id]??d.hhBase}));
function hashPwd(p){ try{ return btoa(unescape(encodeURIComponent(p))); }catch(e){ return btoa(p); } }
function checkPwd(plain,stored){ return hashPwd(plain)===stored; }
function getDefaultUsers(){
  return [{id:"1",name:"Administrador",username:"admin",password:hashPwd("admin123"),role:"admin",active:true,createdAt:new Date().toISOString()}];
}

// ─── localStorage helpers (replaces window.storage) ──────────────────────
// ─── Supabase client ─────────────────────────────────────────────────────────
const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL      || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ─── DB not configured guard ─────────────────────────────────────────────────
function DbNotReady(){
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0B3A4F",padding:20,fontFamily:"DM Sans, sans-serif"}}>
      <div style={{background:"#fff",borderRadius:20,padding:"32px 40px",maxWidth:520,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.4)"}}>
        <p style={{fontFamily:"Outfit, sans-serif",fontWeight:800,fontSize:20,color:"#0B3A4F",marginBottom:8}}>⚙️ Configuração necessária</p>
        <p style={{fontSize:14,color:"#567C72",lineHeight:1.7,marginBottom:16}}>
          As variáveis de ambiente do Supabase não estão configuradas. Adicione as seguintes variáveis no seu projeto Vercel e faça um novo deploy:
        </p>
        <div style={{background:"#F2F7F6",borderRadius:10,padding:"14px 16px",fontFamily:"monospace",fontSize:13,color:"#0B3A4F",lineHeight:2}}>
          <p>VITE_SUPABASE_URL=https://xxx.supabase.co</p>
          <p>VITE_SUPABASE_ANON_KEY=eyJhb...</p>
        </div>
        <p style={{fontSize:12,color:"#94A3B8",marginTop:14,lineHeight:1.6}}>
          Encontre esses valores em: Supabase Dashboard → Project Settings → API
        </p>
      </div>
    </div>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const R  = (n,d=2)=>Math.round(n*10**d)/10**d;
const BRL = n=>R(n,2).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const N1  = n=>R(n,1).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1});
const N2  = n=>R(n,2).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
const N0  = n=>Math.round(n).toLocaleString("pt-BR");
const PCT = n=>R(n,1).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})+"%";

// Compute faixa label from sorted faixas array and index
function getFaixaLabel(sortedFaixas, index) {
  if (index === 0) return `Até ${sortedFaixas[0].upTo} A1`;
  if (index === sortedFaixas.length - 1) return `Acima de ${sortedFaixas[index-1].upTo + 1} A1`;
  return `${sortedFaixas[index-1].upTo + 1} a ${sortedFaixas[index].upTo} A1`;
}

function recomputeFaixaLabels(faixas) {
  const sorted = [...faixas].sort((a,b) => a.upTo - b.upTo);
  return faixas.map(f => {
    const idx = sorted.findIndex(sf => sf.id === f.id);
    return {...f, label: getFaixaLabel(sorted, idx)};
  });
}

function calcBlendedFactor(totalA1, escalonamento) {
  if (!escalonamento?.enabled || totalA1===0) return 1.0;
  const faixas=[...escalonamento.faixas].sort((a,b)=>a.upTo-b.upTo);
  let weighted=0,prev=0;
  for(const f of faixas){
    if(prev>=totalA1) break;
    const count=Math.min(totalA1,f.upTo)-prev;
    if(count>0) weighted+=count*f.fator;
    prev=f.upTo;
  }
  return R(weighted/totalA1,4);
}

function calcScalingBreakdown(totalA1, escalonamento) {
  if(!escalonamento?.enabled||totalA1===0) return [];
  const faixas=[...escalonamento.faixas].sort((a,b)=>a.upTo-b.upTo);
  const result=[]; let prev=0;
  for(const f of faixas){
    if(prev>=totalA1) break;
    const count=Math.min(totalA1,f.upTo)-prev;
    if(count>0) result.push({label:f.label,count,fator:f.fator});
    prev=f.upTo;
  }
  return result;
}

// ─── ATOMS ───────────────────────────────────────────────────────────────────
function Toggle({on,onChange}){
  return(
    <button onClick={()=>onChange(!on)} style={{width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",background:on?C.teal:"#CBD5E1",position:"relative",transition:"background .2s",flexShrink:0}}>
      <span style={{position:"absolute",top:3,left:on?23:3,width:18,height:18,borderRadius:9,background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
    </button>
  );
}
function Checkbox({checked,onChange}){
  return(
    <button onClick={()=>onChange(!checked)} style={{width:20,height:20,borderRadius:5,border:checked?"none":`2px solid ${C.border}`,background:checked?C.teal:"#fff",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
      {checked&&<svg viewBox="0 0 12 10" width={10} height={10} fill="none" stroke="#fff" strokeWidth={2}><path d="M1 5L4.5 8.5L11 1"/></svg>}
    </button>
  );
}
function NumInput({value,onChange,min=0,step=1,width=72,center=false}){
  return <input type="number" value={value} min={min} step={step} onChange={e=>onChange(parseFloat(e.target.value)||0)}
    style={{width,textAlign:center?"center":"right",padding:"5px 8px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,outline:"none",fontFamily:"DM Sans, sans-serif",background:"#fff"}}/>;
}
function FormattedInput({value,onChange,decimals=2,style:sty}){
  const [editing,setEditing]=useState(false);
  const [raw,setRaw]=useState("");
  const fmt=n=>isNaN(n)?"":Number(n).toLocaleString("pt-BR",{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
  const parse=str=>{
    const clean=str.includes(",")? str.replace(/\./g,"").replace(",","."): str;
    return parseFloat(clean.replace(/[^\d.]/g,""));
  };
  return <input type="text" inputMode="decimal"
    value={editing?raw:fmt(value)}
    onFocus={e=>{setEditing(true);setRaw(fmt(value));e.target.select();}}
    onChange={e=>setRaw(e.target.value)}
    onBlur={()=>{setEditing(false);const p=parse(raw);if(!isNaN(p)&&p>=0)onChange(p);}}
    style={sty}/>;
}
function TextInput({value,onChange,placeholder}){
  return <input type="text" value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}
    style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:10,fontSize:14,outline:"none",fontFamily:"DM Sans, sans-serif",color:C.text,boxSizing:"border-box"}}/>;
}
function StepHeader({title,desc}){
  return(
    <div style={{paddingBottom:16,borderBottom:`1.5px solid ${C.mid}`,marginBottom:20}}>
      <h2 style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:20,color:C.dark,margin:0}}>{title}</h2>
      {desc&&<p style={{fontSize:13,color:C.muted,marginTop:4}}>{desc}</p>}
    </div>
  );
}
function SectionLabel({children}){
  return <p style={{fontSize:11,fontWeight:700,color:C.teal,textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>{children}</p>;
}
function Tag({children,color="teal"}){
  const cols={teal:{bg:C.light,text:C.teal2},purple:{bg:"#F0EBF8",text:"#5B21B6"}};
  const col=cols[color];
  return <span style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:col.bg,color:col.text,fontWeight:600}}>{children}</span>;
}
function Modal({title,onClose,children,maxWidth=640}){
  return(
    <div style={{position:"fixed",inset:0,zIndex:60,background:"rgba(11,58,79,.7)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.22)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 22px 14px",borderBottom:`1px solid ${C.mid}`}}>
          <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:16,color:C.dark}}>{title}</p>
          <button onClick={onClose} style={{fontSize:22,color:C.gray,background:"none",border:"none",cursor:"pointer",lineHeight:1}}>×</button>
        </div>
        <div style={{padding:22}}>{children}</div>
      </div>
    </div>
  );
}

// ─── SETTINGS MODAL ──────────────────────────────────────────────────────────
function SettingsModal({settings,onSave,onClose}){
  const [s,setS]=useState({...settings,
    disciplines:{...settings.disciplines},
    derivedHH:{...settings.derivedHH},
    complexityX:{...settings.complexityX},
    lodX:{...settings.lodX},
    loiX:{...settings.loiX},
    escalonamento:{...settings.escalonamento,faixas:settings.escalonamento.faixas.map(f=>({...f}))},
  });
  const set=(k,v)=>setS(p=>({...p,[k]:v}));
  const setD=(id,v)=>setS(p=>({...p,disciplines:{...p.disciplines,[id]:v}}));
  const setDH=(id,v)=>setS(p=>({...p,derivedHH:{...p.derivedHH,[id]:v}}));
  const setCX=(id,v)=>setS(p=>({...p,complexityX:{...p.complexityX,[id]:v}}));
  const setLX=(id,v)=>setS(p=>({...p,lodX:{...p.lodX,[id]:v}}));
  const setLI=(id,v)=>setS(p=>({...p,loiX:{...p.loiX,[id]:v}}));
  const setEsc=(k,v)=>setS(p=>({...p,escalonamento:{...p.escalonamento,[k]:v}}));
  const setFaixa=(id,k,v)=>setS(p=>{
    const updatedFaixas=p.escalonamento.faixas.map(f=>f.id===id?{...f,[k]:v}:f);
    const withLabels=recomputeFaixaLabels(updatedFaixas);
    return {...p,escalonamento:{...p.escalonamento,faixas:withLabels}};
  });
  const resetAll=()=>setS({...DEFAULT_SETTINGS,disciplines:{...DEFAULT_SETTINGS.disciplines},derivedHH:{...DEFAULT_SETTINGS.derivedHH},complexityX:{...DEFAULT_SETTINGS.complexityX},lodX:{...DEFAULT_SETTINGS.lodX},loiX:{...DEFAULT_SETTINGS.loiX},escalonamento:{...DEFAULT_SETTINGS.escalonamento,faixas:DEFAULT_SETTINGS.escalonamento.faixas.map(f=>({...f}))}});

  const iStyle={flex:1,padding:"7px 10px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,outline:"none",fontFamily:"DM Sans, sans-serif",boxSizing:"border-box",width:"100%"};
  const row=(label,key,dec=2,suf="")=>(
    <div key={key}>
      <label style={{fontSize:12,color:C.muted,display:"block",marginBottom:4}}>{label}</label>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <FormattedInput value={s[key]} onChange={v=>set(key,v)} decimals={dec} style={iStyle}/>
        {suf&&<span style={{fontSize:12,color:C.gray,minWidth:18}}>{suf}</span>}
      </div>
    </div>
  );

  return(
    <div style={{position:"fixed",inset:0,zIndex:50,background:"rgba(11,58,79,.65)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:680,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.18)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px 16px",borderBottom:`1px solid ${C.mid}`}}>
          <div>
            <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:17,color:C.dark}}>Configurações</p>
            <p style={{fontSize:13,color:C.gray,marginTop:2}}>Parâmetros base da metodologia de precificação</p>
          </div>
          <button onClick={onClose} style={{fontSize:22,color:C.gray,background:"none",border:"none",cursor:"pointer",lineHeight:1}}>×</button>
        </div>

        <div style={{padding:24,display:"flex",flexDirection:"column",gap:22}}>
          {/* HH */}
          <section>
            <SectionLabel>Valores de HH</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {row("HH Modelador (R$/h)","hhModelador",2)}
              {row("HH Coordenador (R$/h)","hhCoordenador",2)}
            </div>
          </section>
          {/* Licença */}
          <section>
            <SectionLabel>Licença de software</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {row("AEC Collection (R$/ano)","licencaAnual",2)}
              {row("Horas trabalhadas / ano","horasAnuais",0)}
            </div>
          </section>
          {/* Margem */}
          <section>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <SectionLabel>Margem por tipo de entrega</SectionLabel>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:12,color:s.margemEnabled?C.teal:C.gray}}>{s.margemEnabled?"Habilitada":"Desabilitada"}</span>
                <Toggle on={s.margemEnabled} onChange={v=>set("margemEnabled",v)}/>
              </div>
            </div>
            {s.margemEnabled&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                {[["Maquete 3D","margemMaquete"],["Projeto 3D","margemProjeto3d"],["Projeto BIM","margemBim"]].map(([lbl,key])=>(
                  <div key={key}>
                    <label style={{fontSize:12,color:C.muted,display:"block",marginBottom:4}}>{lbl}</label>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <input type="number" value={s[key]} step={1} min={0} max={100} onChange={e=>set(key,parseFloat(e.target.value)||0)} style={iStyle}/>
                      <span style={{fontSize:12,color:C.gray,minWidth:18}}>%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* Escalonamento */}
          <section>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <SectionLabel>Escalonamento por volume de A1</SectionLabel>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:12,color:s.escalonamento.enabled?C.teal:C.gray}}>{s.escalonamento.enabled?"Ativo":"Inativo"}</span>
                <Toggle on={s.escalonamento.enabled} onChange={v=>setEsc("enabled",v)}/>
              </div>
            </div>
            {s.escalonamento.enabled&&(
              <div style={{borderRadius:10,border:`1px solid ${C.mid}`,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",background:C.dark}}>
                  {["Faixa","Limite (A1)","Fator"].map(h=><p key={h} style={{padding:"6px 10px",fontSize:10,fontWeight:700,color:C.sageL,textTransform:"uppercase",letterSpacing:".04em"}}>{h}</p>)}
                </div>
                {s.escalonamento.faixas.map((f,i)=>(
                  <div key={f.id} style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",background:i%2===0?"#fff":C.bg,borderTop:`1px solid ${C.mid}`}}>
                    <p style={{padding:"7px 10px",fontSize:12,color:C.muted,display:"flex",alignItems:"center"}}>{f.label}</p>
                    <div style={{padding:"5px 8px"}}>
                      {i<s.escalonamento.faixas.length-1
                        ? <input type="number" value={f.upTo} step={1} min={1} onChange={e=>setFaixa(f.id,"upTo",parseInt(e.target.value)||1)} style={{...iStyle,width:"100%",textAlign:"center"}}/>
                        : <p style={{padding:"7px 4px",fontSize:12,color:C.border,textAlign:"center"}}>∞</p>
                      }
                    </div>
                    <div style={{padding:"5px 8px"}}>
                      <FormattedInput value={f.fator} onChange={v=>setFaixa(f.id,"fator",v)} decimals={2} style={{...iStyle,width:"100%",textAlign:"center"}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* HH disciplinas */}
          <section>
            <SectionLabel>HH padrão por disciplina (h / A1)</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {DISCIPLINES.map(d=>(
                <div key={d.id}>
                  <label style={{fontSize:12,color:C.muted,display:"block",marginBottom:4}}>{d.name}</label>
                  <FormattedInput value={s.disciplines[d.id]} onChange={v=>setD(d.id,v)} decimals={1} style={iStyle}/>
                </div>
              ))}
            </div>
          </section>
          {/* HH derivados */}
          <section>
            <SectionLabel>HH por entregável derivado</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {DERIVED.map(d=>(
                <div key={d.id}>
                  <label style={{fontSize:12,color:C.muted,display:"block",marginBottom:4}}>{d.name} (h/{d.unit})</label>
                  <FormattedInput value={s.derivedHH[d.id]} onChange={v=>setDH(d.id,v)} decimals={1} style={iStyle}/>
                </div>
              ))}
            </div>
          </section>
          {/* Multiplicadores */}
          <section>
            <SectionLabel>Multiplicadores — Complexidade</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {COMPLEXITY.map(c=>(
                <div key={c.id}><label style={{fontSize:12,color:C.muted,display:"block",marginBottom:4}}>{c.name}</label>
                  <FormattedInput value={s.complexityX[c.id]} onChange={v=>setCX(c.id,v)} decimals={2} style={iStyle}/></div>
              ))}
            </div>
          </section>
          <section>
            <SectionLabel>Multiplicadores — LOD</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {LOD.map(l=>(
                <div key={l.id}><label style={{fontSize:12,color:C.muted,display:"block",marginBottom:4}}>{l.name} — {l.sub}</label>
                  <FormattedInput value={s.lodX[l.id]} onChange={v=>setLX(l.id,v)} decimals={2} style={iStyle}/></div>
              ))}
            </div>
          </section>
          <section>
            <SectionLabel>Multiplicadores — LOI</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {LOI.map(l=>(
                <div key={l.id}><label style={{fontSize:12,color:C.muted,display:"block",marginBottom:4}}>{l.name}</label>
                  <FormattedInput value={s.loiX[l.id]} onChange={v=>setLI(l.id,v)} decimals={2} style={iStyle}/></div>
              ))}
            </div>
          </section>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 24px",borderTop:`1px solid ${C.mid}`}}>
          <button onClick={resetAll} style={{padding:"9px 18px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"DM Sans, sans-serif"}}>
            ↺ Restaurar padrões
          </button>
          <div style={{display:"flex",gap:10}}>
            <button onClick={onClose} style={{padding:"9px 18px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",color:C.gray,fontSize:13,cursor:"pointer"}}>Cancelar</button>
            <button onClick={()=>{
              const toSave={...s,escalonamento:{...s.escalonamento,faixas:recomputeFaixaLabels(s.escalonamento.faixas)}};
              onSave(toSave);onClose();}} style={{padding:"9px 22px",borderRadius:10,border:"none",background:C.teal,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Outfit, sans-serif"}}>
              Salvar configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ORIENTAÇÕES ─────────────────────────────────────────────────────────────
function OrientacoesView({settings}){
  const lodDescs={
    lod200:"Modelo conceitual e volumétrico. Infraestrutura representada como 'caixas' genéricas. Foco em ocupação de espaço e rotas principais.",
    lod300:"Geometria precisa e acurada. Equipamentos modelados como serão construídos. Permite extração de desenhos 2D confiáveis.",
    lod350:"Inclui detalhes de interface e conexões: suportes, conexões entre eletrodutos e caixas, detalhes de montagem.",
    lod400:"Nível de detalhe para fabricação. Inclui furações, parafusos, detalhes construtivos específicos. Casos muito específicos.",
  };
  const lodTipos={lod200:"Maquete 3D",lod300:"Maquete 3D / Projeto 3D",lod350:"Projeto 3D / Projeto BIM",lod400:"Projeto BIM"};
  const lodTable=LOD.map(l=>({lod:l.name,mult:`×${N1(settings.lodX[l.id]??l.x)}`,tipo:lodTipos[l.id],desc:lodDescs[l.id]}));

  const steps=[
    {n:1,title:"Dados do orçamento",body:"Informe o nome do cliente, nome ou código do projeto e o responsável pelo orçamento. Apenas o campo de observações é opcional."},
    {n:2,title:"Disciplinas",body:"Selecione as disciplinas dentro do escopo e estime a quantidade de formatos A1 equivalentes para cada uma. O sistema calculará automaticamente o fator de escalonamento por volume quando aplicável."},
    {n:3,title:"Tipo de entrega",body:"Define o objetivo do modelo 3D. A escolha restringe os LODs e LOIs disponíveis no próximo passo."},
    {n:4,title:"Parâmetros",body:"Defina Complexidade, LOD e LOI. O produto dos três multiplicadores gera o Fator Multiplicador total do orçamento."},
    {n:5,title:"Entregáveis derivados",body:"Inclua documentação e extrações adicionais geradas a partir do modelo 3D."},
    {n:6,title:"Coordenação BIM",body:"Habilite se o escopo inclui gestão técnica, revisão e compatibilização entre disciplinas."},
    {n:7,title:"Resultado",body:"Visualize o detalhamento completo, aplique desconto comercial se necessário, compare cenários e exporte o PDF do orçamento."},
  ];

  const card=(title,content)=>(
    <div style={{background:"#fff",borderRadius:12,border:`1px solid ${C.mid}`,padding:"14px 18px"}}>
      <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:13,color:C.teal,marginBottom:6}}>{title}</p>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{content}</p>
    </div>
  );

  const thStyle={padding:"9px 12px",fontSize:10,fontWeight:700,color:C.sageL,textTransform:"uppercase",letterSpacing:".04em"};
  const tdStyle=(i)=>({padding:"9px 12px",background:i%2===0?"#fff":C.bg,borderTop:`1px solid ${C.mid}`});

  return(
    <div style={{maxWidth:820,margin:"0 auto",padding:"32px 32px 48px"}}>
      {/* Hero */}
      <div style={{background:C.dark,borderRadius:16,padding:"24px 28px",marginBottom:28,color:"#fff"}}>
        <p style={{fontFamily:"Outfit, sans-serif",fontWeight:800,fontSize:22,marginBottom:6}}>Orientações Gerais</p>
        <p style={{fontSize:14,color:C.sageL,lineHeight:1.6,maxWidth:680}}>
          Manual de utilização da ferramenta de precificação para serviços de modelagem 3D.
          Esta ferramenta auxilia a equipe comercial na composição de orçamentos com base em dados, considerando complexidade, LOD, LOI, escalonamento e entregáveis específicos.
        </p>
      </div>

      {/* Objetivo e área */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}}>
        {card("Objetivo","Auxiliar a equipe comercial na elaboração de orçamentos de serviços de modelagem 3D, fornecendo uma ferramenta que avalie a complexidade do escopo, o LOD e o LOI, com maior assertividade e transparência.")}
        {card("Área de aplicação","Departamento Comercial e DEP (Departamento de Engenharia de Projetos). Para uso interno na composição de orçamentos para clientes.")}
      </div>

      {/* Conceitos */}
      <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:15,color:C.dark,marginBottom:12}}>Conceitos fundamentais</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:28}}>
        {card("Tipo de entrega","Define o objetivo do modelo: Maquete 3D, Projeto 3D ou Projeto BIM. Cada tipo restringe os LODs e LOIs disponíveis.")}
        {card("Nível de complexidade","Mede o esforço, risco e expertise necessários — de áreas novas (greenfield) a ambientes extremamente congestionados.")}
        {card("LOD — Level of Development","Nível de detalhamento geométrico do modelo 3D. Quanto maior o LOD, mais detalhada a representação.")}
        {card("LOI — Level of Information","Quantidade de dados não gráficos. Vai de geometria pura (Básico) até dados completos para gestão do ciclo de vida (Avançado/BIM).")}
        {card("Fator multiplicador","Calculado como Complexidade × LOD × LOI. Reflete a dificuldade total em relação ao padrão base.")}
        {card("HH padrão 1×A1","Tempo médio para modelar o equivalente a 1 formato A1 sob condições padrão. Varia por disciplina e pode ser ajustado nas Configurações.")}
      </div>

      {/* Passo a passo */}
      <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:15,color:C.dark,marginBottom:12}}>Como utilizar</p>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
        {steps.map(s=>(
          <div key={s.n} style={{display:"flex",gap:14,padding:"12px 16px",background:"#fff",borderRadius:12,border:`1px solid ${C.mid}`}}>
            <div style={{width:26,height:26,borderRadius:13,background:C.teal,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0,marginTop:1}}>{s.n}</div>
            <div style={{flex:1}}>
              <p style={{fontFamily:"Outfit, sans-serif",fontWeight:600,fontSize:13,color:C.dark,marginBottom:3,textAlign:"right"}}>{s.title}</p>
              <p style={{fontSize:13,color:C.muted,lineHeight:1.55}}>{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Escalonamento */}
      <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:15,color:C.dark,marginBottom:8}}>Escalonamento por volume de A1</p>
      <p style={{fontSize:13,color:C.muted,marginBottom:14,lineHeight:1.6}}>
        Projetos com maior volume de A1 se beneficiam de ganhos de escala: o ambiente e as bibliotecas já estão configurados, os padrões estabelecidos e a curva de aprendizado superada.
        O escalonamento aplica fatores progressivos sobre as horas de modelagem, tornando o orçamento mais competitivo em escopos grandes.
        O fator resultante é calculado como a média ponderada dos fatores de cada faixa, proporcional ao volume de A1 em cada uma.
      </p>
      <div style={{background:C.light,borderRadius:12,padding:"14px 18px",marginBottom:8,border:`1px solid ${C.mid}`}}>
        <p style={{fontSize:13,color:C.text,lineHeight:1.6}}><strong>Exemplo:</strong> Para 120 A1 com as faixas padrão (≤20: ×1,00 | 21–50: ×0,80 | 51–100: ×0,60 | +101: ×0,50):
        os primeiros 20 A1 têm fator 1,00; os próximos 30 (21–50) têm 0,80; os próximos 50 (51–100) têm 0,60; os últimos 20 (101–120) têm 0,50.
        O fator blended resultante é <strong>(20×1,00 + 30×0,80 + 50×0,60 + 20×0,50) / 120 ≈ 0,658</strong>, reduzindo as horas totais em ~34%.</p>
      </div>
      <p style={{fontSize:12,color:C.muted,marginBottom:28}}>Os limites e fatores de cada faixa são configuráveis em Configurações → Escalonamento por volume de A1.</p>

      {/* Desconto comercial */}
      <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:15,color:C.dark,marginBottom:8}}>Desconto comercial</p>
      <p style={{fontSize:13,color:C.muted,marginBottom:28,lineHeight:1.6}}>
        Na tela de Resultado (Passo 7) é possível aplicar um desconto comercial sobre o preço final, em percentual (%) ou valor fixo (R$).
        O desconto é calculado após a aplicação da margem e não altera a estrutura de custo — apenas o preço apresentado ao cliente.
        Use com moderação para negociações pontuais; ajustes estruturais de preço devem ser feitos via margem nas Configurações.
      </p>

      {/* Comparação de cenários */}
      <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:15,color:C.dark,marginBottom:8}}>Comparação de cenários</p>
      <p style={{fontSize:13,color:C.muted,marginBottom:14,lineHeight:1.6}}>
        Na tela de Resultado é possível salvar o orçamento atual como <strong>Cenário A</strong> e, em seguida, voltar e ajustar qualquer parâmetro (ex: LOD 300 vs LOD 350, ou Complexidade Média vs Alta).
        Ao chegar novamente no Resultado, o botão <strong>"Comparar cenários"</strong> exibe uma tabela lado a lado com as diferenças de horas e custo entre os cenários, que pode ser exportada em PDF para apresentação ao cliente.
      </p>
      <div style={{background:C.light,borderRadius:12,padding:"14px 18px",marginBottom:28,border:`1px solid ${C.mid}`}}>
        <p style={{fontSize:13,color:C.text,lineHeight:1.6}}><strong>Fluxo:</strong> Resultado → "Salvar como Cenário A" → "Voltar" → ajustar parâmetro → "Comparar cenários" → "Exportar PDF Comparativo".</p>
      </div>

      {/* Orçamentos salvos */}
      <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:15,color:C.dark,marginBottom:8}}>Orçamentos salvos</p>
      <p style={{fontSize:13,color:C.muted,marginBottom:28,lineHeight:1.6}}>
        Utilize o botão <strong>"Salvar orçamento"</strong> na tela de Resultado para armazenar o orçamento no banco de dados.
        Os orçamentos salvos ficam acessíveis pela seção <strong>"Orçamentos salvos"</strong> na barra lateral, onde podem ser abertos, editados ou excluídos.
        <br/><strong>Visibilidade compartilhada:</strong> todos os usuários do sistema podem visualizar e carregar qualquer orçamento salvo, independente do dispositivo ou sessão em que foi criado.
      </p>

      {/* LOD Table */}
      <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:15,color:C.dark,marginBottom:12}}>Tabela de LOD — Exemplos de nível de desenvolvimento</p>
      <p style={{fontSize:13,color:C.muted,marginBottom:14,lineHeight:1.6}}>
        A definição do LOD envolve análise ampla do escopo, objetivo do modelo, requisitos técnicos e Plano de Execução BIM (PEB).
      </p>
      <div style={{borderRadius:12,border:`1.5px solid ${C.mid}`,overflow:"hidden",marginBottom:28}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:C.dark}}>
            {["LOD","Mult.","Tipo ideal","Descrição"].map((h,i)=>(
              <th key={h} style={{...thStyle,textAlign:i<2?"center":"left"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {lodTable.map((row,i)=>(
              <tr key={row.lod}>
                <td style={{...tdStyle(i),textAlign:"center",fontFamily:"Outfit, sans-serif",fontWeight:700,color:C.teal,whiteSpace:"nowrap"}}>{row.lod}</td>
                <td style={{...tdStyle(i),textAlign:"center",fontFamily:"monospace",fontWeight:700,color:C.dark,whiteSpace:"nowrap"}}>{row.mult}</td>
                <td style={{...tdStyle(i),color:C.muted,fontSize:12,whiteSpace:"nowrap"}}>{row.tipo}</td>
                <td style={{...tdStyle(i),color:C.text,lineHeight:1.5}}>{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Complexity Table */}
      <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:15,color:C.dark,marginBottom:12}}>Tabela de complexidade</p>
      <div style={{borderRadius:12,border:`1.5px solid ${C.mid}`,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:C.dark}}>
            {["Nível","Mult.","Descrição"].map((h,i)=>(
              <th key={h} style={{...thStyle,textAlign:i<2?"center":"left"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {COMPLEXITY.map((row,i)=>(
              <tr key={row.id}>
                <td style={{...tdStyle(i),textAlign:"center",fontFamily:"Outfit, sans-serif",fontWeight:700,color:C.teal,whiteSpace:"nowrap"}}>{row.name}</td>
                <td style={{...tdStyle(i),textAlign:"center",fontFamily:"monospace",fontWeight:700,color:C.dark}}>{`×${N1(settings.complexityX[row.id]??row.x)}`}</td>
                <td style={{...tdStyle(i),color:C.text,lineHeight:1.5}}>{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SAVED QUOTES VIEW ────────────────────────────────────────────────────────
function SavedQuotesView({quotes,onLoad,onDelete}){
  const [search,setSearch]=useState("");
  const [filterResp,setFilterResp]=useState("");

  // Unique responsáveis for the dropdown
  const responsaveis=[...new Set(quotes.map(q=>q.state?.dados?.responsavel||"").filter(Boolean))].sort();

  const filtered=quotes
    .filter(q=>{
      const s=search.toLowerCase();
      if(!s&&!filterResp) return true;
      const title=(q.titulo||"").toLowerCase();
      const resp=(q.state?.dados?.responsavel||"").toLowerCase();
      const matchSearch=!s||(title.includes(s)||resp.includes(s)||(q.tipo||"").toLowerCase().includes(s));
      const matchResp=!filterResp||resp===filterResp.toLowerCase();
      return matchSearch&&matchResp;
    })
    .sort((a,b)=>b.id-a.id);

  if(quotes.length===0) return(
    <div style={{maxWidth:700,margin:"0 auto",padding:"60px 32px",textAlign:"center"}}>
      <div style={{width:56,height:56,borderRadius:16,background:C.mid,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
        <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke={C.muted} strokeWidth={1.5} strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      </div>
      <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:16,color:C.dark,marginBottom:6}}>Nenhum orçamento salvo</p>
      <p style={{fontSize:13,color:C.muted}}>Conclua um orçamento e clique em "Salvar orçamento" para armazená-lo aqui.</p>
    </div>
  );

  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"32px"}}>
      {/* Header */}
      <div style={{marginBottom:18,paddingBottom:16,borderBottom:`1.5px solid ${C.mid}`}}>
        <h2 style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:20,color:C.dark,margin:0}}>Orçamentos salvos</h2>
        <p style={{fontSize:12,color:C.muted,marginTop:4}}>
          {quotes.length} orçamento{quotes.length!==1?"s":""} armazenado{quotes.length!==1?"s":""}.
          <span style={{color:C.teal2,marginLeft:6,fontWeight:600}}>Visíveis para todos os usuários do sistema.</span>
        </p>
      </div>

      {/* Filters */}
      <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,marginBottom:16}}>
        <div style={{position:"relative"}}>
          <svg viewBox="0 0 20 20" width={15} height={15} fill="none" stroke={C.border} strokeWidth={1.8} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><circle cx="8" cy="8" r="5"/><path d="M15 15l-3.5-3.5"/></svg>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por cliente, projeto ou responsável..."
            style={{width:"100%",padding:"8px 10px 8px 32px",border:`1.5px solid ${C.border}`,borderRadius:10,fontSize:13,outline:"none",fontFamily:"DM Sans, sans-serif",boxSizing:"border-box"}}/>
        </div>
        <select value={filterResp} onChange={e=>setFilterResp(e.target.value)}
          style={{padding:"8px 12px",border:`1.5px solid ${C.border}`,borderRadius:10,fontSize:13,color:filterResp?C.dark:C.muted,outline:"none",fontFamily:"DM Sans, sans-serif",background:"#fff",cursor:"pointer"}}>
          <option value="">Todos os responsáveis</option>
          {responsaveis.map(r=><option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {filtered.length===0&&(
        <div style={{textAlign:"center",padding:"32px",color:C.muted,fontSize:13}}>
          Nenhum orçamento encontrado para os filtros aplicados.
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(q=>{
          const resp=q.state?.dados?.responsavel||"";
          return(
            <div key={q.id} style={{background:"#fff",borderRadius:14,border:`1.5px solid ${C.mid}`,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:40,height:40,borderRadius:10,background:C.light,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={C.teal} strokeWidth={1.8} strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:13,color:C.dark,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{q.titulo}</p>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontSize:11,color:C.muted}}>{q.data}</span>
                  <span style={{fontSize:11,color:C.border}}>·</span>
                  <span style={{fontSize:11,color:C.muted}}>{q.tipo}</span>
                  <span style={{fontSize:11,color:C.border}}>·</span>
                  <span style={{fontSize:11,fontWeight:600,color:C.teal2}}>{BRL(q.valor)}</span>
                  {resp&&<><span style={{fontSize:11,color:C.border}}>·</span>
                  <span style={{fontSize:11,color:C.muted}}>Resp.: {resp}</span></>}
                </div>
              </div>
              <div style={{display:"flex",gap:8,flexShrink:0}}>
                <button onClick={()=>onLoad(q)} style={{padding:"6px 14px",borderRadius:8,border:`1.5px solid ${C.border}`,background:"#fff",color:C.teal2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Outfit, sans-serif"}}>Abrir</button>
                <button onClick={()=>onDelete(q.id)} style={{padding:"6px 10px",borderRadius:8,border:"1.5px solid #FED7D7",background:"#FFF5F5",color:"#C53030",fontSize:12,cursor:"pointer"}}>✕</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SCENARIO COMPARATOR ──────────────────────────────────────────────────────
function ScenarioComparatorModal({scenarioA,calcA,scenarioB,calcB,settings,onClose}){
  const dtA=DELIVERY_TYPES.find(d=>d.id===scenarioA.deliveryType)?.name||"—";
  const dtB=DELIVERY_TYPES.find(d=>d.id===scenarioB.deliveryType)?.name||"—";
  const cxA=COMPLEXITY.find(c=>c.id===scenarioA.params.complexidade)?.name||"—";
  const cxB=COMPLEXITY.find(c=>c.id===scenarioB.params.complexidade)?.name||"—";
  const lodA=LOD.find(l=>l.id===scenarioA.params.lod)?.name||"—";
  const lodB=LOD.find(l=>l.id===scenarioB.params.lod)?.name||"—";
  const loiA=LOI.find(l=>l.id===scenarioA.params.loi)?.name||"—";
  const loiB=LOI.find(l=>l.id===scenarioB.params.loi)?.name||"—";

  const rows=[
    {label:"Tipo de entrega",    vA:dtA,                        vB:dtB},
    {label:"Complexidade",       vA:cxA,                        vB:cxB},
    {label:"LOD",                vA:lodA,                       vB:lodB},
    {label:"LOI",                vA:loiA,                       vB:loiB},
    {label:"Fator multiplicador",vA:`×${N1(calcA.multiplier)}`, vB:`×${N1(calcB.multiplier)}`},
    {label:"Horas modelagem",    vA:`${N0(calcA.totalModelingHours)}h`, vB:`${N0(calcB.totalModelingHours)}h`},
    {label:"Custo direto",       vA:BRL(calcA.baseCost),        vB:BRL(calcB.baseCost)},
    {label:"Margem",             vA:settings.margemEnabled?BRL(calcA.marginValue):"—", vB:settings.margemEnabled?BRL(calcB.marginValue):"—"},
    {label:"Preço final",        vA:BRL(calcA.finalPrice),      vB:BRL(calcB.finalPrice), bold:true},
  ];

  const handlePDF=()=>{
    const now=new Date().toLocaleDateString("pt-BR");
    const tbl=rows.map(r=>`<tr><td style="padding:8px 12px;border-bottom:1px solid #D4EBE4;color:#567C72;font-size:12px">${r.label}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #D4EBE4;text-align:center;font-size:12px;${r.bold?"font-weight:700;color:#0B3A4F":""}">${r.vA}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #D4EBE4;text-align:center;font-size:12px;${r.bold?"font-weight:700;color:#0B3A4F":""}">${r.vB}</td></tr>`).join("");
    const html=`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Comparativo</title>
    <style>body{font-family:Arial,sans-serif;padding:32px 40px;color:#0B3A4F}h1{font-size:16px}table{width:100%;border-collapse:collapse}
    th{background:#0B3A4F;color:#A8CFBF;padding:8px 12px;font-size:10px;text-transform:uppercase;letter-spacing:.04em}
    @media print{@page{margin:15mm 18mm}}</style></head>
    <body><h1>Comparativo de Cenários</h1>
    <p style="font-size:12px;color:#567C72;margin-bottom:16px">${scenarioA.dados.cliente||"—"} — ${scenarioA.dados.projeto||"—"} · ${now}</p>
    <table><thead><tr><th style="text-align:left">Parâmetro</th><th>Cenário A</th><th>Cenário B</th></tr></thead>
    <tbody>${tbl}</tbody></table>
    <p style="margin-top:24px;font-size:9px;color:#94A3B8">SM&A Sistemas Elétricos e Automação · DEP — Departamento de Engenharia de Projetos · ${VERSION}</p>
    </body></html>`;
    // Use inline CSS injection print for comparator modal (no outer state access)
    const bodyMatch=html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const styleMatches=html.match(/<style[^>]*>[\s\S]*?<\/style>/gi)||[];
    const bodyContent=bodyMatch?bodyMatch[1]:"";
    const styles=styleMatches.map(s=>s.replace(/<\/?style[^>]*>/gi,"")).join("\n");
    const zone=document.createElement("div");zone.id="sma-pz2";zone.innerHTML=bodyContent;document.body.appendChild(zone);
    const css=document.createElement("style");css.id="sma-pc2";
    css.textContent=styles+"\n@media print{body>*:not(#sma-pz2){display:none!important}#sma-pz2{display:block!important;position:static!important}}";
    document.head.appendChild(css);
    setTimeout(()=>{window.print();setTimeout(()=>{try{document.body.removeChild(zone);}catch(e){}try{document.head.removeChild(css);}catch(e){}},1500);},250);
  };

  return(
    <Modal title="Comparação de cenários" onClose={onClose} maxWidth={680}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:16}}>
        {["Parâmetro","Cenário A","Cenário B"].map((h,i)=>(
          <div key={h} style={{padding:"8px 12px",background:i===0?C.bg:C.dark,borderRadius:8,textAlign:i===0?"left":"center"}}>
            <p style={{fontSize:11,fontWeight:700,color:i===0?C.muted:C.sageL,textTransform:"uppercase",letterSpacing:".04em"}}>{h}</p>
          </div>
        ))}
        {rows.map(r=>[
          <div key={r.label+"l"} style={{padding:"8px 12px",background:C.bg,borderRadius:4,display:"flex",alignItems:"center"}}>
            <p style={{fontSize:12,color:C.muted}}>{r.label}</p>
          </div>,
          <div key={r.label+"a"} style={{padding:"8px 12px",background:r.bold?C.light:C.bg,borderRadius:4,textAlign:"center",border:r.bold?`1.5px solid ${C.sage}`:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <p style={{fontSize:12,fontWeight:r.bold?700:500,color:r.bold?C.teal2:C.dark}}>{r.vA}</p>
          </div>,
          <div key={r.label+"b"} style={{padding:"8px 12px",background:r.bold?C.light:C.bg,borderRadius:4,textAlign:"center",border:r.bold?`1.5px solid ${C.sage}`:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <p style={{fontSize:12,fontWeight:r.bold?700:500,color:r.bold?C.teal2:C.dark}}>{r.vB}</p>
          </div>,
        ])}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:10,paddingTop:12,borderTop:`1px solid ${C.mid}`}}>
        <button onClick={onClose} style={{padding:"8px 16px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",color:C.gray,fontSize:13,cursor:"pointer"}}>Fechar</button>
        <button onClick={handlePDF} style={{padding:"8px 18px",borderRadius:10,border:"none",background:C.teal,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Outfit, sans-serif",display:"flex",alignItems:"center",gap:6}}>
          <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round"><path d="M13 7H7M13 10H7M7 13h3M5 4h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"/></svg>
          Exportar PDF comparativo
        </button>
      </div>
    </Modal>
  );
}

// ─── PDF UTILS ────────────────────────────────────────────────────────────────
function PrintPreviewModal({html,onClose}){
  const handlePrint=()=>{
    // Extract body and style blocks from the HTML document string
    const bodyMatch=html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const styleMatches=html.match(/<style[^>]*>[\s\S]*?<\/style>/gi)||[];
    const bodyContent=bodyMatch?bodyMatch[1]:"";
    const styles=styleMatches.map(s=>s.replace(/<\/?style[^>]*>/gi,"")).join("\n");

    // Inject body content into a hidden print zone
    const zone=document.createElement("div");
    zone.id="sma-pz";
    zone.innerHTML=bodyContent;
    document.body.appendChild(zone);

    // Inject combined styles + print isolation CSS
    const css=document.createElement("style");
    css.id="sma-pc";
    css.textContent=styles+"\n@media print{body>*:not(#sma-pz){display:none!important}#sma-pz{display:block!important;position:static!important}}";
    document.head.appendChild(css);

    setTimeout(()=>{
      window.print();
      setTimeout(()=>{
        try{document.body.removeChild(zone);}catch(e){}
        try{document.head.removeChild(css);}catch(e){}
      },1500);
    },250);
  };

  const btnBase={display:"flex",alignItems:"center",gap:6,padding:"9px 18px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"Outfit, sans-serif",border:"none"};
  return(
    <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(11,58,79,.88)",display:"flex",flexDirection:"column"}}>
      {/* toolbar */}
      <div style={{background:"#fff",padding:"12px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0,borderBottom:`1px solid ${C.mid}`}}>
        <div style={{flex:1}}>
          <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:14,color:C.dark,marginBottom:2}}>Pré-visualização do orçamento</p>
          <p style={{fontSize:12,color:C.muted}}>Clique em <strong>Imprimir</strong> → selecione <strong>"Salvar como PDF"</strong> no diálogo do navegador.</p>
        </div>
        <button onClick={handlePrint} style={{...btnBase,background:C.teal,color:"#fff"}}>
          <svg viewBox="0 0 20 20" width={15} height={15} fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round"><path d="M5 7H3a2 2 0 00-2 2v6h4v-4h10v4h4V9a2 2 0 00-2-2h-2M5 7V3h10v4M7 15h6"/></svg>
          Imprimir / Salvar PDF
        </button>
        <button onClick={onClose} style={{...btnBase,background:"#fff",color:C.muted,border:`1.5px solid ${C.border}`}}>Fechar</button>
      </div>
      {/* iframe preview */}
      <div style={{flex:1,overflow:"auto",padding:"24px",display:"flex",justifyContent:"center",alignItems:"flex-start",gap:0}}>
        <iframe
          srcDoc={html}
          style={{width:"210mm",minHeight:"297mm",border:"none",background:"#fff",boxShadow:"0 8px 32px rgba(0,0,0,.35)",borderRadius:4}}
          title="Pré-visualização"
          sandbox="allow-same-origin allow-modals"
        />
      </div>
    </div>
  );
}

function buildPrintHTML(calc,orcamento,settings,desconto){
  const {totalModelingHours,modelingCost,coordHours,coordCost,derivedHours,derivedCost,
    softwareCost,baseCost,margin,finalPrice,marginValue,multiplier,disciplineRows,scalingFactor}=calc;
  const dtLabel=DELIVERY_TYPES.find(d=>d.id===orcamento.deliveryType)?.name||"—";
  const now=new Date().toLocaleDateString("pt-BR");
  const descontoValor=calcDescontoValor(desconto,finalPrice);
  const precoFinal=R(finalPrice-descontoValor,2);
  const discRows=disciplineRows.map(d=>`<tr><td>${d.name}</td><td style="text-align:center">${d.a1}</td><td style="text-align:center">${N1(d.hh)}h</td><td style="text-align:right">${N1(d.hours)}h</td><td style="text-align:right">${BRL(d.cost)}</td></tr>`).join("");
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>Orçamento — ${orcamento.dados.cliente||"Cliente"}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,Helvetica,sans-serif;color:#0B3A4F;padding:32px 40px;font-size:12px;}
.hdr{display:flex;align-items:flex-start;gap:16px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid #3E8B7A;}
.hdr-logo{background:#0B3A4F;padding:8px;border-radius:7px;}
.hdr-logo img{width:64px;display:block;}
.hero{background:#0B3A4F;color:#fff;padding:16px 20px;border-radius:9px;margin-bottom:18px;}
.hero-lbl{font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:#6BAA8C;margin-bottom:3px;}
.hero-val{font-size:26px;font-weight:bold;margin-bottom:10px;}
.hero-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;padding-top:10px;border-top:1px solid rgba(255,255,255,.1);}
.hero-grid div{text-align:center;}
.hero-grid label{font-size:9px;color:#4A7A8A;display:block;}
.hero-grid span{font-size:11px;font-weight:bold;color:#fff;margin-top:1px;display:block;}
h2{font-size:10px;font-weight:bold;color:#3E8B7A;text-transform:uppercase;letter-spacing:.05em;margin:14px 0 6px;}
table{width:100%;border-collapse:collapse;font-size:11px;}
thead tr{background:#0B3A4F;}
thead th{color:#A8CFBF;padding:6px 10px;font-size:9px;text-transform:uppercase;letter-spacing:.04em;}
tbody td{padding:6px 10px;border-bottom:1px solid #D4EBE4;}
.r-total td{background:#E3EDE9;font-weight:bold;}
.r-margin td{background:#EEF6F3;color:#2D6B5C;font-weight:600;}
.r-discount td{background:#FFF5F5;color:#C53030;font-weight:600;}
.r-final td{background:#3E8B7A;color:#fff;font-weight:bold;font-size:12px;padding:9px 10px;}
.footer{margin-top:20px;padding-top:9px;border-top:1px solid #D4EBE4;font-size:9px;color:#567C72;display:flex;justify-content:space-between;}
@media print{@page{margin:15mm 18mm}body{padding:0}}
</style></head><body>
<div class="hdr">
  <div class="hdr-logo"><img src="${LOGO_B64}"></div>
  <div>
    <h1 style="font-size:15px;font-weight:bold;margin-bottom:4px">Orçamento de Serviços de Engenharia Digital</h1>
    <p style="font-size:11px;color:#567C72">${orcamento.dados.cliente||"—"} &nbsp;|&nbsp; ${orcamento.dados.projeto||"—"}</p>
    <p style="font-size:11px;color:#567C72">Elaborado por: ${orcamento.dados.responsavel||"—"} &nbsp;|&nbsp; Data: ${now}</p>
  </div>
</div>
<div class="hero">
  <div class="hero-lbl">Valor total para serviços de engenharia digital</div>
  <div class="hero-val">${BRL(precoFinal)}</div>
  <div class="hero-grid">
    <div><label>Horas modelagem</label><span>${N0(totalModelingHours)}h</span></div>
    <div><label>Tipo de entrega</label><span>${dtLabel}</span></div>
    <div><label>Fator mult.</label><span>×${N1(multiplier)}</span></div>
    <div><label>Escalonamento</label><span>${scalingFactor<1?`×${N2(scalingFactor)}`:"—"}</span></div>
  </div>
</div>
<h2>Composição do custo</h2>
<table><thead><tr>
  <th style="text-align:left">Componente</th><th style="text-align:right">Horas</th><th style="text-align:right">Custo</th>
</tr></thead><tbody>
  <tr><td>Modelagem 3D</td><td style="text-align:right">${N0(totalModelingHours)}h</td><td style="text-align:right">${BRL(modelingCost)}</td></tr>
  ${coordHours>0?`<tr><td>Coordenação BIM</td><td style="text-align:right">${N1(coordHours)}h</td><td style="text-align:right">${BRL(coordCost)}</td></tr>`:""}
  ${derivedHours>0?`<tr><td>Entregáveis derivados</td><td style="text-align:right">${N1(derivedHours)}h</td><td style="text-align:right">${BRL(derivedCost)}</td></tr>`:""}
  <tr><td>Licença de software</td><td style="text-align:right">—</td><td style="text-align:right">${BRL(softwareCost)}</td></tr>
  <tr class="r-total"><td colspan="2" style="text-align:right">Custo direto total</td><td style="text-align:right">${BRL(baseCost)}</td></tr>
  ${settings.margemEnabled?`<tr class="r-margin"><td colspan="2" style="text-align:right">Margem (${margin}%)</td><td style="text-align:right">+ ${BRL(marginValue)}</td></tr>`:""}
  ${descontoValor>0?`<tr class="r-discount"><td colspan="2" style="text-align:right">Desconto comercial ${desconto.tipo==="pct"?"("+N1(desconto.valor)+"%)":""}</td><td style="text-align:right">− ${BRL(descontoValor)}</td></tr>`:""}
  <tr class="r-final"><td colspan="2" style="text-align:right">${settings.margemEnabled?"Preço final ao cliente":"Custo total (sem margem)"}</td><td style="text-align:right">${BRL(precoFinal)}</td></tr>
</tbody></table>
<h2>Detalhamento por disciplina</h2>
<table><thead><tr>
  <th style="text-align:left">Disciplina</th><th style="text-align:center">A1</th><th style="text-align:center">HH/A1</th><th style="text-align:right">Horas</th><th style="text-align:right">Custo</th>
</tr></thead><tbody>${discRows}</tbody></table>
${orcamento.dados.obs?`<h2>Observações</h2><p style="font-size:11px;color:#334155;line-height:1.6;background:#F2F7F6;padding:10px 12px;border-radius:6px">${orcamento.dados.obs}</p>`:""}
<div class="footer">
  <span>SM&amp;A Sistemas Elétricos e Automação &nbsp;|&nbsp; DEP — Departamento de Engenharia de Projetos</span>
  <span>${VERSION} &nbsp;|&nbsp; sma-eng.com.br</span>
</div></body></html>`;
}

function calcDescontoValor(desconto,finalPrice){
  if(!desconto.enabled||desconto.valor<=0) return 0;
  return desconto.tipo==="pct" ? R(finalPrice*desconto.valor/100,2) : Math.min(desconto.valor,finalPrice);
}

// ─── WIZARD STEPS ────────────────────────────────────────────────────────────
function Step1({data,onChange}){
  const set=k=>v=>onChange({...data,[k]:v});
  const fld=(label,key,ph)=>(
    <div>
      <label style={{display:"block",fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>{label}</label>
      <TextInput value={data[key]} onChange={set(key)} placeholder={ph}/>
    </div>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <StepHeader title="Dados do orçamento" desc="Identificação do projeto e responsável pelo orçamento"/>
      {fld("Nome do cliente","cliente","Ex: Gerdau S.A.")}
      {fld("Nome / código do projeto","projeto","Ex: Modernização Sala Elétrica SE-03")}
      <div>
        <label style={{display:"block",fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Elaborado por</label>
        <div style={{padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:10,fontSize:14,background:C.bg,color:C.muted,cursor:"not-allowed",userSelect:"none",textAlign:"right"}}>
          {data.responsavel||"—"}
        </div>
        <p style={{fontSize:11,color:C.border,marginTop:4}}>Campo preenchido automaticamente com o usuário logado.</p>
      </div>
      <div>
        <label style={{display:"block",fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Observações <span style={{fontSize:10,fontWeight:400,textTransform:"none",color:C.border}}>(opcional)</span></label>
        <textarea value={data.obs} onChange={e=>set("obs")(e.target.value)} rows={3} placeholder="Contexto adicional do projeto..."
          style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:10,fontSize:14,resize:"none",outline:"none",fontFamily:"DM Sans, sans-serif",color:C.text,boxSizing:"border-box"}}/>
      </div>
    </div>
  );
}

function Step2({data,onChange,settings}){
  const toggle=id=>onChange(data.map(d=>d.id===id?{...d,active:!d.active}:d));
  const setA1=(id,v)=>onChange(data.map(d=>d.id===id?{...d,a1:Math.max(1,v)}:d));
  const totalA1=data.filter(d=>d.active).reduce((s,d)=>s+d.a1,0);
  const sf=calcBlendedFactor(totalA1,settings.escalonamento);
  const breakdown=calcScalingBreakdown(totalA1,settings.escalonamento);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <StepHeader title="Disciplinas" desc="Selecione as disciplinas no escopo e estime os formatos A1 equivalentes"/>
      {data.map(d=>(
        <div key={d.id} style={{borderRadius:12,border:`1.5px solid ${d.active?C.sage:C.border}`,background:d.active?C.light:"#fff",transition:"all .15s"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px"}}>
            <Checkbox checked={d.active} onChange={()=>toggle(d.id)}/>
            <span style={{flex:1,fontSize:13,fontWeight:500,color:d.active?C.text:C.gray}}>{d.name}</span>
            {d.active&&(
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:11,color:C.muted}}>Qtd. A1</span>
                <NumInput value={d.a1} onChange={v=>setA1(d.id,v)} min={1} step={1} width={68} center/>
              </div>
            )}
          </div>
        </div>
      ))}
      <div style={{marginTop:4,padding:"12px 16px",background:C.mid,borderRadius:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:13,color:C.muted}}>Total de formatos A1 em escopo</span>
        <span style={{fontSize:20,fontWeight:700,fontFamily:"Outfit, sans-serif",color:C.dark}}>{N0(totalA1)} A1</span>
      </div>
      {settings.escalonamento.enabled&&sf<1.0&&breakdown.length>0&&(
        <div style={{padding:"12px 16px",background:"#fff",borderRadius:12,border:`1.5px solid ${C.sage}`}}>
          <p style={{fontSize:11,fontWeight:700,color:C.teal,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Escalonamento aplicado</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
            {breakdown.map(b=>(
              <div key={b.label} style={{padding:"5px 10px",borderRadius:8,background:C.light,border:`1px solid ${C.mid}`}}>
                <span style={{fontSize:12,color:C.text}}>{b.label}: </span>
                <span style={{fontSize:12,fontWeight:600,color:C.teal}}>×{N2(b.fator)}</span>
                <span style={{fontSize:11,color:C.muted}}> ({b.count} A1)</span>
              </div>
            ))}
          </div>
          <p style={{fontSize:12,color:C.muted}}>
            Fator blended resultante: <strong style={{color:C.teal2}}>×{N2(sf)}</strong>
            <span style={{marginLeft:8,color:C.border}}>— redução de {N1((1-sf)*100)}% nas horas</span>
          </p>
        </div>
      )}
    </div>
  );
}

function Step3({data,onChange}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <StepHeader title="Tipo de entrega" desc="O tipo de entrega define os níveis de LOD e LOI disponíveis no próximo passo"/>
      {DELIVERY_TYPES.map(dt=>{
        const active=data===dt.id;
        return(
          <button key={dt.id} onClick={()=>onChange(dt.id)} style={{textAlign:"left",padding:"18px 20px",borderRadius:14,border:`2px solid ${active?C.teal:C.border}`,background:active?C.light:"#fff",cursor:"pointer",transition:"all .15s"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
              <div style={{width:18,height:18,borderRadius:9,border:`2px solid ${active?C.teal:C.border}`,background:active?C.teal:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                {active&&<div style={{width:8,height:8,borderRadius:4,background:"#fff"}}/>}
              </div>
              <div style={{flex:1}}>
                <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:15,color:C.dark,marginBottom:5}}>{dt.name}</p>
                <p style={{fontSize:13,color:C.muted,marginBottom:10,lineHeight:1.5}}>{dt.desc}</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {dt.allowedLOD.map(l=><Tag key={l} color="teal">{LOD.find(x=>x.id===l)?.name}</Tag>)}
                  {dt.allowedLOI.map(l=><Tag key={l} color="purple">{LOI.find(x=>x.id===l)?.name}</Tag>)}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Step4({data,onChange,deliveryType,settings}){
  const dt=DELIVERY_TYPES.find(d=>d.id===deliveryType);
  const availLOD=LOD.filter(l=>dt?.allowedLOD.includes(l.id));
  const availLOI=LOI.filter(l=>dt?.allowedLOI.includes(l.id));
  const mult=R((settings.complexityX[data.complexidade]||0)*(settings.lodX[data.lod]||0)*(settings.loiX[data.loi]||0),3);
  const selCard=(label,m,desc,active,onClick,color)=>(
    <button onClick={onClick} style={{textAlign:"left",padding:"12px 14px",borderRadius:12,border:`2px solid ${active?color:C.border}`,background:active?`${color}18`:"#fff",cursor:"pointer",transition:"all .15s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:desc?4:0}}>
        <span style={{fontWeight:700,fontSize:13,color:C.dark,fontFamily:"Outfit, sans-serif"}}>{label}</span>
        <span style={{fontSize:11,padding:"2px 7px",borderRadius:6,fontFamily:"monospace",fontWeight:700,background:active?color:C.light,color:active?"#fff":C.muted}}>×{N1(m)}</span>
      </div>
      {desc&&<p style={{fontSize:12,color:C.muted,lineHeight:1.4}}>{desc}</p>}
    </button>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <StepHeader title="Parâmetros de qualidade" desc="Define o fator multiplicador do esforço de modelagem"/>
      <div><SectionLabel>Nível de complexidade</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {COMPLEXITY.map(c=>selCard(c.name,settings.complexityX[c.id]??c.x,c.desc,data.complexidade===c.id,()=>onChange({...data,complexidade:c.id}),C.teal))}
        </div>
      </div>
      <div><SectionLabel>LOD — nível de desenvolvimento</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {availLOD.map(l=>selCard(l.name,settings.lodX[l.id]??l.x,l.sub,data.lod===l.id,()=>onChange({...data,lod:l.id}),"#3B5BA5"))}
        </div>
      </div>
      <div><SectionLabel>LOI — nível de informação</SectionLabel>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {availLOI.map(l=>selCard(l.name,settings.loiX[l.id]??l.x,l.desc,data.loi===l.id,()=>onChange({...data,loi:l.id}),"#7C3AED"))}
        </div>
      </div>
      <div style={{padding:"14px 18px",borderRadius:14,background:C.dark,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:13,color:C.sageL}}>Fator multiplicador resultante</span>
        <span style={{fontFamily:"Outfit, sans-serif",fontWeight:800,fontSize:28,color:mult>0?C.sage:"#475569"}}>{mult>0?`×${N1(mult)}`:"—"}</span>
      </div>
    </div>
  );
}

function Step5({data,onChange,totalA1,disciplines}){
  // Count active disciplines for initial qty defaults
  const activeDisciplinesCount=(disciplines||[]).filter(d=>d.active).length;
  // BOM excludes "arranjo_sala" from the count
  const activeDisciplinesForBOM=(disciplines||[]).filter(d=>d.active&&d.id!=="arranjo_sala").length;

  const toggle=id=>{
    const exists=data.find(x=>x.id===id);
    if(exists){onChange(data.filter(x=>x.id!==id));}
    else{
      let initialQty=1;
      if(id==="documentacao")  initialQty=Math.max(1,totalA1);
      else if(id==="bom")      initialQty=Math.max(1,activeDisciplinesForBOM);
      else if(id==="clash")    initialQty=Math.max(1,activeDisciplinesCount);
      else if(id==="federado") initialQty=Math.max(1,activeDisciplinesCount);
      onChange([...data,{id,qty:initialQty}]);
    }
  };
  const setQty=(id,qty)=>onChange(data.map(x=>x.id===id?{...x,qty:Math.max(1,qty)}:x));
  const isOn=id=>!!data.find(x=>x.id===id);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <StepHeader title="Entregáveis derivados" desc="Documentação e extrações geradas a partir do modelo 3D"/>
      {DERIVED.map(del=>{
        const active=isOn(del.id);
        const item=data.find(x=>x.id===del.id);
        return(
          <div key={del.id} style={{borderRadius:12,border:`1.5px solid ${active?C.sage:C.border}`,background:active?C.light:"#fff",transition:"all .15s"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px"}}>
              <Checkbox checked={active} onChange={()=>toggle(del.id)}/>
              <span style={{flex:1,fontSize:13,fontWeight:500,color:active?C.text:C.gray}}>{del.name}</span>
              {active&&(
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:11,color:C.muted}}>Qtd. ({del.unit})</span>
                  <NumInput value={item?.qty||1} onChange={v=>setQty(del.id,v)} min={1} step={1} width={72} center/>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {data.length===0&&<p style={{fontSize:12,color:C.border,textAlign:"center",padding:"10px 0"}}>Nenhum entregável selecionado — apenas o modelo 3D será orçado.</p>}
    </div>
  );
}

function Step6({data,onChange,settings,totalModelingHours}){
  const coordHours=data.enabled?R(totalModelingHours*(data.pct/100),2):0;
  const coordCost=R(coordHours*settings.hhCoordenador,2);
  return(
    <div>
      <StepHeader title="Coordenação BIM" desc="Horas de gestão técnica, revisão e compatibilização de disciplinas"/>
      <div style={{borderRadius:14,border:`2px solid ${data.enabled?C.sage:C.border}`,background:data.enabled?C.light:"#fff",transition:"all .2s"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px"}}>
          <div>
            <p style={{fontWeight:600,fontSize:14,color:C.dark}}>Incluir coordenação BIM</p>
            <p style={{fontSize:13,color:C.muted,marginTop:3}}>Gestão técnica, revisões e compatibilização entre disciplinas</p>
          </div>
          <Toggle on={data.enabled} onChange={v=>onChange({...data,enabled:v})}/>
        </div>
        {data.enabled&&(
          <div style={{padding:"0 18px 18px",borderTop:`1px solid ${C.mid}`}}>
            <div style={{paddingTop:14,display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <p style={{fontSize:12,color:C.muted}}>% sobre horas de modelagem</p>
                  <span style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:20,color:C.teal}}>{data.pct}%</span>
                </div>
                <input type="range" min={5} max={35} step={1} value={data.pct} onChange={e=>onChange({...data,pct:parseInt(e.target.value)})} style={{width:"100%",accentColor:C.teal}}/>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,color:C.border}}>5%</span><span style={{fontSize:11,color:C.border}}>35%</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                {[{label:"Horas modelagem",value:`${N0(totalModelingHours)}h`},{label:"Horas coordenação",value:`${N1(coordHours)}h`,hi:true},{label:"Custo coordenação",value:BRL(coordCost)}].map(({label,value,hi})=>(
                  <div key={label} style={{padding:"10px 12px",borderRadius:10,background:hi?C.mid:C.bg,border:`1px solid ${C.border}`}}>
                    <p style={{fontSize:11,color:C.muted,marginBottom:4}}>{label}</p>
                    <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:15,color:hi?C.teal:C.dark}}>{value}</p>
                  </div>
                ))}
              </div>
              <p style={{fontSize:11,color:C.border}}>HH Coordenador: {BRL(settings.hhCoordenador)}/h</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Step7({calc,orcamento,settings,desconto,onDescontoChange,scenarioA,onSaveScenario,onCompare,onSaveQuote}){
  const {totalModelingHours,modelingCost,coordHours,coordCost,derivedHours,derivedCost,
    softwareCost,baseCost,margin,finalPrice,marginValue,multiplier,disciplineRows,scalingFactor}=calc;
  const dtLabel=DELIVERY_TYPES.find(d=>d.id===orcamento.deliveryType)?.name||"—";
  const descontoValor=calcDescontoValor(desconto,finalPrice);
  const precoComDesconto=R(finalPrice-descontoValor,2);

  const costRow=(label,hours,cost,bg,brd)=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderRadius:10,background:bg,border:`1px solid ${brd}`}}>
      <div><span style={{fontSize:13,color:C.text}}>{label}</span>
        {hours!=null&&<span style={{fontSize:12,color:C.muted,marginLeft:6}}>({N0(hours)}h)</span>}
      </div>
      <span style={{fontWeight:600,fontSize:14,color:C.dark}}>{BRL(cost)}</span>
    </div>
  );

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <StepHeader title="Resultado" desc={`Orçamento para ${orcamento.dados.cliente||"o cliente"}`}/>
      {/* Hero */}
      <div style={{borderRadius:18,padding:"24px 26px 20px",background:C.dark,color:"#fff"}}>
        <p style={{fontSize:12,color:C.sageL,marginBottom:8}}>{orcamento.dados.cliente||"Cliente"} — {orcamento.dados.projeto||"Projeto"}</p>
        <p style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Valor total para serviços de engenharia digital</p>
        <p style={{fontFamily:"Outfit, sans-serif",fontWeight:800,fontSize:36,color:"#fff",marginBottom:14}}>{BRL(precoComDesconto)}</p>
        <div style={{paddingTop:14,borderTop:"1px solid rgba(255,255,255,.1)",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
          {[
            {label:"Horas modelagem",  value:`${N0(totalModelingHours)}h`},
            {label:"Tipo de entrega",  value:dtLabel},
            {label:"Fator mult.",      value:`×${N1(multiplier)}`},
            {label:"Escalonamento",    value:scalingFactor<1?`×${N2(scalingFactor)}`:"—"},
          ].map(({label,value})=>(
            <div key={label} style={{textAlign:"center"}}>
              <p style={{fontSize:11,color:C.muted}}>{label}</p>
              <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:13,color:"#fff",marginTop:3}}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown */}
      <div>
        <SectionLabel>Composição do custo</SectionLabel>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {costRow("Modelagem 3D",totalModelingHours,modelingCost,C.bg,C.border)}
          {coordHours>0&&costRow("Coordenação BIM",coordHours,coordCost,"#EBF3FF","#B9D4F7")}
          {derivedHours>0&&costRow("Entregáveis derivados",derivedHours,derivedCost,"#F0EBF8","#C4AFF0")}
          {costRow("Licença de software",null,softwareCost,C.bg,C.border)}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderRadius:10,background:C.mid,border:`1.5px solid ${C.border}`}}>
            <span style={{fontWeight:600,fontSize:13,color:C.muted}}>Custo direto total</span>
            <span style={{fontWeight:700,fontSize:15,color:C.dark}}>{BRL(baseCost)}</span>
          </div>
          {settings.margemEnabled&&(
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderRadius:10,background:C.light,border:`1.5px solid ${C.sage}`}}>
              <span style={{fontWeight:600,fontSize:13,color:C.teal2}}>Margem ({margin}%)</span>
              <span style={{fontWeight:700,fontSize:15,color:C.teal2}}>+ {BRL(marginValue)}</span>
            </div>
          )}
          {descontoValor>0&&(
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderRadius:10,background:"#FFF5F5",border:"1.5px solid #FED7D7"}}>
              <span style={{fontWeight:600,fontSize:13,color:"#C53030"}}>Desconto comercial {desconto.tipo==="pct"?`(${N1(desconto.valor)}%)`:""}</span>
              <span style={{fontWeight:700,fontSize:15,color:"#C53030"}}>− {BRL(descontoValor)}</span>
            </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",borderRadius:12,background:C.teal}}>
            <span style={{fontWeight:700,fontSize:14,color:"#fff"}}>{settings.margemEnabled?"Preço final ao cliente":"Custo total (sem margem)"}</span>
            <span style={{fontFamily:"Outfit, sans-serif",fontWeight:800,fontSize:22,color:"#fff"}}>{BRL(precoComDesconto)}</span>
          </div>
        </div>
      </div>

      {/* Desconto comercial */}
      <div style={{borderRadius:14,border:`2px solid ${desconto.enabled?"#FED7D7":C.border}`,background:desconto.enabled?"#FFF5F5":"#fff",transition:"all .2s"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px"}}>
          <div>
            <p style={{fontWeight:600,fontSize:14,color:C.dark}}>Desconto comercial</p>
            <p style={{fontSize:12,color:C.muted,marginTop:2}}>Aplicado sobre o preço final, separado da margem</p>
          </div>
          <Toggle on={desconto.enabled} onChange={v=>onDescontoChange({...desconto,enabled:v})}/>
        </div>
        {desconto.enabled&&(
          <div style={{padding:"0 18px 16px",borderTop:"1px solid #FED7D7"}}>
            <div style={{paddingTop:14,display:"flex",gap:12,alignItems:"flex-end"}}>
              <div>
                <p style={{fontSize:11,color:C.muted,marginBottom:6}}>Tipo</p>
                <div style={{display:"flex",gap:6}}>
                  {[["pct","Percentual (%)"],["valor","Valor fixo (R$)"]].map(([t,l])=>(
                    <button key={t} onClick={()=>onDescontoChange({...desconto,tipo:t,valor:0})}
                      style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${desconto.tipo===t?"#C53030":C.border}`,background:desconto.tipo===t?"#FFF5F5":"#fff",color:desconto.tipo===t?"#C53030":C.gray,fontSize:12,cursor:"pointer"}}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:11,color:C.muted,marginBottom:6}}>{desconto.tipo==="pct"?"Percentual":"Valor"}</p>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <input type="number" value={desconto.valor} min={0} max={desconto.tipo==="pct"?100:999999} step={desconto.tipo==="pct"?0.5:100}
                    onChange={e=>onDescontoChange({...desconto,valor:parseFloat(e.target.value)||0})}
                    style={{flex:1,padding:"8px 10px",border:"1.5px solid #FED7D7",borderRadius:8,fontSize:14,outline:"none",fontFamily:"DM Sans, sans-serif"}}/>
                  <span style={{fontSize:13,color:"#C53030",fontWeight:600,minWidth:24}}>{desconto.tipo==="pct"?"%":"R$"}</span>
                </div>
              </div>
              <div style={{padding:"8px 14px",borderRadius:10,background:"#FEE2E2",border:"1px solid #FED7D7"}}>
                <p style={{fontSize:11,color:"#9B1C1C",marginBottom:2}}>Desconto</p>
                <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:16,color:"#C53030"}}>− {BRL(descontoValor)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Discipline table */}
      <div>
        <SectionLabel>Detalhamento por disciplina</SectionLabel>
        <div style={{borderRadius:12,border:`1.5px solid ${C.mid}`,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:C.dark}}>
              {["Disciplina","A1","HH/A1","Horas","Custo"].map((h,i)=>(
                <th key={h} style={{padding:"9px 12px",textAlign:i===0?"left":"right",fontSize:11,fontWeight:700,color:C.sageL,textTransform:"uppercase",letterSpacing:".04em"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {disciplineRows.map((d,i)=>(
                <tr key={d.id} style={{background:i%2===0?"#fff":C.bg,borderTop:`1px solid ${C.mid}`}}>
                  <td style={{padding:"8px 12px",color:C.text}}>{d.name}</td>
                  <td style={{padding:"8px 12px",textAlign:"right",color:C.muted}}>{d.a1}</td>
                  <td style={{padding:"8px 12px",textAlign:"right",color:C.muted}}>{N1(d.hh)}h</td>
                  <td style={{padding:"8px 12px",textAlign:"right",fontWeight:600,color:C.dark}}>{N1(d.hours)}h</td>
                  <td style={{padding:"8px 12px",textAlign:"right",fontWeight:600,color:C.dark}}>{BRL(d.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scenarios */}
      <div style={{padding:"14px 18px",borderRadius:14,background:C.bg,border:`1.5px solid ${C.mid}`}}>
        <p style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:4}}>Comparação de cenários</p>
        <p style={{fontSize:12,color:C.muted,marginBottom:12}}>
          {scenarioA?"Cenário A salvo. Ajuste parâmetros e use \"Comparar cenários\" para ver as diferenças.":"Salve este resultado como Cenário A, ajuste um parâmetro e compare os resultados."}
        </p>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onSaveScenario} style={{padding:"7px 14px",borderRadius:9,border:`1.5px solid ${C.border}`,background:"#fff",color:C.teal2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Outfit, sans-serif"}}>
            {scenarioA?"↻ Substituir Cenário A":"Salvar como Cenário A"}
          </button>
          {scenarioA&&(
            <button onClick={onCompare} style={{padding:"7px 14px",borderRadius:9,border:"none",background:C.teal,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Outfit, sans-serif"}}>
              Comparar cenários →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN VIEW ──────────────────────────────────────────────────────────────
function LoginView({onLogin}){
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]     =useState("");
  const [loading,setLoading] =useState(false);
  const [showPwd,setShowPwd] =useState(false);

  const handleSubmit=async()=>{
    if(!username.trim()||!password.trim()){setError("Preencha usuário e senha.");return;}
    setLoading(true);setError("");
    try{
      const {data,error}=await supabase
        .from("users")
        .select("*")
        .eq("username",username.trim().toLowerCase())
        .eq("active",true)
        .single();
      if(error||!data){ setError("Usuário ou senha incorretos."); }
      else if(!checkPwd(password,data.password)){ setError("Usuário ou senha incorretos."); }
      else{ onLogin(data); }
    }catch(e){ setError("Erro ao verificar credenciais."); }
    setLoading(false);
  };

  const iStyle={width:"100%",padding:"10px 12px",border:`1.5px solid ${C.border}`,borderRadius:10,fontSize:14,outline:"none",fontFamily:"DM Sans, sans-serif",color:C.text,boxSizing:"border-box",background:"#fff"};

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:C.dark,padding:20}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input:focus{outline:none;border-color:${C.teal}!important;box-shadow:0 0 0 3px ${C.teal}22;}`}</style>
      {/* Logo */}
      <div style={{marginBottom:32,textAlign:"center"}}>
        <img src={LOGO_B64} alt="SM&A" style={{width:120,mixBlendMode:"screen",display:"block",margin:"0 auto 12px"}}/>
        <p style={{fontSize:12,color:C.sage,letterSpacing:".06em",textTransform:"uppercase"}}>Precificação · Engenharia Digital</p>
      </div>
      {/* Card */}
      <div style={{background:"#fff",borderRadius:20,padding:"32px 36px",width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,.4)"}}>
        <p style={{fontFamily:"Outfit, sans-serif",fontWeight:800,fontSize:22,color:C.dark,marginBottom:4}}>Acesso ao sistema</p>
        <p style={{fontSize:13,color:C.muted,marginBottom:24}}>Insira suas credenciais para continuar.</p>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Usuário</label>
            <input type="text" value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} placeholder="nome.sobrenome" autoComplete="username" style={iStyle}/>
          </div>
          <div>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Senha</label>
            <div style={{position:"relative"}}>
              <input type={showPwd?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} placeholder="••••••••" autoComplete="current-password" style={{...iStyle,paddingRight:40}}/>
              <button onClick={()=>setShowPwd(v=>!v)} type="button" style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.muted,padding:2}}>
                {showPwd
                  ? <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M17.94 10C16.73 7.61 13.52 5 10 5s-6.73 2.61-7.94 5c1.21 2.39 4.42 5 7.94 5s6.73-2.61 7.94-5z"/><circle cx="10" cy="10" r="2.5"/><line x1="3" y1="3" x2="17" y2="17"/></svg>
                  : <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M17.94 10C16.73 7.61 13.52 5 10 5s-6.73 2.61-7.94 5c1.21 2.39 4.42 5 7.94 5s6.73-2.61 7.94-5z"/><circle cx="10" cy="10" r="2.5"/></svg>
                }
              </button>
            </div>
          </div>
          {error&&<p style={{fontSize:12,color:"#C53030",background:"#FFF5F5",padding:"8px 12px",borderRadius:8,border:"1px solid #FED7D7"}}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading}
            style={{padding:"11px",borderRadius:10,border:"none",background:loading?C.border:C.teal,color:"#fff",fontSize:14,fontWeight:700,cursor:loading?"default":"pointer",fontFamily:"Outfit, sans-serif",marginTop:4,transition:"background .2s"}}>
            {loading?"Verificando…":"Entrar"}
          </button>
        </div>

      </div>
      <p style={{fontSize:11,color:"#2A5A6E",marginTop:24}}>{VERSION} · DEP — Departamento de Engenharia de Projetos</p>
    </div>
  );
}

// ─── ADMIN VIEW ───────────────────────────────────────────────────────────────
function AdminView({currentUser,onClose}){
  const [users,setUsers]       =useState([]);
  const [loading,setLoading]   =useState(true);
  const [form,setForm]         =useState({name:"",username:"",password:"",role:"user"});
  const [formError,setFormError]=useState("");
  const [pwdEdit,setPwdEdit]   =useState({});
  const [pwdShow,setPwdShow]   =useState({});
  const [delConfirm,setDelConfirm]=useState(null);
  const [saveMsg,setSaveMsg]   =useState("");

  const loadUsers=async()=>{
    setLoading(true);
    const{data,error}=await supabase.from("users").select("*").order("created_at");
    if(!error) setUsers(data||[]);
    setLoading(false);
  };
  useEffect(()=>{ loadUsers(); },[]);

  const flash=msg=>{ setSaveMsg(msg); setTimeout(()=>setSaveMsg(""),2200); };

  const handleAdd=async()=>{
    if(!form.name.trim()||!form.username.trim()||!form.password.trim()){setFormError("Preencha todos os campos.");return;}
    if(users.find(u=>u.username.toLowerCase()===form.username.trim().toLowerCase())){setFormError("Nome de usuário já existe.");return;}
    const nu={id:Date.now().toString(),name:form.name.trim(),username:form.username.trim().toLowerCase(),password:hashPwd(form.password),role:form.role,active:true,created_at:new Date().toISOString()};
    const{error}=await supabase.from("users").insert(nu);
    if(!error){ setUsers(p=>[...p,nu]); setForm({name:"",username:"",password:"",role:"user"}); setFormError(""); flash("Usuário cadastrado!"); }
    else{ setFormError("Erro ao cadastrar: "+error.message); }
  };

  const handleToggle=async(id)=>{
    const u=users.find(x=>x.id===id);
    const{error}=await supabase.from("users").update({active:!u.active}).eq("id",id);
    if(!error){ setUsers(p=>p.map(x=>x.id===id?{...x,active:!x.active}:x)); flash("Atualizado!"); }
  };

  const handleDelete=async(id)=>{
    if(id==="1"){setDelConfirm(null);return;}
    const{error}=await supabase.from("users").delete().eq("id",id);
    if(!error){ setUsers(p=>p.filter(u=>u.id!==id)); setDelConfirm(null); flash("Usuário removido!"); }
  };

  const handleChangePwd=async(id)=>{
    const np=pwdEdit[id]||"";
    if(np.length<4){alert("Senha mínima de 4 caracteres.");return;}
    const{error}=await supabase.from("users").update({password:hashPwd(np)}).eq("id",id);
    if(!error){ setUsers(p=>p.map(u=>u.id===id?{...u,password:hashPwd(np)}:u)); setPwdEdit(p=>({...p,[id]:""})); flash("Senha alterada!"); }
  };

  const iBase={padding:"7px 10px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,outline:"none",fontFamily:"DM Sans, sans-serif",width:"100%",boxSizing:"border-box"};
  const roles={"admin":"Administrador","user":"Usuário"};
  const roleBadge=(role,active)=>(
    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6,
      background:!active?"#F1F5F9":role==="admin"?`${C.teal}22`:"#EFF6FF",
      color:!active?C.border:role==="admin"?C.teal2:"#1D4ED8"}}>
      {active?roles[role]||role:"Inativo"}
    </span>
  );

  return(
    <Modal title="Gerenciar usuários" onClose={onClose} maxWidth={780}>
      {loading&&<p style={{textAlign:"center",color:C.muted,padding:20}}>Carregando…</p>}
      {!loading&&(
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          {saveMsg&&<div style={{padding:"8px 14px",background:C.light,borderRadius:8,border:`1px solid ${C.sage}`,color:C.teal2,fontSize:13,fontWeight:600}}>{saveMsg}</div>}

          {/* User table */}
          <div>
            <SectionLabel>Usuários cadastrados</SectionLabel>
            <div style={{borderRadius:12,border:`1.5px solid ${C.mid}`,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr style={{background:C.dark}}>
                  {["Nome","Usuário","Perfil","Ações"].map((h,i)=>(
                    <th key={h} style={{padding:"8px 12px",textAlign:i<3?"left":"right",fontSize:10,fontWeight:700,color:C.sageL,textTransform:"uppercase",letterSpacing:".04em"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {users.map((u,i)=>(
                    <tr key={u.id} style={{background:i%2===0?"#fff":C.bg,borderTop:`1px solid ${C.mid}`,opacity:u.active?1:.55}}>
                      <td style={{padding:"8px 12px",fontWeight:600,color:C.dark}}>{u.name}{u.id===currentUser.id&&<span style={{fontSize:10,color:C.muted,marginLeft:6,fontWeight:400}}>(você)</span>}</td>
                      <td style={{padding:"8px 12px",color:C.muted,fontFamily:"monospace"}}>{u.username}</td>
                      <td style={{padding:"8px 12px"}}>
                        <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6,background:!u.active?"#F1F5F9":u.role==="admin"?`${C.teal}22`:"#EFF6FF",color:!u.active?C.border:u.role==="admin"?C.teal2:"#1D4ED8"}}>
                          {u.active?(roles[u.role]||u.role):"Inativo"}
                        </span>
                      </td>
                      <td style={{padding:"8px 12px"}}>
                        <div style={{display:"flex",gap:8,justifyContent:"flex-end",alignItems:"center"}}>
                          {/* Password change group */}
                          <div style={{display:"flex",gap:4,alignItems:"center"}}>
                            <input type={pwdShow[u.id]?"text":"password"} placeholder="Nova senha" value={pwdEdit[u.id]||""}
                              onChange={e=>setPwdEdit(p=>({...p,[u.id]:e.target.value}))}
                              style={{...iBase,width:110,fontSize:12,padding:"4px 8px"}}/>
                            <button onClick={()=>setPwdShow(p=>({...p,[u.id]:!p[u.id]}))} style={{padding:"4px 6px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontSize:10,color:C.muted,flexShrink:0}}>{pwdShow[u.id]?"👁":"👁"}</button>
                            <button onClick={()=>handleChangePwd(u.id)} disabled={!pwdEdit[u.id]}
                              style={{padding:"4px 10px",background:pwdEdit[u.id]?C.teal:C.border,color:"#fff",border:"none",borderRadius:6,cursor:pwdEdit[u.id]?"pointer":"default",fontSize:11,fontWeight:600,flexShrink:0,whiteSpace:"nowrap"}}>Alterar</button>
                          </div>
                          {/* Status + remove group — fixed width so all rows align */}
                          <div style={{display:"flex",gap:4,alignItems:"center",minWidth:150,justifyContent:"flex-end"}}>
                            <button onClick={()=>handleToggle(u.id)} disabled={u.id==="1"}
                              style={{padding:"4px 10px",background:u.active?"#FEF9C3":"#F0FDF4",color:u.active?"#854D0E":"#166534",border:`1px solid ${u.active?"#FDE68A":"#BBF7D0"}`,borderRadius:6,cursor:u.id==="1"?"default":"pointer",fontSize:11,fontWeight:600,flexShrink:0,whiteSpace:"nowrap"}}>
                              {u.active?"Desativar":"Ativar"}
                            </button>
                            {u.id!=="1"
                              ? (delConfirm===u.id
                                  ? <><button onClick={()=>handleDelete(u.id)} style={{padding:"4px 10px",background:"#C53030",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>Confirmar</button>
                                      <button onClick={()=>setDelConfirm(null)} style={{padding:"4px 8px",background:"#fff",border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",fontSize:11}}>✕</button></>
                                  : <button onClick={()=>setDelConfirm(u.id)} style={{padding:"4px 10px",background:"#FFF5F5",color:"#C53030",border:"1px solid #FED7D7",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>Remover</button>)
                              : <span style={{display:"inline-block",width:62}}/>
                            }
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add user form */}
          <div>
            <SectionLabel>Cadastrar novo usuário</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:10,alignItems:"end"}}>
              <div>
                <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:4}}>Nome completo</label>
                <input type="text" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Ex: João Silva" style={iBase}/>
              </div>
              <div>
                <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:4}}>Nome de usuário</label>
                <input type="text" value={form.username} onChange={e=>setForm(p=>({...p,username:e.target.value}))} placeholder="joao.silva" style={iBase}/>
              </div>
              <div>
                <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:4}}>Senha inicial</label>
                <input type="text" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="mínimo 4 caracteres" style={iBase}/>
              </div>
              <div>
                <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:4}}>Perfil</label>
                <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} style={{...iBase,background:"#fff"}}>
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            {formError&&<p style={{fontSize:12,color:"#C53030",marginTop:8}}>{formError}</p>}
            <button onClick={handleAdd} style={{marginTop:12,padding:"8px 20px",borderRadius:10,border:"none",background:C.teal,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Outfit, sans-serif"}}>
              + Cadastrar usuário
            </button>
          </div>

          <p style={{fontSize:11,color:C.muted,background:C.bg,padding:"10px 14px",borderRadius:8,lineHeight:1.6}}>
            <strong>Segurança:</strong> As senhas são armazenadas com codificação básica. Esta tela é adequada para controle de acesso interno. Para ambientes com dados sensíveis, implemente autenticação com backend dedicado.
          </p>
        </div>
      )}
    </Modal>
  );
}

// ─── CHANGE PASSWORD MODAL ───────────────────────────────────────────────────
function ChangePasswordModal({currentUser,onClose}){
  const [cur,setCur]   =useState("");
  const [next,setNext] =useState("");
  const [conf,setConf] =useState("");
  const [err,setErr]   =useState("");
  const [ok,setOk]     =useState(false);
  const [show,setShow] =useState({cur:false,next:false,conf:false});
  const tog=(f)=>setShow(p=>({...p,[f]:!p[f]}));

  const handleSave=async()=>{
    setErr("");
    if(!cur||!next||!conf){setErr("Preencha todos os campos.");return;}
    if(!checkPwd(cur,currentUser.password)){setErr("Senha atual incorreta.");return;}
    if(next.length<4){setErr("A nova senha deve ter no mínimo 4 caracteres.");return;}
    if(next!==conf){setErr("A confirmação não confere com a nova senha.");return;}
    try{
      const{error}=await supabase.from("users").update({password:hashPwd(next)}).eq("id",currentUser.id);
      if(error){setErr("Erro ao salvar. Tente novamente.");return;}
      currentUser.password=hashPwd(next);
      setOk(true);
      setTimeout(onClose,1800);
    }catch(e){setErr("Erro ao salvar. Tente novamente.");}
  };

  const iStyle={width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:10,fontSize:14,outline:"none",fontFamily:"DM Sans, sans-serif",boxSizing:"border-box",paddingRight:40};
  const eyeBtn=(field)=>(
    <button type="button" onClick={()=>tog(field)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.muted,padding:2}}>
      {show[field]
        ?<svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M17.94 10C16.73 7.61 13.52 5 10 5s-6.73 2.61-7.94 5c1.21 2.39 4.42 5 7.94 5s6.73-2.61 7.94-5z"/><circle cx="10" cy="10" r="2.5"/><line x1="3" y1="3" x2="17" y2="17"/></svg>
        :<svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M17.94 10C16.73 7.61 13.52 5 10 5s-6.73 2.61-7.94 5c1.21 2.39 4.42 5 7.94 5s6.73-2.61 7.94-5z"/><circle cx="10" cy="10" r="2.5"/></svg>}
    </button>
  );

  const field=(label,val,setVal,f)=>(
    <div>
      <label style={{display:"block",fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>{label}</label>
      <div style={{position:"relative"}}>
        <input type={show[f]?"text":"password"} value={val} onChange={e=>setVal(e.target.value)} style={iStyle}/>
        {eyeBtn(f)}
      </div>
    </div>
  );

  return(
    <Modal title="Alterar minha senha" onClose={onClose} maxWidth={420}>
      {ok
        ? <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{width:52,height:52,borderRadius:26,background:C.light,border:`2px solid ${C.sage}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
              <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke={C.teal} strokeWidth={2.5} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:16,color:C.dark,marginBottom:4}}>Senha alterada!</p>
            <p style={{fontSize:13,color:C.muted}}>Sua nova senha já está ativa.</p>
          </div>
        : <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {field("Senha atual",    cur, setCur, "cur")}
            {field("Nova senha",     next,setNext,"next")}
            {field("Confirmar nova senha",conf,setConf,"conf")}
            {err&&<p style={{fontSize:12,color:"#C53030",background:"#FFF5F5",padding:"8px 12px",borderRadius:8,border:"1px solid #FED7D7"}}>{err}</p>}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:4}}>
              <button onClick={onClose} style={{padding:"9px 16px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",color:C.gray,fontSize:13,cursor:"pointer"}}>Cancelar</button>
              <button onClick={handleSave} style={{padding:"9px 22px",borderRadius:10,border:"none",background:C.teal,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Outfit, sans-serif"}}>Salvar</button>
            </div>
          </div>
      }
    </Modal>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [currentUser,setCurrentUser] = useState(null);
  const [showAdmin,setShowAdmin]     = useState(false);
  const [showChangePwd,setShowChangePwd] = useState(false);
  const [settings,setSettings]       = useState(DEFAULT_SETTINGS);
  const [showSettings,setShowSettings] = useState(false);
  const [view,setView]               = useState("wizard"); // wizard | orientacoes | orcamentos
  const [step,setStep]               = useState(1);
  const [dados,setDados]             = useState({cliente:"",projeto:"",responsavel:"",obs:""});
  const [disciplines,setDisciplines] = useState(()=>initDisciplines(DEFAULT_SETTINGS));
  const [deliveryType,setDeliveryType] = useState("");
  const [params,setParams]           = useState({complexidade:"",lod:"",loi:""});
  const [derivados,setDerivados]     = useState([]);
  const [coord,setCoord]             = useState({enabled:false,pct:10});
  const [desconto,setDesconto]       = useState({enabled:false,tipo:"pct",valor:0});
  const [scenarioA,setScenarioA]     = useState(null);
  const [showComparator,setShowComparator] = useState(false);
  const [savedQuotes,setSavedQuotes] = useState([]);
  const [saveStatus,setSaveStatus]   = useState(""); // "", "saving", "saved"

  // Seed default admin if users table is empty
  useEffect(()=>{
    if(!supabase) return;
    (async()=>{
      const{data}=await supabase.from("users").select("id").eq("id","1").single();
      if(!data){
        const admin=getDefaultUsers()[0];
        await supabase.from("users").insert(admin);
      }
    })();
  },[]);

  // Load all quotes from Supabase
  const refreshQuotes=useCallback(async()=>{
    if(!supabase) return;
    const{data,error}=await supabase
      .from("orcamentos")
      .select("*")
      .order("created_at",{ascending:false});
    if(!error&&data) setSavedQuotes(data);
  },[]);

  useEffect(()=>{ refreshQuotes(); },[refreshQuotes]);

  // Refresh quotes whenever navigating to the orcamentos view
  const handleSetView=useCallback((v)=>{
    setView(v);
    if(v==="orcamentos") refreshQuotes();
  },[refreshQuotes]);

  const handleLogin=user=>{
    setCurrentUser(user);
    setDados(d=>({...d,responsavel:user.name}));
  };
  const handleLogout=()=>{ setCurrentUser(null); handleReset(); };

  const handleSaveSettings=s=>{
    setSettings(s);
    setDisciplines(ds=>ds.map(d=>({...d,hh:s.disciplines[d.id]??d.hhBase})));
  };
  const handleDeliveryType=dt=>{setDeliveryType(dt);setParams(p=>({...p,lod:"",loi:""}));};

  const totalA1=useMemo(()=>disciplines.filter(d=>d.active).reduce((s,d)=>s+d.a1,0),[disciplines]);

  const multiplier=useMemo(()=>R(
    (settings.complexityX[params.complexidade]||0)*
    (settings.lodX[params.lod]||0)*
    (settings.loiX[params.loi]||0),3),[params,settings]);

  const totalModelingHours=useMemo(()=>R(
    disciplines.filter(d=>d.active).reduce((s,d)=>s+d.a1*d.hh*multiplier,0),2),[disciplines,multiplier]);

  const calc=useMemo(()=>{
    const scalingFactor=calcBlendedFactor(totalA1,settings.escalonamento);
    const scaledModelingHours=R(totalModelingHours*scalingFactor,2);
    const coordHours=coord.enabled?R(scaledModelingHours*(coord.pct/100),2):0;
    const coordCost=R(coordHours*settings.hhCoordenador,2);
    const derivedHours=R(derivados.reduce((s,item)=>s+(settings.derivedHH[item.id]||0)*item.qty,0),2);
    const derivedCost=R(derivedHours*settings.hhModelador,2);
    const licH=R(settings.licencaAnual/settings.horasAnuais,4);
    const softwareCost=R((scaledModelingHours+coordHours+derivedHours)*licH,2);
    const modelingCost=R(scaledModelingHours*settings.hhModelador,2);
    const baseCost=R(modelingCost+coordCost+derivedCost+softwareCost,2);
    const margin={maquete:settings.margemMaquete,projeto3d:settings.margemProjeto3d,bim:settings.margemBim}[deliveryType]??settings.margemProjeto3d;
    const finalPrice=settings.margemEnabled?R(baseCost/(1-margin/100),2):baseCost;
    const marginValue=settings.margemEnabled?R(finalPrice-baseCost,2):0;
    const disciplineRows=disciplines.filter(d=>d.active).map(d=>({
      ...d,
      hours:R(d.a1*d.hh*multiplier*scalingFactor,1),
      cost:R(d.a1*d.hh*multiplier*scalingFactor*settings.hhModelador,2),
    }));
    return{totalModelingHours:scaledModelingHours,modelingCost,coordHours,coordCost,derivedHours,derivedCost,softwareCost,baseCost,margin,finalPrice,marginValue,multiplier,disciplineRows,scalingFactor};
  },[disciplines,multiplier,totalModelingHours,totalA1,coord,derivados,settings,deliveryType]);

  const canProceed=useMemo(()=>{
    if(step===1) return dados.cliente.trim().length>0&&dados.projeto.trim().length>0&&dados.responsavel.trim().length>0;
    if(step===2) return disciplines.filter(d=>d.active).length>0;
    if(step===3) return !!deliveryType;
    if(step===4) return !!(params.complexidade&&params.lod&&params.loi);
    return true;
  },[step,dados,disciplines,deliveryType,params]);

  const handleReset=()=>{
    setStep(1);setView("wizard");
    setDados({cliente:"",projeto:"",responsavel:currentUser?.name||"",obs:""});
    setDisciplines(initDisciplines(settings));
    setDeliveryType("");setParams({complexidade:"",lod:"",loi:""});
    setDerivados([]);setCoord({enabled:false,pct:10});
    setDesconto({enabled:false,tipo:"pct",valor:0});
    setScenarioA(null);
  };

  const handleSaveScenario=()=>{
    setScenarioA({dados,disciplines:[...disciplines],deliveryType,params:{...params},derivados:[...derivados],coord:{...coord},calc:{...calc},desconto:{...desconto}});
  };

  const handleSaveQuote=async()=>{
    setSaveStatus("saving");
    const id=Date.now();
    const dt=DELIVERY_TYPES.find(d=>d.id===deliveryType)?.name||"—";
    const q={
      id,
      titulo:`${dados.cliente||"—"} — ${dados.projeto||"—"}`,
      data:new Date().toLocaleDateString("pt-BR"),
      tipo:dt,
      valor:R(calc.finalPrice-calcDescontoValor(desconto,calc.finalPrice),2),
      responsavel:dados.responsavel||"",
      state:{dados,disciplines,deliveryType,params,derivados,coord,desconto,settings},
    };
    const{error}=await supabase.from("orcamentos").upsert(q);
    if(!error){
      setSavedQuotes(p=>[q,...p.filter(x=>x.id!==id)]);
      setSaveStatus("saved"); setTimeout(()=>setSaveStatus(""),2500);
    }else{ setSaveStatus(""); alert("Erro ao salvar: "+error.message); }
  };

  const handleLoadQuote=q=>{
    const s=q.state;
    if(s.settings) setSettings(s.settings);
    setDados(s.dados||{cliente:"",projeto:"",responsavel:"",obs:""});
    setDisciplines(s.disciplines||initDisciplines(settings));
    setDeliveryType(s.deliveryType||"");
    setParams(s.params||{complexidade:"",lod:"",loi:""});
    setDerivados(s.derivados||[]);
    setCoord(s.coord||{enabled:false,pct:10});
    setDesconto(s.desconto||{enabled:false,tipo:"pct",valor:0});
    setScenarioA(null);
    setStep(7);setView("wizard");
  };

  const handleDeleteQuote=async(id)=>{
    await supabase.from("orcamentos").delete().eq("id",id);
    setSavedQuotes(p=>p.filter(q=>q.id!==id));
  };

  const [printPreviewHTML,setPrintPreviewHTML]=useState(null);
  const [showPrintPreview,setShowPrintPreview]=useState(false);
  const handleExportPDF=()=>{
    setPrintPreviewHTML(buildPrintHTML(calc,{dados,deliveryType},settings,desconto));
    setShowPrintPreview(true);
  };

  const navBtn=(label,dir)=>(
    <button onClick={dir==="next"?()=>setStep(s=>s+1):()=>setStep(s=>Math.max(1,s-1))}
      disabled={dir==="next"?!canProceed:step===1}
      style={{display:"flex",alignItems:"center",gap:6,padding:dir==="next"?"9px 22px":"9px 18px",
        borderRadius:10,border:dir==="next"?"none":`1.5px solid ${C.border}`,
        background:dir==="next"?(canProceed?C.teal:C.border):"#fff",
        color:dir==="next"?(canProceed?"#fff":C.gray):(step===1?C.border:C.gray),
        cursor:(dir==="next"?!canProceed:step===1)?"default":"pointer",
        fontSize:13,fontWeight:dir==="next"?700:500,
        fontFamily:dir==="next"?"Outfit, sans-serif":"DM Sans, sans-serif",transition:"all .15s"}}>
      {dir==="back"&&<svg viewBox="0 0 20 20" width={16} height={16} fill="currentColor"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/></svg>}
      {label}
      {dir==="next"&&<svg viewBox="0 0 20 20" width={16} height={16} fill="currentColor"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>}
    </button>
  );

  const sideBtn=(label,icon,v)=>(
    <button onClick={()=>handleSetView(v)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:10,background:view===v?`${C.teal}33`:"none",border:view===v?`1px solid ${C.teal}`:"1px solid transparent",cursor:"pointer",width:"100%",transition:"all .15s"}}>
      {icon}
      <span style={{fontFamily:"Outfit, sans-serif",fontWeight:600,fontSize:13,color:view===v?C.sage:C.sageL}}>{label}</span>
      {v==="orcamentos"&&savedQuotes.length>0&&(
        <span style={{marginLeft:"auto",fontSize:10,fontWeight:700,color:C.dark,background:C.sage,padding:"1px 6px",borderRadius:8}}>{savedQuotes.length}</span>
      )}
    </button>
  );

  const iconDoc=(color="#4A7A8A")=>(
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
  const iconFolder=(color="#4A7A8A")=>(
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
    </svg>
  );
  const iconSettings=(color)=>(
    <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke={color||"currentColor"} strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
    </svg>
  );

  const topBarLabel=view==="orientacoes"?"Manual de utilização":view==="orcamentos"?"Orçamentos armazenados":`Passo ${step} de ${STEPS.length}`;
  const topBarTitle=view==="orientacoes"?"Orientações gerais":view==="orcamentos"?"Orçamentos salvos":STEPS[step-1];

  // Gate: after all hooks — safe to return early here
  if(!supabase) return <DbNotReady/>;
  if(!currentUser) return <LoginView onLogin={handleLogin}/>;

  return(
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"DM Sans, sans-serif",background:C.bg}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input[type=number]{-moz-appearance:textfield;}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
        input:focus,textarea:focus{outline:none;border-color:${C.teal}!important;box-shadow:0 0 0 3px ${C.teal}22;}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:2px;background:${C.mid};border:none;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:9px;background:${C.teal};cursor:pointer;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.2);}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:${C.sageL};border-radius:3px;}
        button{font-family:'DM Sans',sans-serif;}
      `}</style>

      {showSettings&&<SettingsModal settings={settings} onSave={handleSaveSettings} onClose={()=>setShowSettings(false)}/>}
      {showPrintPreview&&printPreviewHTML&&(
        <PrintPreviewModal html={printPreviewHTML} onClose={()=>setShowPrintPreview(false)}/>
      )}
      {showAdmin&&<AdminView currentUser={currentUser} onClose={()=>setShowAdmin(false)}/> }
      {showChangePwd&&<ChangePasswordModal currentUser={currentUser} onClose={()=>setShowChangePwd(false)}/>}
      {showComparator&&scenarioA&&(
        <ScenarioComparatorModal
          scenarioA={scenarioA} calcA={scenarioA.calc}
          scenarioB={{dados,disciplines,deliveryType,params,derivados,coord}} calcB={calc}
          settings={settings} onClose={()=>setShowComparator(false)}/>
      )}

      {/* SIDEBAR */}
      <aside style={{width:252,flexShrink:0,display:"flex",flexDirection:"column",background:C.dark,minHeight:"100vh",position:"sticky",top:0,height:"100vh"}}>
        {/* Logo */}
        <div style={{padding:"20px 18px 16px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <img src={LOGO_B64} alt="SM&A" style={{width:110,mixBlendMode:"screen",display:"block"}}/>
          <p style={{fontSize:10,color:C.sage,marginTop:8,letterSpacing:".04em",lineHeight:1.5}}>Precificação para serviços<br/>de engenharia digital</p>
        </div>

        {/* Navigation */}
        <div style={{padding:"10px 12px 4px"}}>
          {sideBtn("Orientações gerais",iconDoc(view==="orientacoes"?C.sage:undefined),"orientacoes")}
          {sideBtn("Orçamentos salvos",iconFolder(view==="orcamentos"?C.sage:undefined),"orcamentos")}
        </div>

        {/* Steps */}
        <nav style={{flex:1,padding:"6px 12px 10px",display:"flex",flexDirection:"column",gap:3}}>
          <p style={{fontSize:10,color:"#2A5A6E",textTransform:"uppercase",letterSpacing:".07em",fontWeight:700,padding:"6px 10px 4px"}}>Orçamento</p>
          {STEPS.map((label,i)=>{
            const n=i+1,done=n<step&&view==="wizard",active=n===step&&view==="wizard",future=n>step;
            return(
              <div key={n} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,background:active?C.teal:"transparent",opacity:future&&view==="wizard"?0.35:1,transition:"all .15s"}}>
                <div style={{width:22,height:22,borderRadius:11,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:active?"rgba(0,0,0,.2)":done?`${C.teal}33`:"rgba(255,255,255,.06)",color:active?C.light:done?C.sage:"#4A7A8A"}}>
                  {done?"✓":n}
                </div>
                <span style={{fontFamily:"Outfit, sans-serif",fontWeight:active?700:500,fontSize:13,color:active?"#fff":done?C.sageL:"#4A7A8A"}}>{label}</span>
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{padding:"10px 12px",borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",flexDirection:"column",gap:3}}>
          {currentUser?.role==="admin"&&(
            <button onClick={()=>setShowAdmin(true)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:10,background:showAdmin?`${C.teal}33`:"none",border:showAdmin?`1px solid ${C.teal}`:"1px solid transparent",cursor:"pointer",color:showAdmin?C.sage:"#4A7A8A",width:"100%",transition:"all .15s"}}>
              <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
              <span style={{fontFamily:"Outfit, sans-serif",fontSize:12}}>Usuários</span>
            </button>
          )}
          <button onClick={()=>setShowSettings(true)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:10,background:"none",border:"none",cursor:"pointer",color:"#4A7A8A",width:"100%",transition:"all .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.05)"}
            onMouseLeave={e=>e.currentTarget.style.background="none"}>
            {iconSettings()}
            <span style={{fontFamily:"Outfit, sans-serif",fontSize:12}}>Configurações</span>
          </button>
          {step===7&&view==="wizard"&&(
            <button onClick={handleReset} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:10,background:"none",border:"none",cursor:"pointer",color:C.sage,width:"100%"}}
              onMouseEnter={e=>e.currentTarget.style.background=`${C.teal}18`}
              onMouseLeave={e=>e.currentTarget.style.background="none"}>
              <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 4v4M8 6l4-4 4 4M12 20v-4m4 2l-4 4-4-4M5 12H9m-4 0a7 7 0 0014 0"/></svg>
              <span style={{fontFamily:"Outfit, sans-serif",fontSize:12}}>Novo orçamento</span>
            </button>
          )}
          {/* User info + logout */}
          <div style={{padding:"10px 10px 6px",borderTop:"1px solid rgba(255,255,255,.06)",marginTop:2}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{width:28,height:28,borderRadius:14,background:C.teal,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:12,fontWeight:700,color:"#fff"}}>{(currentUser?.name||"?")[0].toUpperCase()}</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:12,fontWeight:600,color:C.sageL,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser?.name}</p>
                <p style={{fontSize:10,color:"#4A7A8A"}}>{currentUser?.role==="admin"?"Administrador":"Usuário"}</p>
              </div>
              <button onClick={handleLogout} title="Sair" style={{padding:"4px 6px",background:"none",border:"1px solid #2A5A6E",borderRadius:6,cursor:"pointer",color:"#4A7A8A",flexShrink:0}}>
                <svg viewBox="0 0 20 20" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M13 10H3m0 0l3-3m-3 3l3 3M9 5V4a1 1 0 011-1h5a1 1 0 011 1v12a1 1 0 01-1 1h-5a1 1 0 01-1-1v-1"/></svg>
              </button>
            </div>
            <button onClick={()=>setShowChangePwd(true)}
              style={{display:"flex",alignItems:"center",gap:6,width:"100%",padding:"5px 4px",background:"none",border:"none",cursor:"pointer",borderRadius:6,marginBottom:6,transition:"background .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.05)"}
              onMouseLeave={e=>e.currentTarget.style.background="none"}>
              <svg viewBox="0 0 20 20" width={13} height={13} fill="none" stroke="#4A7A8A" strokeWidth={1.8} strokeLinecap="round"><rect x="3" y="11" width="14" height="8" rx="1"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span style={{fontFamily:"Outfit, sans-serif",fontSize:11,color:"#4A7A8A"}}>Alterar minha senha</span>
            </button>
            <p style={{fontSize:9,color:"#2A5A6E",lineHeight:1.5}}>{VERSION} · DEP — Departamento de Engenharia de Projetos</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{flex:1,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        {/* Top bar */}
        <div style={{background:"#fff",borderBottom:`1px solid ${C.mid}`,padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
          <div>
            <p style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",fontWeight:600}}>{topBarLabel}</p>
            <p style={{fontFamily:"Outfit, sans-serif",fontWeight:700,fontSize:16,color:C.dark,marginTop:2}}>{topBarTitle}</p>
          </div>
          {view==="wizard"&&(
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:160,height:4,background:C.mid,borderRadius:2,overflow:"hidden"}}>
                <div style={{width:`${(step/STEPS.length)*100}%`,height:"100%",background:C.teal,borderRadius:2,transition:"width .4s ease"}}/>
              </div>
              <span style={{fontSize:12,fontWeight:600,color:C.muted,minWidth:30}}>{Math.round((step/STEPS.length)*100)}%</span>
            </div>
          )}
          {(view==="orientacoes"||view==="orcamentos")&&(
            <button onClick={()=>setView("wizard")} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",color:C.muted,cursor:"pointer",fontSize:13}}>
              <svg viewBox="0 0 20 20" width={14} height={14} fill="currentColor"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/></svg>
              Voltar
            </button>
          )}
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:"auto"}}>
          {view==="orientacoes"&&<OrientacoesView settings={settings}/>}
          {view==="orcamentos"&&<SavedQuotesView quotes={savedQuotes} onLoad={handleLoadQuote} onDelete={handleDeleteQuote}/>}
          {view==="wizard"&&(
            <div style={{maxWidth:700,margin:"0 auto",padding:"32px 32px 24px"}}>
              {step===1&&<Step1 data={dados} onChange={setDados}/>}
              {step===2&&<Step2 data={disciplines} onChange={setDisciplines} settings={settings}/>}
              {step===3&&<Step3 data={deliveryType} onChange={handleDeliveryType}/>}
              {step===4&&<Step4 data={params} onChange={setParams} deliveryType={deliveryType} settings={settings}/>}
              {step===5&&<Step5 data={derivados} onChange={setDerivados} totalA1={totalA1} disciplines={disciplines}/>}
              {step===6&&<Step6 data={coord} onChange={setCoord} settings={settings} totalModelingHours={totalModelingHours}/>}
              {step===7&&<Step7 calc={calc} orcamento={{dados,deliveryType}} settings={settings}
                desconto={desconto} onDescontoChange={setDesconto}
                scenarioA={scenarioA} onSaveScenario={handleSaveScenario} onCompare={()=>setShowComparator(true)}
                onSaveQuote={handleSaveQuote}/>}
            </div>
          )}
        </div>

        {/* Nav bar */}
        {view==="wizard"&&(
          <div style={{background:"#fff",borderTop:`1px solid ${C.mid}`,padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            {step<7&&navBtn("Voltar","back")}
            {step===7&&(
              <button onClick={()=>setStep(6)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",color:C.gray,cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:"DM Sans, sans-serif"}}>
                <svg viewBox="0 0 20 20" width={15} height={15} fill="currentColor"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/></svg>
                Ajustar parâmetros
              </button>
            )}
            {step<7&&navBtn(step===6?"Calcular orçamento":"Continuar","next")}
            {step===7&&(
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <button onClick={handleExportPDF}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",color:C.teal2,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"Outfit, sans-serif"}}>
                  <svg viewBox="0 0 20 20" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M13 7H7M13 10H7M7 13h3M5 4h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"/></svg>
                  Exportar PDF
                </button>
                <button onClick={handleSaveQuote} disabled={saveStatus==="saving"}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:10,border:`1.5px solid ${saveStatus==="saved"?C.sage:C.border}`,background:saveStatus==="saved"?C.light:"#fff",color:saveStatus==="saved"?C.teal2:C.muted,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"Outfit, sans-serif"}}>
                  <svg viewBox="0 0 20 20" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M17 21H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  {saveStatus==="saved"?"✓ Salvo!":saveStatus==="saving"?"Salvando…":"Salvar orçamento"}
                </button>
                <button onClick={handleReset}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"9px 22px",borderRadius:10,border:"none",background:C.teal,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"Outfit, sans-serif"}}>
                  Novo orçamento
                  <svg viewBox="0 0 20 20" width={16} height={16} fill="currentColor"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
