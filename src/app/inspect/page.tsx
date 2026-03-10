"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Card, CardBody, ScrollShadow, Tab, Tabs, Button, Tooltip 
} from "@heroui/react"; 
import { 
  Check, MessageSquare, MousePointerClick, 
  PanelLeft, PanelRight, PanelBottom, Ghost, Home, Trash2, ScanLine, Pointer, Coffee, Wrench, RotateCcw, ChevronLeft, ChevronRight, Send, Info, X, Filter, Monitor, Tablet, Smartphone, Laptop, Globe, Unlink, RefreshCw, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// IMPORT NÁŠHO NOVÉHO SYSTÉMU PREKLADOV
import { useTranslation } from "@/hooks/useTranslation";
import { Language } from "@/i18n/dictionaries";

type ActivityType = 'comment' | 'status_change';

interface Activity {
  id: string;
  type: ActivityType;
  author: string;
  date: string;
  timestamp: string;
  content: string; 
}

type ViewportSize = 'mobile' | 'sm' | 'md' | 'lg' | 'desktop';

interface ElementFingerprint {
  exactPath: string;
  semanticPath: string;
  textContent: string;
  tagName: string;
  relativeX: number;
  relativeY: number;
}

interface FeedbackItem {
  id: string;
  pinNumber: number; 
  createdAt: number; 
  fingerprint: ElementFingerprint; 
  x: number;
  y: number;
  status: 'open' | 'resolved' | 'closed'; 
  viewport: ViewportSize; 
  pageUrl: string; 
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
  const scrollContainerRef = useRef<HTMLDivElement>(null); 
  const projectHash = searchParams.get('project');
  
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE PRE JAZYK PROJEKTU ---
  const [projectLang, setProjectLang] = useState<Language>('en'); 
  const { t } = useTranslation(projectLang);

  const initialUrl = "https://dennikn.sk";
  const [targetUrl, setTargetUrl] = useState(initialUrl);
  const [urlHistory, setUrlHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [dynamicPositions, setDynamicPositions] = useState<Record<string, {x: number, y: number, orphaned: boolean}>>({});
  const dynamicPositionsRef = useRef(dynamicPositions);
  useEffect(() => { dynamicPositionsRef.current = dynamicPositions; }, [dynamicPositions]);
  
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);
  
  const [newCommentText, setNewCommentText] = useState(""); 
  const [pendingAction, setPendingAction] = useState<'reopen' | null>(null);
  
  const [filterStatus, setFilterStatus] = useState<FilterType>('all');
  const [filterViewport, setFilterViewport] = useState<ViewportSize | 'all'>('all'); 
  const [sortBy, setSortBy] = useState<SortType>('newest');
  
  const [mode, setMode] = useState<'comment' | 'browse'>('browse'); 
  const [position, setPosition] = useState<DockPosition>('right');
  const [iframeHeight, setIframeHeight] = useState(1000); 
  
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  
  const viewportRef = useRef(viewport);
  useEffect(() => { viewportRef.current = viewport; }, [viewport]);

  useEffect(() => {
      setPendingAction(null);
      setNewCommentText("");
  }, [selectedFeedbackId]);

  useEffect(() => {
    if (selectedFeedbackId) {
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 300);
    }
  }, [selectedFeedbackId]);

  useEffect(() => {
    const validate = async () => {
      await new Promise(r => setTimeout(r, 500));
      if (projectHash === "xV9y2m4k8p1l5n0q3r7z9w2a") {
        setIsValid(true);
        // Simulácia načítania nastavení projektu z DB. MOCK na Nemčinu (DE)!
        setProjectLang('de'); 

        setTargetUrl(initialUrl);
        setUrlHistory([initialUrl]);
        setHistoryIndex(0);
        setFeedbacks([]); 
        setIframeHeight(2500); 
      } else {
        setIsValid(false);
      }
      setIsLoading(false);
    };
    if (projectHash) validate();
    else { setIsValid(false); setIsLoading(false); }
  }, [projectHash]);

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'setMode', mode }, '*');
    }
  }, [mode]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.source !== 'xvisual-iframe') return;

      if (event.data.type === 'iframeReady') {
          const currentFeedbacks = feedbacks.filter(f => f.pageUrl === targetUrl);
          const itemsToTrack = currentFeedbacks.map(f => ({ id: f.id, fingerprint: f.fingerprint }));
          iframeRef.current?.contentWindow?.postMessage({ 
              type: 'trackItems', 
              items: itemsToTrack 
          }, '*');
          iframeRef.current?.contentWindow?.postMessage({ type: 'setMode', mode }, '*');
      }

      if (event.data.type === 'urlChange') {
          const newUrl = event.data.url;
          if (newUrl !== targetUrl) {
              setTargetUrl(newUrl);
              setUrlHistory(prev => {
                  const newHistory = prev.slice(0, historyIndex + 1);
                  newHistory.push(newUrl);
                  return newHistory;
              });
              setHistoryIndex(prev => prev + 1);
          }
      }
      
      if (event.data.type === 'resize') setIframeHeight(event.data.height);
      if (event.data.type === 'itemPositions') setDynamicPositions(event.data.positions);

      if (event.data.type === 'feedback') {
        const newId = Math.random().toString(36).substr(2, 9);
        
        setFeedbacks(prev => {
            const cleanedFeedbacks = prev.filter(f => f.activities.length > 0);
            const nextPinNumber = cleanedFeedbacks.length > 0 ? Math.max(...cleanedFeedbacks.map(p => p.pinNumber)) + 1 : 1;
            const newFeedback: FeedbackItem = {
                id: newId,
                pinNumber: nextPinNumber,
                createdAt: Date.now(),
                fingerprint: event.data.fingerprint, 
                x: event.data.x, 
                y: event.data.y, 
                status: 'open',
                viewport: viewportRef.current, 
                pageUrl: targetUrl, 
                activities: [] 
            };
            return [...cleanedFeedbacks, newFeedback];
        });
        
        setSelectedFeedbackId(newId);
        setMode('browse'); 
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [targetUrl, historyIndex, feedbacks, mode]); 

  const handleBack = () => {
      if (historyIndex > 0) {
          const newIdx = historyIndex - 1;
          setHistoryIndex(newIdx);
          setTargetUrl(urlHistory[newIdx]);
      }
  };

  const handleForward = () => {
      if (historyIndex < urlHistory.length - 1) {
          const newIdx = historyIndex + 1;
          setHistoryIndex(newIdx);
          setTargetUrl(urlHistory[newIdx]);
      }
  };

  useEffect(() => {
      if (selectedFeedbackId) {
          const f = feedbacks.find(item => item.id === selectedFeedbackId);
          if (f && f.pageUrl === targetUrl) {
              if (iframeRef.current?.contentWindow) {
                  iframeRef.current.contentWindow.postMessage({ type: 'highlightElement', fingerprint: f.fingerprint, status: f.status }, '*');
              }
          }
      } else {
          if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage({ type: 'removeHighlight' }, '*');
          }
      }
  }, [selectedFeedbackId, feedbacks, targetUrl, refreshKey]); 

  useEffect(() => {
      if (pendingScrollId && selectedFeedbackId === pendingScrollId) {
          const f = feedbacks.find(item => item.id === pendingScrollId);
          if (f && f.pageUrl === targetUrl && dynamicPositions[pendingScrollId]) {
              const dynPos = dynamicPositions[pendingScrollId];
              if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({
                      top: Math.max(0, dynPos.y - (window.innerHeight / 3)),
                      behavior: 'smooth'
                  });
              }
              setPendingScrollId(null);
          }
      }
  }, [dynamicPositions, pendingScrollId, selectedFeedbackId, targetUrl, feedbacks]);

  const handleIframeLoad = () => {
      iframeRef.current?.contentWindow?.postMessage({ type: 'setMode', mode }, '*');
  };

  const handleTaskHover = (f: FeedbackItem) => {
      if (iframeRef.current?.contentWindow && f.pageUrl === targetUrl) {
          iframeRef.current.contentWindow.postMessage({ type: 'highlightElement', fingerprint: f.fingerprint, status: f.status }, '*');
      }
  };

  const handleTaskLeave = () => {
      if (iframeRef.current?.contentWindow) {
          if (selectedFeedbackId) {
              const f = feedbacks.find(item => item.id === selectedFeedbackId);
              if (f && f.pageUrl === targetUrl) {
                  iframeRef.current.contentWindow.postMessage({ type: 'highlightElement', fingerprint: f.fingerprint, status: f.status }, '*');
              }
          } else {
              iframeRef.current.contentWindow.postMessage({ type: 'removeHighlight' }, '*');
          }
      }
  };

  const addActivity = (feedbackId: string, type: ActivityType, content: string) => {
      setFeedbacks(prev => prev.map(f => {
          if (f.id !== feedbackId) return f;
          const now = new Date();
          const newActivity: Activity = {
              id: Math.random().toString(36).substr(2, 9),
              type,
              author: 'Current User', 
              date: now.toLocaleDateString(projectLang === 'en' ? 'en-US' : projectLang === 'de' ? 'de-DE' : 'sk-SK'),
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
      
      const currentId = selectedFeedbackId;
      
      if (pendingAction === 'reopen') {
          addActivity(currentId, 'status_change', 'open');
          setPendingAction(null);
      }
      
      addActivity(currentId, 'comment', newCommentText.trim());
      
      setSelectedFeedbackId(null);
      setNewCommentText("");
      setPendingAction(null);
  };

  const filteredAndSortedFeedbacks = feedbacks
    .filter(f => filterStatus === 'all' || f.status === filterStatus)
    .filter(f => filterViewport === 'all' || f.viewport === filterViewport) 
    .sort((a, b) => {
        if (sortBy === 'newest') return b.createdAt - a.createdAt;
        if (sortBy === 'oldest') return a.createdAt - b.createdAt;
        if (sortBy === 'status') {
            const order = { open: 1, resolved: 2, closed: 3 };
            return order[a.status] - order[b.status];
        }
        return 0;
    });

  const canvasFeedbacks = filteredAndSortedFeedbacks.filter(f => f.pageUrl === targetUrl);

  const getViewportIcon = (vp: ViewportSize, size = 12) => {
      if (vp === 'mobile') return <Smartphone size={size} />;
      if (vp === 'sm') return <Smartphone size={size} className="rotate-90" />;
      if (vp === 'md') return <Tablet size={size} />;
      if (vp === 'lg') return <Laptop size={size} />;
      return <Monitor size={size} />;
  };

  const getViewportLabel = (vp: ViewportSize) => {
      if (vp === 'mobile') return t('viewport.mobile');
      if (vp === 'sm') return t('viewport.sm');
      if (vp === 'md') return t('viewport.md');
      if (vp === 'lg') return t('viewport.lg');
      return t('viewport.desktop');
  };

  const getDisplayPath = (urlString: string) => {
      try {
          const u = new URL(urlString);
          return u.pathname === '/' ? u.hostname : u.pathname;
      } catch (e) {
          return urlString;
      }
  };

  const getDisplaySelector = (fp: ElementFingerprint) => {
      if (fp.semanticPath && fp.semanticPath.includes('.')) return fp.semanticPath;
      if (fp.tagName) return `<${fp.tagName.toLowerCase()}>`;
      return t('misc.changedElement');
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
          case 'open': return 'border-amber-500/50'; 
          case 'resolved': return 'border-blue-900'; 
          case 'closed': return 'border-green-900'; 
          default: return 'border-zinc-800';
      }
  };

  const renderPin = (pinNumber: number, status: string, isOrphaned: boolean, isCanvas: boolean = false) => {
      if (isOrphaned) {
          const solidColor = status === 'open' ? 'text-amber-500 fill-amber-500' : status === 'resolved' ? 'text-blue-500 fill-blue-500' : 'text-green-500 fill-green-500';
          
          return (
              <div className={`relative flex items-center justify-center ${isCanvas ? 'animate-pulse drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform cursor-pointer' : ''}`}>
                  <Ghost size={isCanvas ? 38 : 30} className={solidColor} strokeWidth={1} />
                  <span className={`absolute ${isCanvas ? 'mt-[3px] text-[14px]' : 'mt-[2px] text-[11px]'} font-bold text-white font-condensed drop-shadow-md`}>
                      {pinNumber}
                  </span>
              </div>
          );
      }
      
      return (
          <div className={`${isCanvas ? 'w-8 h-8 shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:scale-125 cursor-pointer text-xs' : 'w-8 h-8 text-[11px]'} rounded-full flex items-center justify-center transition-transform font-bold font-condensed border-2 border-white ${getStatusColor(status)}`}>
              {pinNumber}
          </div>
      );
  };

  const getStatusPipeline = (feedback: FeedbackItem) => {
      const status = feedback.status;
      const baseText = "text-[8.5px] font-bold uppercase tracking-wider transition-colors";
      const separator = <span className="text-zinc-700 text-[8.5px] mx-1">›</span>;
      let subText = "";
      if (status === 'open') subText = feedback.activities.some(a => a.type === 'comment') ? t('pipeline.waitingAgency') : t('pipeline.draft');
      else if (status === 'resolved') subText = t('pipeline.waitingClient');
      else if (status === 'closed') subText = t('pipeline.completed');

      return (
          <div className="flex flex-col items-end justify-between h-full py-0.5">
              <div className="flex items-center bg-black/40 px-2 py-[3px] rounded border border-white/5 -mt-0.5">
                  <span className={`${baseText} ${status === 'open' ? 'text-amber-500' : 'text-zinc-600'}`}>{t('status.open')}</span>
                  {separator}
                  <span className={`${baseText} ${status === 'resolved' ? 'text-blue-400' : 'text-zinc-600'}`}>{t('status.resolved')}</span>
                  {separator}
                  <span className={`${baseText} ${status === 'closed' ? 'text-green-400' : 'text-zinc-600'}`}>{t('status.closed')}</span>
              </div>
              <span className="text-[10px] text-white font-sans tracking-wide px-1 leading-none mb-0.5">{subText}</span>
          </div>
      );
  };

  const getLayoutBtnStyle = (pos: DockPosition) => pos === position 
      ? "bg-purple-600 text-white shadow-lg" 
      : "text-zinc-400 hover:text-white hover:bg-white/10";

  const getCardPositionClasses = () => {
    switch (position) {
        case 'left': return "left-5 top-5 bottom-5 w-[420px]";
        case 'bottom': return "left-20 right-20 bottom-5 h-[350px]";
        case 'right': default: return "right-5 top-5 bottom-5 w-[420px]";
    }
  };

  const getGuidanceInfo = (feedback: FeedbackItem) => {
      if (feedback.status === 'open') {
          const hasComments = feedback.activities.some(a => a.type === 'comment');
          if (!hasComments) return { title: t('guide.draftTitle'), desc: t('guide.draftDesc'), bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500', icon: 'text-amber-400' };
          return { title: t('guide.waitingTitle'), desc: t('guide.waitingDesc'), bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500', icon: 'text-amber-400' };
      }
      if (feedback.status === 'resolved') return { title: t('guide.resolvedTitle'), desc: t('guide.resolvedDesc'), bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: 'text-blue-400' };
      if (feedback.status === 'closed') return { title: t('guide.closedTitle'), desc: t('guide.closedDesc'), bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-500', icon: 'text-green-400' };
      return { title: '', desc: '', bg: '', border: '', text: '', icon: ''};
  };

  const getViewportWidth = () => {
      switch(viewport) {
          case 'mobile': return '390px'; 
          case 'sm': return '640px';     
          case 'md': return '768px';     
          case 'lg': return '1024px';    
          case 'desktop': return '100%'; 
      }
  };

  if (isLoading) return <div className="h-screen w-screen bg-black flex items-center justify-center text-zinc-500 font-condensed tracking-widest">LOADING...</div>;
  if (!isValid) return <div className="h-screen bg-black text-white flex justify-center items-center font-sans font-bold">404 - Project not found</div>;

  const selectedFeedback = feedbacks.find(f => f.id === selectedFeedbackId);
  const isSelectedOrphaned = selectedFeedback && dynamicPositions[selectedFeedback.id]?.orphaned;

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans flex flex-col">
      
      <div 
        ref={scrollContainerRef} 
        className="flex-grow overflow-auto relative w-full h-full bg-zinc-200 flex justify-center scroll-smooth"
      >
         <div 
            style={{ 
                height: `${iframeHeight}px`, 
                width: getViewportWidth(),
                minWidth: getViewportWidth(),
                position: 'relative',
                backgroundColor: 'white',
                boxShadow: viewport !== 'desktop' ? '0 0 50px rgba(0,0,0,0.1)' : '0 0 0px rgba(0,0,0,0)',
                transition: 'width 0.4s ease-in-out, min-width 0.4s ease-in-out, box-shadow 0.4s ease-in-out'
            }}
         >
            <iframe
                ref={iframeRef}
                src={`/api/proxy?url=${encodeURIComponent(targetUrl)}&_t=${refreshKey}`}
                className={`w-full h-full border-none bg-white block transition-colors ${mode === 'comment' ? 'cursor-crosshair' : 'cursor-auto'}`}
                title="Website"
                scrolling="no" 
                onLoad={handleIframeLoad} 
            />
            
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                <AnimatePresence>
                    {canvasFeedbacks.map((f) => {
                        const dynPos = dynamicPositions[f.id];
                        
                        const posX = dynPos ? dynPos.x : f.x;
                        const posY = dynPos ? dynPos.y : f.y;
                        const isOrphaned = dynPos ? dynPos.orphaned : false;

                        const pinElement = renderPin(f.pinNumber, f.status, isOrphaned, true);

                        return (
                        <motion.div 
                            key={f.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            style={{ top: `${posY}px`, left: `${posX}px` }} 
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto"
                            onClick={() => {
                                if (selectedFeedbackId && selectedFeedbackId !== f.id) {
                                    setFeedbacks(prev => prev.filter(item => item.activities.length > 0 || item.id === f.id));
                                    setNewCommentText("");
                                    setPendingAction(null);
                                }
                                setSelectedFeedbackId(f.id);
                                setViewport(f.viewport);
                            }} 
                        >
                            {isOrphaned ? (
                                <Tooltip content={t('tooltips.orphanCanvas')} className="bg-black text-white text-[10px] font-sans">
                                    <div>{pinElement}</div>
                                </Tooltip>
                            ) : (
                                pinElement
                            )}
                        </motion.div>
                    )})}
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
            
            <div className="p-5 pb-4 border-b border-white/5 flex-shrink-0 bg-[#121212] z-20">
                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold italic text-lg shadow-lg">x</div>
                        <div>
                            <h1 className="text-white font-bold text-md tracking-tight">xVisual</h1>
                            <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest font-condensed">{t('misc.feedbackTool')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPosition('left')} className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${getLayoutBtnStyle('left')}`}><PanelLeft size={16} strokeWidth={2.5} /></button>
                        <button onClick={() => setPosition('bottom')} className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${getLayoutBtnStyle('bottom')}`}><PanelBottom size={16} strokeWidth={2.5} /></button>
                        <button onClick={() => setPosition('right')} className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${getLayoutBtnStyle('right')}`}><PanelRight size={16} strokeWidth={2.5} /></button>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-5 bg-black/40 border border-white/5 rounded-xl p-1.5 shadow-inner">
                    <div className="flex items-center gap-1">
                        <Tooltip content={t('tooltips.back')} delay={0} className="bg-black text-white text-[10px]">
                            <button disabled={historyIndex === 0} onClick={handleBack} className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                                <ChevronLeft size={14} />
                            </button>
                        </Tooltip>
                        <Tooltip content={t('tooltips.forward')} delay={0} className="bg-black text-white text-[10px]">
                            <button disabled={historyIndex === urlHistory.length - 1} onClick={handleForward} className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                                <ChevronRight size={14} />
                            </button>
                        </Tooltip>
                        <Tooltip content={t('tooltips.refresh')} delay={0} className="bg-black text-white text-[10px]">
                            <button onClick={() => setRefreshKey(Date.now())} className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                                <RefreshCw size={12} />
                            </button>
                        </Tooltip>
                    </div>
                    
                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                    
                    <div className="flex items-center gap-2 px-2 text-[10px] font-mono text-zinc-400 flex-grow overflow-hidden">
                        <Globe size={10} className="flex-shrink-0" />
                        <span className="truncate">{targetUrl}</span>
                    </div>

                    <div className="w-px h-3 bg-white/10 mx-1"></div>

                    <Tooltip content={t('tooltips.newWindow')} delay={0} className="bg-black text-white text-[10px] font-sans">
                        <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
                            <ExternalLink size={12} />
                        </a>
                    </Tooltip>
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
                    <Tab key="comment" title={<div className="flex gap-2 items-center"><MessageSquare size={16}/><span>{t('tabs.comment')}</span></div>} />
                    <Tab key="browse" title={<div className="flex gap-2 items-center"><MousePointerClick size={16}/><span>{t('tabs.browse')}</span></div>} />
                </Tabs>
            </div>

            <div className="flex-grow relative overflow-hidden bg-[#121212]">
                <AnimatePresence mode="wait">
                    {!selectedFeedbackId ? (
                        <motion.div 
                            key="list-view"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -30, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex flex-col p-4 overflow-hidden"
                        >
                            
                            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                                    <button onClick={() => setFilterStatus('all')} className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-colors ${filterStatus === 'all' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>{t('filter.all')}</button>
                                    <button onClick={() => setFilterStatus('open')} className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-colors ${filterStatus === 'open' ? 'bg-amber-500/20 text-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`}>{t('filter.open')}</button>
                                    <button onClick={() => setFilterStatus('resolved')} className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-colors ${filterStatus === 'resolved' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-500 hover:text-zinc-300'}`}>{t('filter.resolved')}</button>
                                    <button onClick={() => setFilterStatus('closed')} className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-colors ${filterStatus === 'closed' ? 'bg-green-500/20 text-green-400' : 'text-zinc-500 hover:text-zinc-300'}`}>{t('filter.closed')}</button>
                                </div>
                                
                                <div className="flex gap-2">
                                    <select 
                                        value={filterViewport} 
                                        onChange={(e) => setFilterViewport(e.target.value as ViewportSize | 'all')}
                                        className="bg-transparent border border-white/10 hover:border-white/30 transition-colors rounded-lg text-[10px] uppercase font-bold tracking-wider text-zinc-400 p-1.5 outline-none cursor-pointer"
                                    >
                                        <option value="all" className="bg-zinc-900">{t('viewport.all')}</option>
                                        <option value="desktop" className="bg-zinc-900">{t('viewport.desktop')}</option>
                                        <option value="lg" className="bg-zinc-900">{t('viewport.lg')}</option>
                                        <option value="md" className="bg-zinc-900">{t('viewport.md')}</option>
                                        <option value="sm" className="bg-zinc-900">{t('viewport.sm')}</option>
                                        <option value="mobile" className="bg-zinc-900">{t('viewport.mobile')}</option>
                                    </select>
                                    
                                    <select 
                                        value={sortBy} 
                                        onChange={(e) => setSortBy(e.target.value as SortType)}
                                        className="bg-transparent border border-white/10 hover:border-white/30 transition-colors rounded-lg text-[10px] uppercase font-bold tracking-wider text-zinc-400 p-1.5 outline-none cursor-pointer"
                                    >
                                        <option value="newest" className="bg-zinc-900">{t('sort.newest')}</option>
                                        <option value="oldest" className="bg-zinc-900">{t('sort.oldest')}</option>
                                        <option value="status" className="bg-zinc-900">{t('sort.status')}</option>
                                    </select>
                                </div>
                            </div>

                            <ScrollShadow className="flex-grow overflow-y-auto space-y-3 pb-4 pr-1">
                                {filteredAndSortedFeedbacks.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center opacity-40 mt-10">
                                        <Filter size={40} className="text-zinc-500 mb-4" />
                                        <p className="text-zinc-400 text-sm font-sans">{t('empty.noTasks')}</p>
                                    </div>
                                ) : (
                                    <div className={position === 'bottom' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" : "flex flex-col gap-3"}>
                                        {filteredAndSortedFeedbacks.map((f) => {
                                            const firstComment = f.activities.find(a => a.type === 'comment');
                                            const isOrphaned = dynamicPositions[f.id]?.orphaned;
                                            
                                            return (
                                            <div 
                                                key={f.id} 
                                                onClick={() => {
                                                    if (f.pageUrl !== targetUrl) {
                                                        setTargetUrl(f.pageUrl);
                                                        setUrlHistory(prev => {
                                                            const newHistory = prev.slice(0, historyIndex + 1);
                                                            newHistory.push(f.pageUrl);
                                                            return newHistory;
                                                        });
                                                        setHistoryIndex(prev => prev + 1);
                                                    }
                                                    
                                                    if (selectedFeedbackId && selectedFeedbackId !== f.id) {
                                                        setFeedbacks(prev => prev.filter(item => item.activities.length > 0 || item.id === f.id));
                                                        setNewCommentText("");
                                                        setPendingAction(null);
                                                    }
                                                    
                                                    setSelectedFeedbackId(f.id);
                                                    setViewport(f.viewport);
                                                    setPendingScrollId(f.id);
                                                }}
                                                onMouseEnter={() => handleTaskHover(f)}
                                                onMouseLeave={handleTaskLeave}
                                                className={`p-4 rounded-xl border transition-all cursor-pointer bg-[#18181b] group ${getStatusBorder(f.status)} border-opacity-50 
                                                  ${isOrphaned ? 'opacity-30 hover:opacity-100' : 'hover:border-opacity-100'}
                                                `}
                                            >
                                                <div className="flex justify-between items-stretch gap-2 mb-4 h-10">
                                                    
                                                    <div className="flex items-center gap-3 overflow-hidden flex-grow">
                                                        <div className="flex-shrink-0 opacity-100!">
                                                            {renderPin(f.pinNumber, f.status, isOrphaned, false)}
                                                        </div>
                                                        <div className={`flex flex-col justify-between h-full py-0.5 transition-opacity ${isOrphaned ? 'opacity-40' : ''}`}>
                                                            <span className="text-[13px] text-zinc-200 font-bold font-sans leading-none mt-0.5">
                                                                {firstComment ? firstComment.author : t('misc.newTask')}
                                                            </span>
                                                            <span className="text-[10px] text-zinc-500 font-sans leading-none mb-0.5">
                                                                {firstComment ? `${firstComment.date} • ${firstComment.timestamp}` : t('misc.justNow')}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className={`flex-shrink-0 h-full transition-opacity ${isOrphaned ? 'opacity-40' : ''}`}>
                                                        {getStatusPipeline(f)}
                                                    </div>
                                                </div>
                                                
                                                <p className={`text-sm font-sans font-normal leading-snug pl-1 mb-2 line-clamp-2 transition-opacity ${isOrphaned ? 'opacity-40' : ''} ${f.status === 'closed' ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>
                                                    {firstComment ? firstComment.content : <span className="italic text-zinc-500">{t('empty.draftDesc')}</span>}
                                                </p>

                                                {isOrphaned && (
                                                    <div className="mb-2 flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 opacity-100">
                                                        <Ghost size={14} className="flex-shrink-0 mt-0.5" />
                                                        <span className="text-[11px] leading-snug font-sans font-medium">
                                                            {t('warning.listOrphan')}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className={`transition-opacity ${isOrphaned ? 'opacity-40' : ''}`}>
                                                    <div className="flex items-center gap-1.5 text-zinc-500 pt-3 border-t border-white/5">
                                                        <Globe size={10} className="flex-shrink-0" />
                                                        <span className="text-[10px] font-sans truncate">{getDisplayPath(f.pageUrl)}</span>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2 pt-0">
                                                        <div className={`flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded border ${isOrphaned ? 'border-amber-500/30 text-amber-500' : 'border-white/5 text-zinc-400'} max-w-[50%] overflow-hidden`}>
                                                            {isOrphaned ? <Unlink size={10} className="flex-shrink-0" /> : <ScanLine size={10} className="flex-shrink-0 text-zinc-500" />}
                                                            <span className="text-[10px] font-condensed font-mono truncate">
                                                                {getDisplaySelector(f.fingerprint)}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex gap-1.5">
                                                            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-sans font-bold uppercase bg-white/5 px-2 py-1 rounded">
                                                                {getViewportIcon(f.viewport)}
                                                                <span>{getViewportLabel(f.viewport)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-sans font-bold bg-white/5 px-2 py-1 rounded">
                                                                <MessageSquare size={12} />
                                                                <span>{f.activities.filter(a => a.type === 'comment').length}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )})}
                                    </div>
                                )}
                            </ScrollShadow>
                        </motion.div>

                    ) : selectedFeedback ? (
                        
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
                                    onClick={() => {
                                        setFeedbacks(prev => prev.filter(f => f.activities.length > 0));
                                        setSelectedFeedbackId(null);
                                        setNewCommentText("");
                                        setPendingAction(null);
                                    }}
                                    className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase font-sans tracking-wide"
                                >
                                    <ChevronLeft size={14} /> {t('actions.back')}
                                </button>
                                
                                <div className="flex items-center gap-3">
                                    <Tooltip content={`${t('tooltips.issueReported')} ${getViewportLabel(selectedFeedback.viewport)}`} delay={0} className="bg-black text-white text-[10px] font-sans">
                                        <div className="flex items-center gap-1 text-zinc-500 px-2 py-1 bg-white/5 rounded">
                                            {getViewportIcon(selectedFeedback.viewport)}
                                            <span className="text-[9px] uppercase font-bold tracking-wider">{selectedFeedback.viewport}</span>
                                        </div>
                                    </Tooltip>

                                    <span className="text-zinc-500 font-mono text-xs">#{selectedFeedback.pinNumber}</span>
                                    
                                    <button 
                                        onClick={() => {
                                            setFeedbacks(prev => prev.filter(item => item.id !== selectedFeedbackId && item.activities.length > 0));
                                            setSelectedFeedbackId(null);
                                            setNewCommentText("");
                                            setPendingAction(null);
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
                                        <span className={`text-[9px] uppercase tracking-wider font-bold ${selectedFeedback.status === 'open' ? 'text-amber-500' : 'text-zinc-500'}`}>{t('status.open')}</span>
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#18181b] px-2">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedFeedback.status === 'resolved' ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : selectedFeedback.status === 'closed' ? 'bg-blue-600/20 text-blue-500' : 'bg-black/40 text-zinc-600 border border-white/5'}`}>
                                            {selectedFeedback.status === 'resolved' ? <Check size={12}/> : '2'}
                                        </div>
                                        <span className={`text-[9px] uppercase tracking-wider font-bold ${selectedFeedback.status === 'resolved' ? 'text-blue-400' : 'text-zinc-600'}`}>{t('status.resolved')}</span>
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#18181b] px-2">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedFeedback.status === 'closed' ? 'bg-green-600 text-white shadow-[0_0_10px_rgba(22,163,74,0.5)]' : 'bg-black/40 text-zinc-600 border border-white/5'}`}>
                                            {selectedFeedback.status === 'closed' ? <Check size={12}/> : '3'}
                                        </div>
                                        <span className={`text-[9px] uppercase tracking-wider font-bold ${selectedFeedback.status === 'closed' ? 'text-green-400' : 'text-zinc-600'}`}>{t('status.closed')}</span>
                                    </div>
                                </div>

                                {isSelectedOrphaned && (
                                    <div className="mb-4 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
                                        <Ghost size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                        <div className="flex flex-col">
                                            <span className="text-[11px] uppercase tracking-wider font-bold font-sans mb-1 text-amber-500">{t('warning.detailOrphanTitle')}</span>
                                            <span className="text-[11px] text-amber-500/80 font-sans leading-relaxed">
                                                {t('warning.detailOrphanDesc')}
                                            </span>
                                        </div>
                                    </div>
                                )}

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
                                                        <Wrench size={12} /> {t('actions.submitFix')}
                                                    </button>
                                                )}

                                                {selectedFeedback.status === 'resolved' && (
                                                    <>
                                                        <button 
                                                            onClick={() => addActivity(selectedFeedback.id, 'status_change', 'closed')}
                                                            className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 uppercase transition-colors"
                                                        >
                                                            <Check size={12} /> {t('actions.approveFix')}
                                                        </button>
                                                        <button 
                                                            onClick={handleReopenRequest}
                                                            className="bg-zinc-800 hover:bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 uppercase transition-colors"
                                                        >
                                                            <RotateCcw size={12} /> {t('actions.rejectReopen')}
                                                        </button>
                                                    </>
                                                )}

                                                {selectedFeedback.status === 'closed' && (
                                                    <button 
                                                        onClick={handleReopenRequest}
                                                        className="bg-zinc-800 hover:bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 uppercase transition-colors"
                                                    >
                                                        <RotateCcw size={12} /> {t('actions.reopenTask')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>


                            <ScrollShadow className="flex-grow p-4 space-y-4 overflow-y-auto">
                                {selectedFeedback.activities.length === 0 ? (
                                    <div className="text-center text-zinc-500 text-xs italic mt-4 font-sans">{t('empty.draftState')}</div>
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
                                                        {act.content === 'open' ? t('status.open') : act.content === 'resolved' ? t('status.resolved') : t('status.closed')}
                                                    </span>
                                                    <span className="text-zinc-500">
                                                        {t('misc.markedBy')} <span className="text-zinc-300">{act.author}</span> <span className="mx-1 text-zinc-700">•</span> {act.date} {act.timestamp}
                                                    </span>
                                                </div>
                                                <div className="h-px bg-white/10 flex-grow"></div>
                                            </div>
                                        )
                                    ))
                                )}
                            </ScrollShadow>

                            <div className="p-4 bg-[#18181b] border-t border-white/5 flex-shrink-0 relative">
                                
                                <AnimatePresence>
                                    {pendingAction === 'reopen' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute -top-10 left-4 right-4 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-t-xl flex justify-between items-center z-0"
                                        >
                                            <span className="flex items-center gap-1.5"><RotateCcw size={12}/> {t('actions.reasonReopen')}</span>
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
                                            pendingAction === 'reopen' ? t('placeholders.reasonReopen') : 
                                            selectedFeedback.activities.length === 0 ? t('placeholders.describe') : 
                                            t('placeholders.addComment')
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

            <div className="p-3 border-t border-white/5 bg-[#121212] flex items-center justify-center gap-1.5 flex-shrink-0 z-20">
                <button 
                    onClick={() => setViewport('mobile')} 
                    className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${viewport === 'mobile' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                >
                    <Smartphone size={16} />
                </button>
                <button 
                    onClick={() => setViewport('sm')} 
                    className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${viewport === 'sm' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                >
                    <Smartphone size={16} className="rotate-90" />
                </button>
                <button 
                    onClick={() => setViewport('md')} 
                    className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${viewport === 'md' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                >
                    <Tablet size={16} />
                </button>
                <button 
                    onClick={() => setViewport('lg')} 
                    className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${viewport === 'lg' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                >
                    <Laptop size={16} />
                </button>
                <button 
                    onClick={() => setViewport('desktop')} 
                    className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${viewport === 'desktop' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                >
                    <Monitor size={16} />
                </button>
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