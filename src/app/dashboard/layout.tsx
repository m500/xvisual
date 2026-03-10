"use client";

import React from "react";
import { useRouter } from "next/navigation"; // TOTO TU CHÝBALO
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { Language } from "@/i18n/dictionaries";
import { Search, Folder, Users, Settings, Plus, Globe } from "lucide-react";

// Samotný obal s dizajnom (Sidebar + Hlavička)
function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // PRESUNUTÉ SEM, DOVNÚTRA KOMPONENTU!
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex h-screen bg-[#121212] text-white font-sans overflow-hidden">
      
      {/* --- BOČNÝ PANEL (Spoločný pre všetky podstránky) --- */}
      <aside className="w-64 border-r border-white/10 flex flex-col p-4 bg-[#0a0a0a]">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-zinc-800"></div>
            <div className="flex flex-col">
                <span className="font-bold text-sm">Michal Dizajnér</span>
                <span className="text-xs text-zinc-500">michal@agentura.sk</span>
            </div>
        </div>

        <button 
            onClick={() => router.push('/dashboard/new')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 rounded-xl mb-8 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
        >
            <Plus size={16} strokeWidth={2.5} />
            {t('dashboard.sidebar.newProject')}
        </button>

        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">
            {t('dashboard.sidebar.menuLabel')}
        </span>
        <nav className="flex flex-col gap-1 mb-8">
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                <div className="w-4 h-4 rounded-sm border-2 border-current"></div>
                {t('dashboard.sidebar.overview')}
            </button>
            <button className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800 text-white transition-colors text-sm font-medium">
                <div className="flex items-center gap-3">
                    <Folder size={16} />
                    {t('dashboard.sidebar.projects')}
                </div>
                <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
            </button>
        </nav>

        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">
            {t('dashboard.sidebar.teamSettingsLabel')}
        </span>
        <nav className="flex flex-col gap-1 flex-grow">
            <button className="flex items-center justify-between px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                <div className="flex items-center gap-3">
                    <Users size={16} />
                    {t('dashboard.sidebar.teamManagement')}
                </div>
                <span className="border border-amber-500/30 text-amber-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full">PRO</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                <Settings size={16} />
                {t('dashboard.sidebar.settings')}
            </button>
        </nav>

        <div className="mt-auto border border-white/10 bg-black rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-zinc-300">{t('dashboard.quota.title')}</span>
                <span className="text-xs font-bold">3/5</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full mb-3 overflow-hidden">
                <div className="h-full bg-blue-600 w-3/5 rounded-full"></div>
            </div>
            <p className="text-[10px] text-zinc-500">
                {t('dashboard.quota.upgrade')}
            </p>
        </div>
      </aside>

      {/* --- HLAVNÁ ČASŤ (Hlavička + Meniaci sa obsah) --- */}
      <div className="flex-grow flex flex-col">
        
        {/* HORNÁ LIŠTA (Spoločná pre všetky podstránky) */}
        <header className="h-16 border-b border-white/10 px-8 flex items-center justify-between flex-shrink-0">
            <div className="relative w-96">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                    type="text" 
                    placeholder={t('dashboard.search')} 
                    className="w-full bg-transparent border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            {/* PREPÍNAČ JAZYKOV */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
                <Globe size={14} className="text-zinc-400 ml-1.5" />
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="bg-transparent border-none text-xs font-bold uppercase tracking-wider text-zinc-300 p-1 pr-6 outline-none cursor-pointer appearance-none"
                >
                    <option value="en" className="bg-zinc-900">EN</option>
                    <option value="sk" className="bg-zinc-900">SK</option>
                    <option value="cs" className="bg-zinc-900">CS</option>
                    <option value="de" className="bg-zinc-900">DE</option>
                </select>
            </div>
        </header>

        {/* TU SA BUDE VYKRESĽOVAŤ OBSAH KONKRÉTNYCH STRÁNOK (page.tsx alebo project/[id]/page.tsx) */}
        <main className="flex-grow overflow-auto p-10">
            {children}
        </main>

      </div>
    </div>
  );
}

// Obalíme to do Providera, aby preklady fungovali v celom Dashboarde
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <DashboardShell>{children}</DashboardShell>
    </LanguageProvider>
  );
}