"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Avatar, 
  Button, 
  Card, 
  CardBody, 
  Progress,
  Chip,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/react";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  Plus,
  Bell, 
  MoreVertical,
  Globe,
  MessageSquare,
  CheckCircle2,
  ArrowLeft,
  Copy,
  ExternalLink,
  Check,
  Clock,
  Trash2,
  AlertTriangle,
  Eye
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [activeListTab, setActiveListTab] = useState('open');

  // Modal pre ukončenie projektu
  const { 
    isOpen: isEndProjectOpen, 
    onOpen: onEndProjectOpen, 
    onOpenChange: onEndProjectChange 
  } = useDisclosure();

  // Fake dáta (upravené pre 3 stavy)
const project = {
    id: params.id,
    name: "Denník N Redizajn",
    url: "dennikn.sk",
    clientEmail: "klient@dennikn.sk",
    hash: "xV9y2m4k8p1l5n0q3r7z9w2a", 
    totalTasks: 57,
    openTasks: 5,      
    resolvedTasks: 7,  
    closedTasks: 45,   
  };

  // Fake dáta úloh pre všetky 3 stavy
  // Fake dáta úloh - ROZDELENÉ na Komentár a Označený prvok
  // Fake dáta úloh - ROZDELENÉ na Komentár a Označený prvok
  const feedbacks = [
    { 
      id: 1, 
      comment: "Toto logo je rozmazané, máte verziu v SVG?", // Čo napísal klient
      elementText: "Logo Denník N", // Čo je napísané na webe (alt tag alebo text)
      selector: "header > nav > img.logo", 
      status: "open", 
      time: "Dnes 14:30", 
      author: "Klient" 
    },
    { 
      id: 2, 
      comment: "Zmeňte farbu tohto tlačidla na modrú.", 
      elementText: "Predplatiť za 6€", 
      selector: "button.cta-subscribe", 
      status: "open", 
      time: "Dnes 10:15", 
      author: "Klient" 
    },
    { 
      id: 3, 
      comment: "Zväčšil som padding na 24px.", 
      elementText: "Hlavná sekcia článkov", 
      selector: "section.hero > div.content", 
      status: "resolved", 
      time: "Včera 16:45", 
      author: "Michal (Agentúra)" 
    },
    { 
      id: 4, 
      comment: "Tento text sa na mobile zle číta, dajte väčší line-height.", 
      elementText: "Najnovšie správy z domova", 
      selector: "h2.article-title", 
      status: "resolved", 
      time: "Včera 11:20", 
      author: "Michal (Agentúra)" 
    },
    { 
      id: 5, 
      comment: "Super, pätička vyzerá dobre. Schválené.", 
      elementText: "Copyright 2024", 
      selector: "footer > div.copy", 
      status: "closed", 
      time: "Pred 2 dňami", 
      author: "Klient" 
    },
  ];

  const copyClientLink = () => {
    const link = `https://xvisual.app/inspect?project=${project.hash}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    if (activeListTab === 'all') return true;
    return f.status === activeListTab;
  });

  return (
    <div className="flex h-screen w-screen bg-black text-zinc-300 font-sans overflow-hidden">
      
      {/* --- SIDEBAR 1:1 s Dashboardom --- */}
      <div className="w-72 bg-[rgb(24,24,27)] border-r border-white/5 flex flex-col h-full flex-shrink-0">
        <div className="p-5 border-b border-white/5 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
          <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" size="md" className="ring-2 ring-zinc-800" />
          <div className="flex flex-col flex-grow overflow-hidden">
            <span className="text-sm font-bold text-white truncate tracking-tight">Michal Dizajnér</span>
            <span className="text-xs text-zinc-500 truncate tracking-tight">michal@agentura.sk</span>
          </div>
          <MoreVertical size={16} className="text-zinc-500" />
        </div>

        <div className="p-5">
          <Button 
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20 rounded-xl tracking-tight flex items-center justify-center gap-2"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Nový projekt</span>
          </Button>
        </div>

        <div className="flex-grow px-3 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-tight text-zinc-500 mb-2 mt-1">Menu</p>
          
          <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-colors text-zinc-400 hover:bg-white/5 hover:text-zinc-200">
            <LayoutDashboard size={18} strokeWidth={2} /> Prehľad
          </button>
          
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-colors bg-white/10 text-white">
            <FolderKanban size={18} strokeWidth={2} /> Projekty
            <span className="ml-auto bg-blue-600/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold">3</span>
          </button>

          <p className="px-3 text-[10px] font-bold uppercase tracking-tight text-zinc-500 mb-2 !mt-[20px]">Tím a Nastavenia</p>

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-colors group text-zinc-400 hover:bg-white/5 hover:text-zinc-200">
            <Users size={18} strokeWidth={2} /> Správa tímu
            <Chip size="sm" variant="flat" className="ml-auto bg-amber-500/10 text-amber-500 text-[9px] font-bold h-5 border border-amber-500/20 group-hover:bg-amber-500/20">PRO</Chip>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-colors text-zinc-400 hover:bg-white/5 hover:text-zinc-200">
            <Settings size={18} strokeWidth={2} /> Nastavenia
          </button>
        </div>

        <div className="p-5 mt-auto border-t border-white/5 bg-black/20">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-zinc-400 tracking-tight">Projekty (Free Plán)</span>
                <span className="text-xs font-bold text-white tracking-tight">3 / 5</span>
            </div>
            <Progress size="sm" value={60} classNames={{ indicator: "bg-blue-500 rounded-full", track: "bg-zinc-800 rounded-full" }} />
            <p className="text-[10px] text-zinc-500 mt-3 text-center cursor-pointer hover:text-white transition-colors tracking-tight">
                Upgrade na PRO pre neobmedzené projekty
            </p>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-grow flex flex-col h-full overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[rgb(24,24,27)]/50 backdrop-blur-md sticky top-0 z-10">
            <button 
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors tracking-tight group"
            >
                <ArrowLeft size={16} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
                Späť na projekty
            </button>
            <div className="flex items-center gap-4">
                <button className="text-zinc-400 hover:text-white transition-colors relative">
                    <Bell size={20} strokeWidth={2} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-[rgb(24,24,27)]"></span>
                </button>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                
                {/* --- HEADER PROJEKTU --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 bg-[rgb(24,24,27)] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                    
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center">
                                <Globe size={20} className="text-blue-400" strokeWidth={1.5} />
                            </div>
                            <div className="flex items-center gap-3">
                                <Chip size="sm" variant="flat" className="bg-green-500/10 text-green-400 text-[10px] font-bold tracking-tight uppercase">Aktívny projekt</Chip>
                                {/* TLAČIDLO UKONČIŤ PROJEKT */}
                                <button onClick={onEndProjectOpen} className="text-[10px] font-bold tracking-tight uppercase text-zinc-500 hover:text-red-400 transition-colors">
                                    Ukončiť projekt
                                </button>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">{project.name}</h1>
                        <p className="text-sm font-mono text-zinc-500 hover:text-blue-400 transition-colors cursor-pointer">{project.url}</p>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[280px]">
                        {/* OPRAVENÉ: Tlačidlá s vlastným flexboxom bez startContent */}
                        <Button 
                            onPress={copyClientLink}
                            size="lg"
                            className={`w-full flex items-center justify-center gap-2 font-bold tracking-tight rounded-xl shadow-lg transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'}`}
                        >
                            {copied ? <Check size={18} strokeWidth={2.5} /> : <Copy size={18} strokeWidth={2.5} />}
                            <span>{copied ? "Odkaz skopírovaný!" : "Kopírovať odkaz pre klienta"}</span>
                        </Button>
                        
                        <Button 
                            variant="flat"
                            onPress={() => router.push(`/inspect?project=${project.hash}`)}
                            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold tracking-tight rounded-xl border border-white/5"
                        >
                            <ExternalLink size={16} strokeWidth={2} className="text-zinc-400" />
                            <span>Otvoriť Inspector</span>
                        </Button>
                    </div>
                </div>

                {/* --- STATS S 3 STAVMI (FUNGUJÚ AKO FILTRE) --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {/* Filter: Všetky */}
                    <Card 
                        isPressable 
                        onPress={() => setActiveListTab('all')}
                        radius="none" 
                        className={`rounded-2xl transition-all ${activeListTab === 'all' ? 'bg-[rgb(24,24,27)] border-2 border-zinc-500' : 'bg-black border border-white/5 hover:border-white/20'}`}
                    >
                        <CardBody className="p-4 flex flex-row items-center gap-4 w-full">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400">
                                <MessageSquare size={20} strokeWidth={1.5} />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mb-0.5">Všetky úlohy</p>
                                <p className="text-xl font-bold text-white tracking-tight">{project.totalTasks}</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Filter: Otvorené */}
                    <Card 
                        isPressable 
                        onPress={() => setActiveListTab('open')}
                        radius="none" 
                        className={`rounded-2xl transition-all ${activeListTab === 'open' ? 'bg-[rgb(24,24,27)] border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-black border border-amber-500/20 hover:border-amber-500/40'}`}
                    >
                        <CardBody className="p-4 flex flex-row items-center gap-4 w-full">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                                <Clock size={20} strokeWidth={1.5} />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-tight mb-0.5">Otvorené</p>
                                <p className="text-xl font-bold text-white tracking-tight">{project.openTasks}</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Filter: Na schválenie */}
                    <Card 
                        isPressable 
                        onPress={() => setActiveListTab('resolved')}
                        radius="none" 
                        className={`rounded-2xl transition-all ${activeListTab === 'resolved' ? 'bg-[rgb(24,24,27)] border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-black border border-blue-500/20 hover:border-blue-500/40'}`}
                    >
                        <CardBody className="p-4 flex flex-row items-center gap-4 w-full">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Eye size={20} strokeWidth={1.5} />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-blue-400/70 uppercase tracking-tight mb-0.5">Na schválenie</p>
                                <p className="text-xl font-bold text-white tracking-tight">{project.resolvedTasks}</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Filter: Zatvorené */}
                    <Card 
                        isPressable 
                        onPress={() => setActiveListTab('closed')}
                        radius="none" 
                        className={`rounded-2xl transition-all ${activeListTab === 'closed' ? 'bg-[rgb(24,24,27)] border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-black border border-green-500/20 hover:border-green-500/40'}`}
                    >
                        <CardBody className="p-4 flex flex-row items-center gap-4 w-full">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                                <CheckCircle2 size={20} strokeWidth={1.5} />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-green-500/70 uppercase tracking-tight mb-0.5">Zatvorené</p>
                                <p className="text-xl font-bold text-white tracking-tight">{project.closedTasks}</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* --- FEEDBACK LIST HEADER --- */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white tracking-tight">Zoznam pripomienok</h2>
                    {/* Taby sme odtiaľto úplne vymazali! */}
                </div>

                <Card radius="none" className="bg-[rgb(24,24,27)] border border-white/5 rounded-2xl overflow-hidden mb-12">
                    <div className="flex flex-col divide-y divide-white/5">
                        {filteredFeedbacks.map((f) => (
                            <div key={f.id} className="p-5 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4 group">
                                <div className="flex items-start gap-4 flex-grow">
                                    {/* IKONKA STAVU */}
                                    <div className="mt-1 flex-shrink-0">
                                        {f.status === 'open' && (
                                            <div className="w-5 h-5 rounded-full border-2 border-amber-500 bg-amber-500/20 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                            </div>
                                        )}
                                        {f.status === 'resolved' && (
                                            <div className="w-5 h-5 rounded-full border-2 border-blue-500 bg-blue-500/20 flex items-center justify-center text-blue-500">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        )}
                                        {f.status === 'closed' && (
                                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-black">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-grow">
                                        {/* 1. HLAVNÝ KOMENTÁR (Od klienta) - Condensed a biely */}
                                        <p className={`text-base font-condensed font-normal mb-3 leading-tight ${f.status === 'closed' ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                            "{f.comment}"
                                        </p>
                                        
                                        {/* 2. KONTEXT (Čo je označené) - Vizuálne oddelené */}
                                        <div className="bg-black/40 rounded-lg p-2 border border-white/5 mb-2 inline-block max-w-2xl">
                                            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                                                <Globe size={10} />
                                                Označený prvok:
                                            </div>
                                            <p className="text-sm text-zinc-400 font-mono truncate">
                                                {f.elementText}
                                            </p>
                                        </div>

                                        {/* 3. METADÁTA (Selector, Čas, Autor) */}
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-mono text-zinc-600 truncate max-w-[200px]" title={f.selector}>
                                                {f.selector}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                            <span className="text-xs text-zinc-500 font-bold tracking-tight flex items-center gap-1">
                                                <Clock size={12} /> {f.time}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                            <span className="text-[10px] text-zinc-400 font-bold tracking-tight">
                                                {f.author}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* AKCIE (Tlačidlá) */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-start mt-1">
                                    {f.status === 'open' && (
                                        <Button size="sm" className="bg-blue-500/10 text-blue-400 font-bold tracking-tight rounded-lg hover:bg-blue-500/20">
                                            Označiť ako vyriešené
                                        </Button>
                                    )}
                                    {f.status === 'resolved' && (
                                        <Button size="sm" className="bg-green-500/10 text-green-500 font-bold tracking-tight rounded-lg hover:bg-green-500/20">
                                            Schváliť
                                        </Button>
                                    )}
                                    <Button isIconOnly size="sm" variant="light" className="text-zinc-500 hover:text-red-400 rounded-lg">
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </main>
      </div>

      {/* --- MODAL: Ukončiť projekt --- */}
      <Modal 
        isOpen={isEndProjectOpen} 
        onOpenChange={onEndProjectChange}
        placement="center"
        backdrop="blur"
        classNames={{
          base: "bg-[rgb(24,24,27)] border border-red-500/20 rounded-3xl", 
          header: "border-b border-white/5",
          footer: "border-t border-white/5",
          closeButton: "hover:bg-white/10 active:bg-white/20 transition-colors"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                    <AlertTriangle size={20} strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-xl font-bold text-white tracking-tight">Ukončiť projekt?</h2>
                    <p className="text-xs text-zinc-500 font-normal tracking-tight">Táto akcia archivuje klientsky odkaz.</p>
                </div>
              </ModalHeader>
              
              <ModalBody className="py-6">
                <p className="text-sm text-zinc-300 tracking-tight leading-relaxed">
                    Naozaj chcete ukončiť projekt <strong className="text-white">"{project.name}"</strong>? 
                    Klient už nebude môcť pridávať nové pripomienky a klientsky odkaz bude deaktivovaný. 
                    Tento krok je možné neskôr vrátiť späť.
                </p>
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose} className="text-zinc-400 font-bold tracking-tight rounded-xl hover:text-white">
                  Zrušiť
                </Button>
                <Button color="danger" onPress={onClose} className="bg-red-600 font-bold tracking-tight rounded-xl shadow-lg shadow-red-900/20">
                  Áno, ukončiť projekt
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
}