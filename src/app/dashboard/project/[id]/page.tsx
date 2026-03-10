"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Button, 
  Card, 
  CardBody, 
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/react";
import { 
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
import { useLanguage } from "@/i18n/LanguageContext"; // Pridané

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage(); // Vytiahnutie prekladov

  const [copied, setCopied] = useState(false);
  const [activeListTab, setActiveListTab] = useState('open');

  const { isOpen: isEndProjectOpen, onOpen: onEndProjectOpen, onOpenChange: onEndProjectChange } = useDisclosure();

  // Fake dáta
  const project = {
    id: params.id, name: "Denník N Redizajn", url: "dennikn.sk", clientEmail: "klient@dennikn.sk", hash: "xV9y2m4k8p1l5n0q3r7z9w2a", 
    totalTasks: 57, openTasks: 5, resolvedTasks: 7, closedTasks: 45,   
  };

  const feedbacks = [
    { id: 1, comment: "Toto logo je rozmazané, máte verziu v SVG?", elementText: "Logo Denník N", selector: "header > nav > img.logo", status: "open", time: "Dnes 14:30", author: "Klient" },
    { id: 2, comment: "Zmeňte farbu tohto tlačidla na modrú.", elementText: "Predplatiť za 6€", selector: "button.cta-subscribe", status: "open", time: "Dnes 10:15", author: "Klient" },
    { id: 3, comment: "Zväčšil som padding na 24px.", elementText: "Hlavná sekcia článkov", selector: "section.hero > div.content", status: "resolved", time: "Včera 16:45", author: "Michal (Agentúra)" },
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
    <>
        {/* Tlačidlo Späť (už nie je v pevnom Navbare, ale priamo nad obsahom) */}
        <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors tracking-tight group mb-6"
        >
            <ArrowLeft size={16} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
            {t('dashboard.projectDetail.backToProjects')}
        </button>

        <div className="max-w-5xl mx-auto pb-12">
            
            {/* --- HEADER PROJEKTU --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 bg-[rgb(24,24,27)] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center">
                            <Globe size={20} className="text-blue-400" strokeWidth={1.5} />
                        </div>
                        <div className="flex items-center gap-3">
                            <Chip size="sm" variant="flat" className="bg-green-500/10 text-green-400 text-[10px] font-bold tracking-tight uppercase">{t('dashboard.projectDetail.activeProject')}</Chip>
                            <button onClick={onEndProjectOpen} className="text-[10px] font-bold tracking-tight uppercase text-zinc-500 hover:text-red-400 transition-colors">
                                {t('dashboard.projectDetail.endProject')}
                            </button>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-1">{project.name}</h1>
                    <p className="text-sm font-mono text-zinc-500 hover:text-blue-400 transition-colors cursor-pointer">{project.url}</p>
                </div>

                <div className="flex flex-col gap-3 min-w-[280px]">
                    <Button 
                        onPress={copyClientLink} size="lg"
                        className={`w-full flex items-center justify-center gap-2 font-bold tracking-tight rounded-xl shadow-lg transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'}`}
                    >
                        {copied ? <Check size={18} strokeWidth={2.5} /> : <Copy size={18} strokeWidth={2.5} />}
                        <span>{copied ? t('dashboard.projectDetail.linkCopied') : t('dashboard.projectDetail.copyLink')}</span>
                    </Button>
                    <Button 
                        variant="flat" onPress={() => router.push(`/inspect?project=${project.hash}`)}
                        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold tracking-tight rounded-xl border border-white/5"
                    >
                        <ExternalLink size={16} strokeWidth={2} className="text-zinc-400" />
                        <span>{t('dashboard.projectDetail.openInspector')}</span>
                    </Button>
                </div>
            </div>

            {/* --- STATS S 3 STAVMI (FILTRE) --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card isPressable onPress={() => setActiveListTab('all')} radius="none" className={`rounded-2xl transition-all ${activeListTab === 'all' ? 'bg-[rgb(24,24,27)] border-2 border-zinc-500' : 'bg-black border border-white/5 hover:border-white/20'}`}>
                    <CardBody className="p-4 flex flex-row items-center gap-4 w-full">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400"><MessageSquare size={20} strokeWidth={1.5} /></div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mb-0.5">{t('dashboard.projectDetail.filters.allTasks')}</p>
                            <p className="text-xl font-bold text-white tracking-tight">{project.totalTasks}</p>
                        </div>
                    </CardBody>
                </Card>

                <Card isPressable onPress={() => setActiveListTab('open')} radius="none" className={`rounded-2xl transition-all ${activeListTab === 'open' ? 'bg-[rgb(24,24,27)] border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-black border border-amber-500/20 hover:border-amber-500/40'}`}>
                    <CardBody className="p-4 flex flex-row items-center gap-4 w-full">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400"><Clock size={20} strokeWidth={1.5} /></div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-tight mb-0.5">{t('dashboard.projectDetail.filters.open')}</p>
                            <p className="text-xl font-bold text-white tracking-tight">{project.openTasks}</p>
                        </div>
                    </CardBody>
                </Card>

                <Card isPressable onPress={() => setActiveListTab('resolved')} radius="none" className={`rounded-2xl transition-all ${activeListTab === 'resolved' ? 'bg-[rgb(24,24,27)] border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-black border border-blue-500/20 hover:border-blue-500/40'}`}>
                    <CardBody className="p-4 flex flex-row items-center gap-4 w-full">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><Eye size={20} strokeWidth={1.5} /></div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-blue-400/70 uppercase tracking-tight mb-0.5">{t('dashboard.projectDetail.filters.toApprove')}</p>
                            <p className="text-xl font-bold text-white tracking-tight">{project.resolvedTasks}</p>
                        </div>
                    </CardBody>
                </Card>

                <Card isPressable onPress={() => setActiveListTab('closed')} radius="none" className={`rounded-2xl transition-all ${activeListTab === 'closed' ? 'bg-[rgb(24,24,27)] border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-black border border-green-500/20 hover:border-green-500/40'}`}>
                    <CardBody className="p-4 flex flex-row items-center gap-4 w-full">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400"><CheckCircle2 size={20} strokeWidth={1.5} /></div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-green-500/70 uppercase tracking-tight mb-0.5">{t('dashboard.projectDetail.filters.closed')}</p>
                            <p className="text-xl font-bold text-white tracking-tight">{project.closedTasks}</p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* --- FEEDBACK LIST HEADER --- */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white tracking-tight">{t('dashboard.projectDetail.feedbackList')}</h2>
            </div>

            <Card radius="none" className="bg-[rgb(24,24,27)] border border-white/5 rounded-2xl overflow-hidden mb-12">
                <div className="flex flex-col divide-y divide-white/5">
                    {filteredFeedbacks.map((f) => (
                        <div key={f.id} className="p-5 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4 group">
                            <div className="flex items-start gap-4 flex-grow">
                                <div className="mt-1 flex-shrink-0">
                                    {f.status === 'open' && (
                                        <div className="w-5 h-5 rounded-full border-2 border-amber-500 bg-amber-500/20 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-amber-500"></div></div>
                                    )}
                                    {f.status === 'resolved' && (
                                        <div className="w-5 h-5 rounded-full border-2 border-blue-500 bg-blue-500/20 flex items-center justify-center text-blue-500"><Check size={12} strokeWidth={3} /></div>
                                    )}
                                    {f.status === 'closed' && (
                                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-black"><Check size={12} strokeWidth={3} /></div>
                                    )}
                                </div>
                                
                                <div className="flex-grow">
                                    <p className={`text-base font-condensed font-normal mb-3 leading-tight ${f.status === 'closed' ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                        "{f.comment}"
                                    </p>
                                    
                                    <div className="bg-black/40 rounded-lg p-2 border border-white/5 mb-2 inline-block max-w-2xl">
                                        <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                                            <Globe size={10} /> {t('dashboard.projectDetail.markedElement')}
                                        </div>
                                        <p className="text-sm text-zinc-400 font-mono truncate">{f.elementText}</p>
                                    </div>

                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-mono text-zinc-600 truncate max-w-[200px]" title={f.selector}>{f.selector}</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                        <span className="text-xs text-zinc-500 font-bold tracking-tight flex items-center gap-1"><Clock size={12} /> {f.time}</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                        <span className="text-[10px] text-zinc-400 font-bold tracking-tight">{f.author}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-start mt-1">
                                {f.status === 'open' && (
                                    <Button size="sm" className="bg-blue-500/10 text-blue-400 font-bold tracking-tight rounded-lg hover:bg-blue-500/20">
                                        {t('dashboard.projectDetail.actions.markResolved')}
                                    </Button>
                                )}
                                {f.status === 'resolved' && (
                                    <Button size="sm" className="bg-green-500/10 text-green-500 font-bold tracking-tight rounded-lg hover:bg-green-500/20">
                                        {t('dashboard.projectDetail.actions.approve')}
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

      <Modal 
        isOpen={isEndProjectOpen} onOpenChange={onEndProjectChange} placement="center" backdrop="blur"
        classNames={{ base: "bg-[rgb(24,24,27)] border border-red-500/20 rounded-3xl", header: "border-b border-white/5", footer: "border-t border-white/5", closeButton: "hover:bg-white/10 active:bg-white/20 transition-colors" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500"><AlertTriangle size={20} strokeWidth={2} /></div>
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-xl font-bold text-white tracking-tight">{t('dashboard.projectDetail.endModal.title')}</h2>
                    <p className="text-xs text-zinc-500 font-normal tracking-tight">{t('dashboard.projectDetail.endModal.subtitle')}</p>
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                <p className="text-sm text-zinc-300 tracking-tight leading-relaxed">
                    {t('dashboard.projectDetail.endModal.descText')} <strong className="text-white">"{project.name}"</strong>? 
                    {t('dashboard.projectDetail.endModal.descWarning')}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} className="text-zinc-400 font-bold tracking-tight rounded-xl hover:text-white">
                  {t('dashboard.projectDetail.endModal.cancel')}
                </Button>
                <Button color="danger" onPress={onClose} className="bg-red-600 font-bold tracking-tight rounded-xl shadow-lg shadow-red-900/20">
                  {t('dashboard.projectDetail.endModal.confirm')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </>
  );
}