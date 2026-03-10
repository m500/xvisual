"use client";

import { useRouter } from "next/navigation";
import { 
  Card, 
  CardBody, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure,
  Input,
  Button
} from "@heroui/react";
import { 
  FolderKanban, 
  Plus, 
  MoreVertical,
  Globe,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function DashboardPage() {
  const router = useRouter();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { t } = useLanguage(); 

  // Fake dáta
  const projects = [
    { id: 1, name: "Denník N Redizajn", url: "dennikn.sk", openTasks: 12, resolvedTasks: 45, date: "Dnes" },
    { id: 2, name: "Alza E-shop", url: "alza.sk", openTasks: 3, resolvedTasks: 128, date: "Včera" },
    { id: 3, name: "Osobný Blog", url: "blog.tomas.sk", openTasks: 0, resolvedTasks: 12, date: "Pred 3 dňami" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">{t('dashboard.header.title')}</h1>
        <p className="text-sm text-zinc-500 mb-8 tracking-tight">{t('dashboard.header.subtitle')}</p>

        {/* Rýchle štatistiky */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card radius="none" className="bg-[rgb(24,24,27)] border border-white/5 rounded-2xl">
                <CardBody className="p-5 flex flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <FolderKanban size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight mb-1">{t('dashboard.projectList.activeProjects')}</p>
                        <p className="text-2xl font-bold text-white tracking-tight">3</p>
                    </div>
                </CardBody>
            </Card>
            <Card radius="none" className="bg-[rgb(24,24,27)] border border-white/5 rounded-2xl">
                <CardBody className="p-5 flex flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <MessageSquare size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight mb-1">{t('dashboard.projectList.openTasks')}</p>
                        <p className="text-2xl font-bold text-white tracking-tight">15</p>
                    </div>
                </CardBody>
            </Card>
            <Card radius="none" className="bg-[rgb(24,24,27)] border border-white/5 rounded-2xl">
                <CardBody className="p-5 flex flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
                        <CheckCircle2 size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight mb-1">{t('dashboard.projectList.resolvedTasks')}</p>
                        <p className="text-2xl font-bold text-white tracking-tight">185</p>
                    </div>
                </CardBody>
            </Card>
        </div>

        <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-tight">{t('dashboard.projectList.recentProjects')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Pridať nový projekt */}
            <button 
                onClick={() => router.push('/dashboard/new')}
                className="flex flex-col items-center justify-center gap-3 h-48 rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
            >
                <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 transition-colors">
                    <Plus size={24} strokeWidth={2} />
                </div>
                <span className="text-sm font-bold text-zinc-400 group-hover:text-blue-400 transition-colors tracking-tight">{t('dashboard.projectList.createNew')}</span>
            </button>

            {/* Zoznam projektov */}
            {projects.map((project) => (
                <Card key={project.id} isPressable onPress={() => router.push(`/dashboard/project/${project.id}`)} radius="none" className="bg-[rgb(24,24,27)] border border-white/5 hover:border-white/20 transition-all cursor-pointer group rounded-2xl overflow-hidden">
                    <CardBody className="p-0">
                        <div className="p-5 border-b border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-xl bg-black border border-white/5 flex items-center justify-center">
                                    <Globe size={18} className="text-zinc-400" strokeWidth={1.5} />
                                </div>
                                <div className="text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={16} />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-400 group-hover:text-white transition-colors mb-1 tracking-tight">{project.name}</h3>
                            <p className="text-xs font-mono group-hover:text-blue-400 text-zinc-500 transition-colors">{project.url}</p>
                        </div>
                        <div className="p-4 bg-black/20 flex items-center justify-between">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                    <span className="text-xs font-bold text-zinc-300 tracking-tight">{project.openTasks}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-xs font-bold text-zinc-300 tracking-tight">{project.resolvedTasks}</span>
                                </div>
                            </div>
                            <span className="text-[10px] text-zinc-600 tracking-tight">{project.date}</span>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>

        {/* --- VRÁTENÝ MODAL SO SPRÁVNOU ŠTRUKTÚROU --- */}
        <Modal 
          isOpen={isOpen} 
          onOpenChange={onOpenChange}
          placement="center"
          backdrop="blur"
          classNames={{
            base: "bg-[rgb(24,24,27)] border border-white/10 rounded-3xl", 
            header: "border-b border-white/5",
            footer: "border-t border-white/5",
            closeButton: "hover:bg-white/10 active:bg-white/20 transition-colors"
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">Vytvoriť nový projekt</h2>
                  <p className="text-xs text-zinc-500 font-normal tracking-tight">Vygenerujte unikátny prístup pre vášho klienta.</p>
                </ModalHeader>
                
                <ModalBody className="py-6 gap-4">
                  <Input
                    autoFocus
                    label="Názov projektu"
                    placeholder="napr. Redizajn Denník N"
                    labelPlacement="outside"
                    classNames={{
                      label: "text-zinc-400 text-xs font-bold tracking-tight",
                      input: "text-white text-sm tracking-tight",
                      inputWrapper: "bg-black border border-white/10 hover:border-white/20 focus-within:!border-blue-500 rounded-xl transition-colors"
                    }}
                  />
                  <Input
                    label="URL adresa webu"
                    placeholder="napr. dennikn.sk"
                    labelPlacement="outside"
                    startContent={<Globe size={16} className="text-zinc-500 mr-2" />}
                    classNames={{
                      label: "text-zinc-400 text-xs font-bold tracking-tight",
                      input: "text-white text-sm tracking-tight font-mono",
                      inputWrapper: "bg-black border border-white/10 hover:border-white/20 focus-within:!border-blue-500 rounded-xl transition-colors"
                    }}
                  />
                  <Input
                    label="E-mail klienta"
                    placeholder="klient@firma.sk"
                    labelPlacement="outside"
                    description="Na tento e-mail odošleme pozvánku s unikátnym odkazom."
                    classNames={{
                      label: "text-zinc-400 text-xs font-bold tracking-tight",
                      input: "text-white text-sm tracking-tight",
                      description: "text-[10px] text-zinc-600 tracking-tight",
                      inputWrapper: "bg-black border border-white/10 hover:border-white/20 focus-within:!border-blue-500 rounded-xl transition-colors"
                    }}
                  />
                </ModalBody>

                <ModalFooter>
                  <Button variant="light" onPress={onClose} className="text-zinc-400 font-bold tracking-tight rounded-xl hover:text-white">
                    Zrušiť
                  </Button>
                  <Button color="primary" onPress={onClose} className="bg-blue-600 font-bold tracking-tight rounded-xl shadow-lg shadow-blue-900/20">
                    Vytvoriť a Odoslať
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
    </div>
  );
}