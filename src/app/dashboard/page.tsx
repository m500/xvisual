"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";
import { 
  Avatar, 
  Button, 
  Card, 
  CardBody, 
  Progress,
  Chip,
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure,
  Input
} from "@heroui/react";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  MoreVertical,
  Globe,
  MessageSquare,
  CheckCircle2
} from "lucide-react";

export default function DashboardPage() {
  // POZOR: Tieto hooky musia byť vždy vnútri funkcie DashboardPage!
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('projects');
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  // Fake dáta pre ukážku
  const projects = [
    { id: 1, name: "Denník N Redizajn", url: "dennikn.sk", openTasks: 12, resolvedTasks: 45, date: "Dnes" },
    { id: 2, name: "Alza E-shop", url: "alza.sk", openTasks: 3, resolvedTasks: 128, date: "Včera" },
    { id: 3, name: "Osobný Blog", url: "blog.tomas.sk", openTasks: 0, resolvedTasks: 12, date: "Pred 3 dňami" },
  ];

  return (
    <div className="flex h-screen w-screen bg-black text-zinc-300 font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <div className="w-72 bg-[rgb(24,24,27)] border-r border-white/5 flex flex-col h-full flex-shrink-0">
        
        {/* User Profile Area */}
        <div className="p-5 border-b border-white/5 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
          <Avatar 
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
            size="md" 
            className="ring-2 ring-zinc-800"
          />
          <div className="flex flex-col flex-grow overflow-hidden">
            <span className="text-sm font-bold text-white truncate tracking-tight">Michal Dizajnér</span>
            <span className="text-xs text-zinc-500 truncate tracking-tight">michal@agentura.sk</span>
          </div>
          <MoreVertical size={16} className="text-zinc-500" />
        </div>

        {/* Create Project Button */}
        <div className="p-5">
          <Button 
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20 rounded-xl tracking-tight flex items-center justify-center gap-2"
            onPress={onOpen}
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Nový projekt</span>
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex-grow px-3 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-tight text-zinc-500 mb-2 mt-1">Menu</p>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-colors ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
          >
            <LayoutDashboard size={18} strokeWidth={2} />
            Prehľad
          </button>
          
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-colors ${activeTab === 'projects' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
          >
            <FolderKanban size={18} strokeWidth={2} />
            Projekty
            <span className="ml-auto bg-blue-600/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold">3</span>
          </button>

          <p className="px-3 text-[10px] font-bold uppercase tracking-tight text-zinc-500 mb-2 !mt-[70px]">Tím a Nastavenia</p>

          <button 
            onClick={() => setActiveTab('team')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-colors group ${activeTab === 'team' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
          >
            <Users size={18} strokeWidth={2} />
            Správa tímu
            <Chip size="sm" variant="flat" className="ml-auto bg-amber-500/10 text-amber-500 text-[9px] font-bold h-5 border border-amber-500/20 group-hover:bg-amber-500/20">PRO</Chip>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-colors ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
          >
            <Settings size={18} strokeWidth={2} />
            Nastavenia
          </button>
        </div>

        {/* Quota */}
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
            <div className="flex items-center gap-2 w-96 bg-black/50 border border-white/5 rounded-2xl px-3 py-2 focus-within:border-blue-500/50 transition-colors">
                <Search size={16} className="text-zinc-500" />
                <input 
                    type="text" 
                    placeholder="Hľadať projekt alebo klienta..." 
                    className="bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-600 w-full font-sans tracking-tight"
                />
            </div>
            <div className="flex items-center gap-4">
                <button className="text-zinc-400 hover:text-white transition-colors relative">
                    <Bell size={20} strokeWidth={2} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-[rgb(24,24,27)]"></span>
                </button>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                
                <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Projekty</h1>
                <p className="text-sm text-zinc-500 mb-8 tracking-tight">Spravujte svoje weby a klientsky feedback na jednom mieste.</p>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card radius="none" className="bg-[rgb(24,24,27)] border border-white/5 rounded-2xl">
                        <CardBody className="p-5 flex flex-row items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <FolderKanban size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight mb-1">Aktívne projekty</p>
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
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight mb-1">Otvorené úlohy</p>
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
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight mb-1">Vyriešené úlohy</p>
                                <p className="text-2xl font-bold text-white tracking-tight">185</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-tight">Nedávne projekty</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    
                    {/* Add New Project Card */}
                    <button 
                        onClick={onOpen}
                        className="flex flex-col items-center justify-center gap-3 h-48 rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 transition-colors">
                            <Plus size={24} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-bold text-zinc-400 group-hover:text-blue-400 transition-colors tracking-tight">Vytvoriť nový projekt</span>
                    </button>

                    {/* Render Projects */}
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

            </div>
        </main>
      </div>

      {/* --- MODAL PRE NOVÝ PROJEKT --- */}
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