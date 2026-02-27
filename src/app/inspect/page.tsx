"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Card, CardBody, ScrollShadow, Tab, Tabs, Button, Tooltip 
} from "@heroui/react"; 
import { 
  Check, MessageSquare, MousePointerClick, 
  PanelLeft, PanelRight, PanelBottom, Ghost, Home, Trash2, ScanLine, Pointer, Coffee, Wrench, RotateCcw, ChevronLeft, Send, Info, X, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
type ActivityType = 'comment' | 'status_change';

interface Activity {
  id: string;
  type: ActivityType;
  author: string;
  date: string;
  timestamp: string;
  content: string; 
}

interface FeedbackItem {
  id: string;
  pinNumber: number; 
  createdAt: number; 
  selector: string;
  x: number;
  y: number;
  status: 'open' | 'resolved' | 'closed';
  activities: Activity[]; 
}

type DockPosition = 'left' | 'right' | 'bottom';
type FilterType = 'all' | 'open' | 'resolved' | 'closed';
type SortType = 'newest' | 'oldest' | 'status';

function InspectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const projectHash = searchParams.get('project');
  
  // --- STATES ---
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [targetUrl, setTargetUrl] = useState("https://dennikn.sk");
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState(""); 
  const [pendingAction, setPendingAction] = useState<'reopen' | null>(null);
  
  const [filterStatus, setFilterStatus] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  
  const [mode, setMode] = useState<'comment' | 'browse'>('browse'); 
  const [position, setPosition] = useState<DockPosition>('right');
  const [iframeHeight, setIframeHeight] = useState(1000); 

  useEffect(() => {
      setPendingAction(null);
      setNewCommentText("");
  }, [selectedFeedbackId]);

  // NOVÉ: Spoľahlivý auto-focus po načítaní detailu
  useEffect(() => {
      if (selectedFeedbackId) {
          setTimeout(() => {
              textareaRef.current?.focus();
          }, 300); // Počkáme kým dobehne slide animácia a zameriame
      }
  }, [selectedFeedbackId]);

  // --- 1. VALIDATION & MOCK DATA ---
  useEffect(() => {
    const validate = async () => {
      await new Promise(r => setTimeout(r, 500));
      if (projectHash === "xV9y2m4k8p1l5n0q3r7z9w2a") {
        setIsValid(true);
        const now = Date.now();
        setFeedbacks([
            { 
              id: '1', pinNumber: 1, createdAt: now - 100000, selector: 'header > img.logo', x: 150, y: 80, status: 'open',
              activities: [
                { id: 'a1', type: 'comment', author: 'Tomáš K.', date: '27.02.2026', timestamp: '12:00', content: 'Logo is blurry on retina screens. Can we replace it with SVG?' }
              ]
            },
            { 
              id: '2', pinNumber: 2, createdAt: now - 50000, selector: '#subscribe-button', x: 600, y: 450, status: 'resolved',
              activities: [
                { id: 'a2', type: 'comment', author: 'Jana N.', date: '27.02.2026', timestamp: '14:00', content: 'Change button color to match the new brand guidelines.' },
                { id: 'a3', type: 'status_change', author: 'Peter D.', date: '27.02.2026', timestamp: '14:30', content: 'resolved' },
                { id: 'a4', type: 'comment', author: 'Peter D.', date: '27.02.2026', timestamp: '14:31', content: 'Fixed, please check if the shade of blue is correct.' }
              ]
            },
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

  // --- 2. IFRAME COMMUNICATION ---
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'setMode', mode }, '*');
    }
  }, [mode]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'urlChange') setTargetUrl(event.data.url);
      if (event.data.type === 'resize') setIframeHeight(event.data.height);

      if (event.data.type === 'feedback') {
        const newId = Math.random().toString(36).substr(2, 9);
        
        setFeedbacks(prev => {
            const nextPinNumber = prev.length > 0 ? Math.max(...prev.map(p => p.pinNumber)) + 1 : 1;
            const newFeedback: FeedbackItem = {
                id: newId,
                pinNumber: nextPinNumber,
                createdAt: Date.now(),
                selector: event.data.selector || 'unknown > element', 
                x: event.data.x, 
                y: event.data.y, 
                status: 'open',
                activities: [] 
            };
            return [...prev, newFeedback];
        });
        
        setSelectedFeedbackId(newId);
        setMode('browse'); 
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (selectedFeedbackId) {
       const f = feedbacks.find(item => item.id === selectedFeedbackId);
       if (f) handleTaskHover(f.selector);
    } else {
       handleTaskLeave();
    }
  }, [selectedFeedbackId, feedbacks]);

  const handleTaskHover = (selector: string) => {
      if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'highlightElement', selector }, '*');
      }
  };

  const handleTaskLeave = () => {
      if (iframeRef.current?.contentWindow && !selectedFeedbackId) {
          iframeRef.current.contentWindow.postMessage({ type: 'removeHighlight' }, '*');
      }
  };

  // --- ACTIVITY LOGIC ---
  const addActivity = (feedbackId: string, type: ActivityType, content: string) => {
      setFeedbacks(prev => prev.map(f => {
          if (f.id !== feedbackId) return f;
          
          const now = new Date();
          const newActivity: Activity = {
              id: Math.random().toString(36).substr(2, 9),
              type,
              author: 'Current User', 
              date: now.toLocaleDateString('sk-SK'),
              timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              content
          };
          
          let newStatus = f.status;
          if (type === 'status_change') {
              newStatus = content as 'open' | 'resolved' | 'closed';
          }
          
          return { ...f, status: newStatus, activities: [...f.activities, newActivity] };
      }));
  };

  const handleReopenRequest = () => {
      setPendingAction('reopen');
      setTimeout(() => {
          textareaRef.current?.focus();
      }, 50);
  };

  const submitComment = () => {
      if (!selectedFeedbackId || !newCommentText.trim()) return;
      if (pendingAction === 'reopen') {
          addActivity(selectedFeedbackId, 'status_change', 'open');
          setPendingAction(null);
      }
      addActivity(selectedFeedbackId, 'comment', newCommentText.trim());
      setNewCommentText("");
      
      // Keďže poslal komentár a úloha bola "Draft", autofokus chceme vrátiť (voliteľné)
      setTimeout(() => textareaRef.current?.focus(), 50);
  };

  // --- LOGIKA FILTROVANIA A ZORADOVANIA ---
  const filteredAndSortedFeedbacks = feedbacks
    .filter(f => filterStatus === 'all' || f.status === filterStatus)
    .sort((a, b) => {
        if (sortBy === 'newest') return b.createdAt - a.createdAt;
        if (sortBy === 'oldest') return a.createdAt - b.createdAt;
        if (sortBy === 'status') {
            const order = { open: 1, resolved: 2, closed: 3 };
            return order[a.status] - order[b.status];
        }
        return 0;
    });

  // --- HELPERS ---
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
          case 'open': return 'border-amber-500/50'; 
          case 'resolved': return 'border-blue-900'; 
          case 'closed': return 'border-green-900'; 
          default: return 'border-zinc-800';
      }
  };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'open': return <span className="px-1.5 py-0.5 rounded-[4px] bg-amber-500/20 text-amber-500 text-[8px] font-bold uppercase tracking-wider border border-amber-500/20">Created</span>;
          case 'resolved': return <span className="px-1.5 py-0.5 rounded-[4px] bg-blue-500/20 text-blue-400 text-[8px] font-bold uppercase tracking-wider border border-blue-500/20">Review</span>;
          case 'closed': return <span className="px-1.5 py-0.5 rounded-[4px] bg-green-500/20 text-green-400 text-[8px] font-bold uppercase tracking-wider border border-green-500/20">Done</span>;
          default: return null;
      }
  };

  const getLayoutBtnStyle = (pos: DockPosition) => pos === position ? "text-purple-400 scale-110" : "text-white hover:text-purple-300 opacity-70 hover:opacity-100";
  const getCardPositionClasses = () => {
    switch (position) {
        case 'left': return "left-5 top-5 bottom-5 w-[420px]";
        case 'bottom': return "left-20 right-20 bottom-5 h-[350px]";
        case 'right': default: return "right-5 top-5 bottom-5 w-[420px]";
    }
  };

  // NOVÉ: Dynamický Guidance Info podľa toho, či úloha už má nejaký komentár
  const getGuidanceInfo = (feedback: FeedbackItem) => {
      if (feedback.status === 'open') {
          const hasComments = feedback.activities.some(a => a.type === 'comment');
          if (!hasComments) {
              return {
                  title: 'Draft - Ready to Submit', 
                  desc: 'Describe what needs to be changed. Sending the first comment will submit this task to the developer.',
                  bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500', icon: 'text-amber-400'
              };
          }
          return {
              title: 'Submitted & Waiting for Developer', 
              desc: 'This issue is submitted. Our team is working on a fix and will notify you soon.',
              bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500', icon: 'text-amber-400'
          };
      }
      if (feedback.status === 'resolved') {
          return {
              title: 'Your turn! Action Required', 
              desc: 'The developer marked this as fixed. Please review it on the site and click Approve.',
              bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: 'text-blue-400'
          };
      }
      if (feedback.status === 'closed') {
          return {
              title: 'Done & Approved', 
              desc: 'This task is officially closed. If it breaks again, you can use the Reopen button.',
              bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-500', icon: 'text-green-400'
          };
      }
      return { title: '', desc: '', bg: '', border: '', text: '', icon: ''};
  };

  // --- RENDER ---
  if (isLoading) return <div className="h-screen w-screen bg-black flex items-center justify-center text-zinc-500 font-condensed tracking-widest">LOADING...</div>;
  if (!isValid) return <div className="h-screen bg-black text-white flex justify-center items-center font-sans font-bold">404 - Project not found</div>;

  const selectedFeedback = feedbacks.find(f => f.id === selectedFeedbackId);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans flex flex-col">
      <div className="flex-grow overflow-auto relative w-full h-full bg-zinc-100">
         <div style={{ height: `${iframeHeight}px`, width: '100%', position: 'relative' }}>
            
            <iframe
                ref={iframeRef}
                src={`/api/proxy?url=${encodeURIComponent(targetUrl)}`}
                className={`w-full h-full border-none bg-white block transition-colors ${mode === 'comment' ? 'cursor-crosshair' : 'cursor-auto'}`}
                title="Website"
                scrolling="no" 
                onLoad={() => iframeRef.current?.contentWindow?.postMessage({ type: 'setMode', mode }, '*')}
            />
            
            {/* PINS ON WEB */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                <AnimatePresence>
                    {filteredAndSortedFeedbacks.map((f) => (
                        <motion.div 
                            key={f.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            style={{ top: `${f.y}px`, left: `${f.x}px` }} 
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto"
                            onClick={() => setSelectedFeedbackId(f.id)} 
                        >
                            <div className={`w-8 h-8 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center cursor-pointer hover:scale-125 transition-transform font-bold text-xs font-condensed border-2 border-white ${getStatusColor(f.status)}`}>
                                {f.pinNumber}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
         </div>
      </div>

      <motion.div 
        layout 
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        className={`fixed z-50 rounded-[24px] shadow-2xl border border-white/5 bg-[#121212] flex flex-col overflow-hidden ${getCardPositionClasses()}`}
      >
        <div className="p-0 flex flex-col h-full overflow-hidden w-full relative">
            
            {/* HLAVIČKA SIDEBARU */}
            <div className="p-5 pb-4 border-b border-white/5 flex-shrink-0 bg-[#121212] z-20">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold italic text-lg shadow-lg">x</div>
                        <div>
                            <h1 className="text-white font-bold text-md tracking-tight">xVisual</h1>
                            <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest font-condensed">Feedback Tool</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setPosition('left')} className={`transition-all ${getLayoutBtnStyle('left')}`}><PanelLeft size={20} strokeWidth={2} /></button>
                        <button onClick={() => setPosition('bottom')} className={`transition-all ${getLayoutBtnStyle('bottom')}`}><PanelBottom size={20} strokeWidth={2} /></button>
                        <button onClick={() => setPosition('right')} className={`transition-all ${getLayoutBtnStyle('right')}`}><PanelRight size={20} strokeWidth={2} /></button>
                    </div>
                </div>

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
                    <Tab key="comment" title={<div className="flex gap-2 items-center"><MessageSquare size={16}/><span>COMMENT</span></div>} />
                    <Tab key="browse" title={<div className="flex gap-2 items-center"><MousePointerClick size={16}/><span>BROWSE</span></div>} />
                </Tabs>
            </div>

            <div className="flex-grow relative overflow-hidden bg-[#121212]">
                <AnimatePresence mode="wait">
                    
                    {/* ZOBRAZENIE 1: ZOZNAM ÚLOH */}
                    {!selectedFeedbackId ? (
                        <motion.div 
                            key="list-view"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -30, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex flex-col p-4 overflow-hidden"
                        >
                            
                            {/* FILTER A SORT LIŠTA */}
                            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                                    <button onClick={() => setFilterStatus('all')} className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-colors ${filterStatus === 'all' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>All</button>
                                    <button onClick={() => setFilterStatus('open')} className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-colors ${filterStatus === 'open' ? 'bg-amber-500/20 text-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`}>Created</button>
                                    <button onClick={() => setFilterStatus('resolved')} className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-colors ${filterStatus === 'resolved' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-500 hover:text-zinc-300'}`}>Review</button>
                                    <button onClick={() => setFilterStatus('closed')} className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-colors ${filterStatus === 'closed' ? 'bg-green-500/20 text-green-400' : 'text-zinc-500 hover:text-zinc-300'}`}>Done</button>
                                </div>
                                
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value as SortType)}
                                    className="bg-transparent border border-white/10 hover:border-white/30 transition-colors rounded-lg text-[11px] font-sans text-zinc-400 p-1.5 outline-none cursor-pointer"
                                >
                                    <option value="newest" className="bg-zinc-900">Newest first</option>
                                    <option value="oldest" className="bg-zinc-900">Oldest first</option>
                                    <option value="status" className="bg-zinc-900">By status</option>
                                </select>
                            </div>

                            <ScrollShadow className="flex-grow overflow-y-auto space-y-3 pb-4 pr-1">
                                {filteredAndSortedFeedbacks.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center opacity-40 mt-10">
                                        <Filter size={40} className="text-zinc-500 mb-4" />
                                        <p className="text-zinc-400 text-sm font-sans">No tasks match this filter.</p>
                                    </div>
                                ) : (
                                    <div className={position === 'bottom' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" : "flex flex-col gap-3"}>
                                        {filteredAndSortedFeedbacks.map((f) => {
                                            const firstComment = f.activities.find(a => a.type === 'comment');
                                            
                                            return (
                                            <div 
                                                key={f.id} 
                                                onClick={() => setSelectedFeedbackId(f.id)}
                                                onMouseEnter={() => handleTaskHover(f.selector)}
                                                onMouseLeave={handleTaskLeave}
                                                className={`p-4 rounded-xl border transition-all cursor-pointer bg-[#18181b] group ${getStatusBorder(f.status)} hover:border-opacity-100 border-opacity-50`}
                                            >
                                                <div className="flex justify-between items-start mb-3 gap-2">
                                                    <div className="flex items-center gap-3 overflow-hidden flex-grow">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${getStatusColor(f.status)}`}>
                                                            {f.pinNumber}
                                                        </div>
                                                        <div className="flex flex-col justify-center gap-0.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-zinc-200 font-bold font-sans">
                                                                    {firstComment ? firstComment.author : 'New Task'}
                                                                </span>
                                                                {getStatusBadge(f.status)}
                                                            </div>
                                                            <span className="text-[10px] text-zinc-500 font-sans">
                                                                {firstComment ? `${firstComment.date} • ${firstComment.timestamp}` : 'Just now'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <p className={`text-sm font-sans font-normal leading-snug mb-4 pl-1 line-clamp-2 ${f.status === 'closed' ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>
                                                    {firstComment ? firstComment.content : <span className="italic text-zinc-500">Draft. Needs description...</span>}
                                                </p>

                                                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                                    <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded border border-white/5 max-w-[60%] overflow-hidden">
                                                        <ScanLine size={10} className="text-zinc-500 flex-shrink-0" />
                                                        <span className="text-[10px] text-zinc-400 font-condensed font-mono truncate">{f.selector}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-sans font-medium bg-white/5 px-2 py-1 rounded">
                                                        <MessageSquare size={12} />
                                                        <span>{f.activities.filter(a => a.type === 'comment').length}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )})}
                                    </div>
                                )}
                            </ScrollShadow>
                        </motion.div>

                    ) : selectedFeedback ? (
                        
                        /* ZOBRAZENIE 2: DETAIL VLÁKNA */
                        <motion.div 
                            key="detail-view"
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 30, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex flex-col bg-[#121212]"
                        >
                            <div className="px-4 py-3 bg-[#18181b] flex items-center justify-between z-10 flex-shrink-0 border-b border-white/5">
                                <button 
                                    onClick={() => setSelectedFeedbackId(null)}
                                    className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase font-sans tracking-wide"
                                >
                                    <ChevronLeft size={14} /> Back
                                </button>
                                <div className="flex items-center gap-3">
                                    <span className="text-zinc-500 font-mono text-xs">#{selectedFeedback.pinNumber}</span>
                                    <button 
                                        onClick={() => {
                                            setFeedbacks(prev => prev.filter(item => item.id !== selectedFeedbackId));
                                            setSelectedFeedbackId(null);
                                        }}
                                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-[#18181b] border-b border-white/5 px-4 pb-4 flex-shrink-0 pt-4">
                                
                                <div className="flex items-center justify-between relative mb-4 px-2">
                                    <div className="absolute left-[15%] right-[15%] top-1/2 h-[2px] bg-white/5 -translate-y-1/2 z-0"></div>
                                    
                                    <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#18181b] px-2">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedFeedback.status === 'open' ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-amber-500/20 text-amber-500'}`}>
                                            {selectedFeedback.status === 'open' ? '1' : <Check size={12}/>}
                                        </div>
                                        <span className={`text-[9px] uppercase tracking-wider font-bold ${selectedFeedback.status === 'open' ? 'text-amber-500' : 'text-zinc-500'}`}>Reported</span>
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#18181b] px-2">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedFeedback.status === 'resolved' ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : selectedFeedback.status === 'closed' ? 'bg-blue-600/20 text-blue-500' : 'bg-black/40 text-zinc-600 border border-white/5'}`}>
                                            {selectedFeedback.status === 'closed' ? <Check size={12}/> : '2'}
                                        </div>
                                        <span className={`text-[9px] uppercase tracking-wider font-bold ${selectedFeedback.status === 'resolved' ? 'text-blue-400' : 'text-zinc-600'}`}>Resolved</span>
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#18181b] px-2">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedFeedback.status === 'closed' ? 'bg-green-600 text-white shadow-[0_0_10px_rgba(22,163,74,0.5)]' : 'bg-black/40 text-zinc-600 border border-white/5'}`}>
                                            {selectedFeedback.status === 'closed' ? <Check size={12}/> : '3'}
                                        </div>
                                        <span className={`text-[9px] uppercase tracking-wider font-bold ${selectedFeedback.status === 'closed' ? 'text-green-400' : 'text-zinc-600'}`}>Approved</span>
                                    </div>
                                </div>

                                {(() => {
                                    const guide = getGuidanceInfo(selectedFeedback);
                                    return (
                                        <div className={`p-3 rounded-xl border flex flex-col gap-3 ${guide.bg} ${guide.border}`}>
                                            <div className="flex gap-3 items-start">
                                                <Info size={16} className={`flex-shrink-0 mt-0.5 ${guide.icon}`} />
                                                <div className="flex flex-col">
                                                    <span className={`text-[11px] uppercase tracking-wider font-bold font-sans mb-1 ${guide.text}`}>{guide.title}</span>
                                                    <span className="text-[11px] text-zinc-300 font-sans leading-relaxed">{guide.desc}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 ml-7 mt-1">
                                                {selectedFeedback.status === 'open' && selectedFeedback.activities.some(a => a.type === 'comment') && (
                                                    <button 
                                                        onClick={() => addActivity(selectedFeedback.id, 'status_change', 'resolved')}
                                                        className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 uppercase transition-colors"
                                                    >
                                                        <Wrench size={12} /> Resolve Task
                                                    </button>
                                                )}

                                                {selectedFeedback.status === 'resolved' && (
                                                    <>
                                                        <button 
                                                            onClick={() => addActivity(selectedFeedback.id, 'status_change', 'closed')}
                                                            className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 uppercase transition-colors"
                                                        >
                                                            <Check size={12} /> Approve Fix
                                                        </button>
                                                        <button 
                                                            onClick={handleReopenRequest}
                                                            className="bg-zinc-800 hover:bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 uppercase transition-colors"
                                                        >
                                                            <RotateCcw size={12} /> Reopen...
                                                        </button>
                                                    </>
                                                )}

                                                {selectedFeedback.status === 'closed' && (
                                                    <button 
                                                        onClick={handleReopenRequest}
                                                        className="bg-zinc-800 hover:bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 uppercase transition-colors"
                                                    >
                                                        <RotateCcw size={12} /> Reopen Task...
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>


                            <ScrollShadow className="flex-grow p-4 space-y-4 overflow-y-auto">
                                {selectedFeedback.activities.length === 0 ? (
                                    <div className="text-center text-zinc-500 text-xs italic mt-4 font-sans">Draft state. Add the first comment below.</div>
                                ) : (
                                    selectedFeedback.activities.map((act) => (
                                        act.type === 'comment' ? (
                                            <div key={act.id} className="flex gap-3">
                                                <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[11px] font-bold font-sans uppercase flex-shrink-0 mt-1">
                                                    {act.author.charAt(0)}
                                                </div>
                                                <div className="flex flex-col w-full">
                                                    <div className="flex items-baseline gap-2 mb-1">
                                                        <span className="text-xs text-white font-bold font-sans">{act.author}</span>
                                                        <span className="text-[10px] text-zinc-600 font-sans">{act.date} {act.timestamp}</span>
                                                    </div>
                                                    <div className="bg-[#18181b] border border-white/5 p-3 rounded-2xl rounded-tl-sm text-sm text-zinc-300 font-sans leading-relaxed">
                                                        {act.content}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={act.id} className="flex items-center justify-center gap-3 py-2 w-full opacity-90">
                                                <div className="h-px bg-white/10 flex-grow"></div>
                                                <div className="flex items-center gap-1.5 whitespace-nowrap text-[10px] font-sans">
                                                    <span className={`font-bold uppercase tracking-wider ${act.content === 'resolved' ? 'text-blue-400' : act.content === 'open' ? 'text-amber-400' : 'text-green-400'}`}>
                                                        {act.content}
                                                    </span>
                                                    <span className="text-zinc-500">
                                                        marked by <span className="text-zinc-300">{act.author}</span> <span className="mx-1 text-zinc-700">•</span> {act.date} {act.timestamp}
                                                    </span>
                                                </div>
                                                <div className="h-px bg-white/10 flex-grow"></div>
                                            </div>
                                        )
                                    ))
                                )}
                            </ScrollShadow>

                            {/* Spodná časť: Iba Input */}
                            <div className="p-4 bg-[#18181b] border-t border-white/5 flex-shrink-0 relative">
                                
                                <AnimatePresence>
                                    {pendingAction === 'reopen' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute -top-10 left-4 right-4 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-t-xl flex justify-between items-center z-0"
                                        >
                                            <span className="flex items-center gap-1.5"><RotateCcw size={12}/> Please provide a reason to reopen</span>
                                            <button onClick={() => setPendingAction(null)} className="hover:text-white p-0.5"><X size={14}/></button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex gap-2 relative z-10">
                                    <textarea
                                        ref={textareaRef}
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                submitComment();
                                            }
                                        }}
                                        placeholder={
                                            pendingAction === 'reopen' ? "Reason for reopening (Required)..." : 
                                            selectedFeedback.activities.length === 0 ? "Describe the issue..." : 
                                            "Add a comment... (Press Enter to send)"
                                        }
                                        className={`w-full bg-black/40 border rounded-xl p-3 text-sm text-white font-sans focus:outline-none resize-none transition-colors
                                            ${pendingAction === 'reopen' ? 'border-amber-500 focus:border-amber-400' : 'border-white/10 focus:border-purple-500'}
                                        `}
                                        rows={2}
                                    />
                                    <button 
                                        onClick={submitComment}
                                        disabled={!newCommentText.trim()}
                                        className={`w-12 rounded-xl flex items-center justify-center transition-colors 
                                            ${!newCommentText.trim() ? 'bg-white/5 text-zinc-600 cursor-not-allowed' : 
                                                pendingAction === 'reopen' ? 'bg-amber-500 hover:bg-amber-400 text-black cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer'}
                                        `}
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function InspectPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-black text-white flex items-center justify-center tracking-widest font-condensed">LOADING...</div>}>
      <InspectContent />
    </Suspense>
  );
}