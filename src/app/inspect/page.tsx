"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Card, CardBody, ScrollShadow, Tab, Tabs, Button, Tooltip, Progress
} from "@heroui/react"; 
import { 
  Check, Eye, MessageSquare, MousePointerClick, 
  PanelLeft, PanelRight, PanelBottom, Ghost, ScanLine, Copy, Pointer, Trash2
} from "lucide-react";

// --- TYPY ---
interface FeedbackItem {
  id: string;
  selector: string;
  text: string;
  x: number;
  y: number;
  timestamp: string;
  status: 'open' | 'resolved' | 'closed';
}

type DockPosition = 'left' | 'right' | 'bottom';

function InspectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const projectHash = searchParams.get('project');
  
  // --- STAVY ---
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);

  const [targetUrl, setTargetUrl] = useState("https://dennikn.sk");
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  
  // MÓDY
  const [mode, setMode] = useState<'comment' | 'browse'>('browse'); 
  const [position, setPosition] = useState<DockPosition>('right');
  const [iframeHeight, setIframeHeight] = useState(1000); 

  // --- 1. VALIDÁCIA ---
  useEffect(() => {
    const validate = async () => {
      await new Promise(r => setTimeout(r, 500));
      if (projectHash === "xV9y2m4k8p1l5n0q3r7z9w2a") {
        setIsValid(true);
        setFeedbacks([
            { id: '1', selector: 'header > img.logo', text: 'Logo je rozmazané', x: 150, y: 80, timestamp: '12:00', status: 'open' },
            { id: '2', selector: '#subscribe-button', text: 'Zmeniť farbu tlačidla', x: 600, y: 450, timestamp: '14:30', status: 'resolved' },
        ]);
        setIframeHeight(2500); 
      } else {
        setIsValid(false);
      }
      setIsLoading(false);
    };
    if (projectHash) validate();
    else { setIsValid(false); setIsLoading(false); }
  }, [projectHash]);

  // --- 2. ODPOČÍTAVANIE PRE 404 ---
  useEffect(() => {
    if (!isLoading && !isValid && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && !isValid) router.push('/');
  }, [isLoading, isValid, timeLeft, router]);

  // --- 3. KOMUNIKÁCIA S IFRAME (POSIELANIE MÓDU) ---
  // Toto je kľúčové: Iframe vždy prijíma myš, ale my mu povieme, ako sa má správať
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
        console.log("Odosielam zmenu módu do iframe:", mode);
        iframeRef.current.contentWindow.postMessage({ type: 'setMode', mode }, '*');
    }
  }, [mode]);

  // --- 4. PRIJÍMANIE SPRÁV Z IFRAME (Feedbacky) ---
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Prijímame správy len v Comment móde (poistka), hoci iframe by to mal filtrovať tiež
      if (mode === 'browse' && event.data.type === 'feedback') return;

      if (event.data.type === 'urlChange') setTargetUrl(event.data.url);
      if (event.data.type === 'resize') setIframeHeight(event.data.height);

      if (event.data.type === 'feedback') {
        const newFeedback: FeedbackItem = {
            id: Math.random().toString(36).substr(2, 9),
            selector: event.data.selector || 'unknown > element', 
            text: 'Nová pripomienka...',
            x: event.data.x, 
            y: event.data.y, 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'open'
        };
        setFeedbacks(prev => [...prev, newFeedback]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [mode]); // Pridal som mode do dependencies

  // --- HELPERY ---
  const copySelector = (selector: string) => {
    navigator.clipboard.writeText(selector);
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'open': return 'bg-amber-500 text-black'; 
          case 'resolved': return 'bg-blue-600 text-white';
          case 'closed': return 'bg-green-600 text-white';
          default: return 'bg-zinc-500 text-white';
      }
  };

  const getStatusBorder = (status: string) => {
      switch(status) {
          case 'open': return 'border-amber-500';
          case 'resolved': return 'border-blue-900';
          case 'closed': return 'border-green-900';
          default: return 'border-zinc-800';
      }
  };

  const getLayoutBtnStyle = (pos: DockPosition) => {
      return position === pos 
        ? "text-purple-400 scale-110" 
        : "text-white hover:text-purple-300 opacity-70 hover:opacity-100";
  };

  const getCardPositionClasses = () => {
    switch (position) {
        case 'left': return "fixed left-5 top-5 bottom-5 w-[420px]";
        case 'bottom': return "fixed left-20 right-20 bottom-5 h-[350px]";
        case 'right': default: return "fixed right-5 top-5 bottom-5 w-[420px]";
    }
  };

  // --- RENDER ---
  if (isLoading) return <div className="h-screen w-screen bg-black flex items-center justify-center text-zinc-500 font-condensed">NAČÍTAVAM...</div>;
  if (!isValid) return <div className="h-screen bg-black text-white flex justify-center items-center">Chyba 404</div>;

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans flex flex-col">
      
      {/* 1. HLAVNÝ SCROLLOVATEĽNÝ KONTAJNER */}
      <div className="flex-grow overflow-auto relative w-full h-full bg-zinc-100">
         
         <div style={{ height: `${iframeHeight}px`, width: '100%', position: 'relative' }}>
            
            {/* A. IFRAME */}
            {/* ZMENA: pointerEvents je VŽDY 'auto'. Myš vždy prejde dnu. */}
            {/* O tom, či sa highlightuje, rozhoduje skript vnútri na základe postMessage */}
            <iframe
                ref={iframeRef}
                src={`/api/proxy?url=${encodeURIComponent(targetUrl)}`}
                className={`w-full h-full border-none bg-white block transition-colors ${mode === 'comment' ? 'cursor-crosshair' : 'cursor-auto'}`}
                title="Website"
                scrolling="no" 
                onLoad={() => {
                    // Hneď po načítaní pošleme aktuálny mód
                    iframeRef.current?.contentWindow?.postMessage({ type: 'setMode', mode }, '*');
                }}
            />

            {/* B. OVERLAY SME VYHODILI ÚPLNE - UŽ NIČ NEBLOKUJE MYŠ */}

            {/* C. PINOVÉ BODKY NA WEBE */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                {feedbacks.map((f, i) => (
                    <div 
                        key={f.id}
                        style={{ top: `${f.y}px`, left: `${f.x}px` }} 
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto"
                    >
                        <div className={`w-8 h-8 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center cursor-pointer hover:scale-125 transition-transform font-bold text-xs font-condensed border-2 border-white ${getStatusColor(f.status)}`}>
                            {i + 1}
                        </div>
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 bg-[#18181b] text-white p-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl border border-white/10 z-30 pointer-events-none overflow-hidden">
                             <div className="bg-white/5 px-3 py-2 border-b border-white/5 flex items-center gap-2 justify-between">
                                <span className="text-[10px] font-mono text-zinc-300 truncate max-w-[120px]">{f.selector}</span>
                             </div>
                             <div className="p-3">
                                <p className="text-sm font-condensed leading-snug">"{f.text}"</p>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* 4. SIDEBAR */}
      <Card className={`${getCardPositionClasses()} z-50 rounded-[24px] shadow-2xl border border-white/5 bg-[#121212] transition-all duration-500 ease-in-out`}>
        <CardBody className="p-0 flex flex-col h-full overflow-hidden">
            
            {/* Header */}
            <div className="p-5 pb-4 border-b border-white/5">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold italic text-lg shadow-lg">x</div>
                        <div>
                            <h1 className="text-white font-bold text-md tracking-tight">xVisual</h1>
                            <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest font-condensed">Feedback Tool</p>
                        </div>
                    </div>
                    {/* Pozícia */}
                    <div className="flex items-center gap-3">
                        <button onClick={() => setPosition('left')} className={`transition-all ${getLayoutBtnStyle('left')}`}><PanelLeft size={20} strokeWidth={2} /></button>
                        <button onClick={() => setPosition('bottom')} className={`transition-all ${getLayoutBtnStyle('bottom')}`}><PanelBottom size={20} strokeWidth={2} /></button>
                        <button onClick={() => setPosition('right')} className={`transition-all ${getLayoutBtnStyle('right')}`}><PanelRight size={20} strokeWidth={2} /></button>
                    </div>
                </div>

                {/* TABS */}
                <Tabs 
                    fullWidth 
                    size="md" 
                    selectedKey={mode} 
                    onSelectionChange={(k) => setMode(k as any)}
                    classNames={{ 
                        base: "w-full",
                        tabList: "bg-zinc-800/50 p-1 rounded-lg border border-white/5", 
                        cursor: "bg-zinc-700 rounded-md shadow-sm", 
                        tab: "h-9",
                        tabContent: "text-white font-bold font-condensed uppercase tracking-wider text-[11px] group-data-[selected=true]:text-white" 
                    }}
                >
                    <Tab key="comment" title={<div className="flex gap-2 items-center"><MessageSquare size={16}/><span>KOMENTOVAŤ</span></div>} />
                    <Tab key="browse" title={<div className="flex gap-2 items-center"><MousePointerClick size={16}/><span>PREHLIADAŤ</span></div>} />
                </Tabs>
            </div>

            {/* List */}
            <ScrollShadow className="flex-grow p-4 space-y-3 bg-[#121212]">
                {feedbacks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                        <Pointer size={40} className="text-zinc-500 mb-4" />
                        <p className="text-zinc-400 text-sm font-condensed">Klikni na web pre pridanie.</p>
                    </div>
                ) : (
                    <div className={position === 'bottom' ? "grid grid-cols-3 gap-3" : "flex flex-col gap-3"}>
                        {feedbacks.map((f, i) => (
                            <div key={f.id} className={`p-4 rounded-xl border transition-all bg-[#18181b] group ${getStatusBorder(f.status)} hover:border-opacity-100 border-opacity-50`}>
                                <div className="flex justify-between items-start mb-2 gap-2">
                                    <div className="flex items-center gap-3 overflow-hidden flex-grow">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${getStatusColor(f.status)}`}>
                                            {i + 1}
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded border border-white/5 max-w-full overflow-hidden">
                                            <ScanLine size={10} className="text-zinc-500" />
                                            <span className="text-[10px] text-zinc-400 font-condensed font-mono truncate">{f.selector}</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-zinc-600 font-bold font-condensed flex-shrink-0 mt-1">{f.timestamp}</span>
                                </div>
                                <p className={`text-base font-condensed font-normal leading-snug mb-4 pl-1 ${f.status === 'closed' ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                                    {f.text}
                                </p>
                                <div className="flex gap-2 pt-0">
                                    {f.status === 'open' && (
                                        <button onClick={() => setFeedbacks(prev => prev.map(item => item.id === f.id ? { ...item, status: 'resolved' } : item))} className="flex-grow py-2 rounded-lg text-[10px] font-bold uppercase font-condensed transition-colors flex items-center justify-center gap-2 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300 border border-blue-900/50">
                                            <Eye size={14} /> Na schválenie
                                        </button>
                                    )}
                                    {f.status === 'resolved' && (
                                        <button onClick={() => setFeedbacks(prev => prev.map(item => item.id === f.id ? { ...item, status: 'closed' } : item))} className="flex-grow py-2 rounded-lg text-[10px] font-bold uppercase font-condensed transition-colors flex items-center justify-center gap-2 bg-green-900/30 text-green-400 hover:bg-green-900/50 hover:text-green-300 border border-green-900/50">
                                            <Check size={14} /> Schváliť
                                        </button>
                                    )}
                                    <button onClick={() => setFeedbacks(prev => prev.filter(item => item.id !== f.id))} className="w-9 flex items-center justify-center rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/30 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollShadow>
        </CardBody>
      </Card>
    </div>
  );
}

export default function InspectPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-black flex items-center justify-center text-zinc-500 font-condensed">Načítavam...</div>}>
      <InspectContent />
    </Suspense>
  );
}