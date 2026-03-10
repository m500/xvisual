"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import { Language } from "@/i18n/dictionaries";
import { 
  Input, 
  Button, 
  Card, 
  CardBody, 
  Select,
  SelectItem
} from "@heroui/react";
import { 
  ArrowLeft, Globe, User, Mail, Link as LinkIcon, 
  CaseSensitive, HandHeart, Plus
} from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const { t, language: dashboardLang } = useLanguage();

  const [projectName, setProjectName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [projectLang, setProjectLang] = useState<Language>(dashboardLang); 
  
  const [clientGreeting, setClientGreeting] = useState(""); 
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const isEmailInvalid = useMemo(() => {
    if (clientEmail === "") return false;
    return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(clientEmail);
  }, [clientEmail]);

  const handleCreateProject = () => {
    console.log("Vytváram projekt do DB:", { projectName, projectUrl, projectLang, clientGreeting, clientName, clientEmail });
    router.push('/dashboard');
  };

  const getInputClassNames = (isError = false) => ({
    input: `text-sm tracking-tight focus:outline-none !outline-none h-full ${isError ? 'text-red-400 placeholder:text-red-400/50' : 'text-white placeholder:text-zinc-600'}`,
    innerWrapper: "flex items-center gap-3 h-full",
    inputWrapper: `bg-black border data-[hover=true]:border-white/20 group-data-[focus=true]:!ring-0 rounded-xl transition-colors shadow-none h-12 px-4 
      ${isError 
        ? 'border-red-500/50 group-data-[focus=true]:border-red-500' 
        : 'border-white/10 group-data-[focus=true]:border-white'}`
  });

  return (
    // Zmenili sme šírku na max-w-5xl, aby sa sem pekne zmestili dva stĺpce
    <div className="max-w-5xl mx-auto pb-12">
      
      <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors tracking-tight group mb-6"
      >
          <ArrowLeft size={16} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
          {t('dashboard.newForm.back')}
      </button>

      <div className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{t('dashboard.newForm.title')}</h1>
            <p className="text-sm text-zinc-500 tracking-tight">{t('dashboard.newForm.subtitle')}</p>
        </div>
      </div>

      {/* --- GRID: DVA STĹPCE VEDĽA SEBA --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* --- ZÁKLADNÉ INFORMÁCIE --- */}
        <Card radius="none" className="bg-[rgb(24,24,27)] border border-white/5 rounded-2xl h-full">
            <CardBody className="p-6 gap-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2 mb-1">
                    <CaseSensitive size={16} className="text-blue-500" />
                    {t('dashboard.newForm.basicInfo')}
                </h2>
                
                <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-xs font-bold tracking-tight pl-1">
                        {t('dashboard.newForm.labels.projectName')}
                    </label>
                    <Input
                        size="lg" 
                        aria-label={t('dashboard.newForm.labels.projectName')}
                        variant="bordered"
                        placeholder={t('dashboard.newForm.placeholders.projectName')}
                        value={projectName}
                        onValueChange={setProjectName}
                        classNames={getInputClassNames()}
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-xs font-bold tracking-tight pl-1">
                        {t('dashboard.newForm.labels.projectUrl')}
                    </label>
                    <Input
                        size="lg" 
                        aria-label={t('dashboard.newForm.labels.projectUrl')}
                        variant="bordered"
                        placeholder={t('dashboard.newForm.placeholders.projectUrl')}
                        value={projectUrl}
                        onValueChange={setProjectUrl}
                        startContent={<Globe size={18} className="text-zinc-500 flex-shrink-0" />}
                        classNames={getInputClassNames()}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-xs font-bold tracking-tight pl-1">
                        {t('dashboard.newForm.labels.projectLang')}
                    </label>
                    <Select
                        size="lg" 
                        aria-label={t('dashboard.newForm.labels.projectLang')}
                        variant="bordered"
                        selectedKeys={new Set([projectLang])}
                        onSelectionChange={(keys) => setProjectLang(Array.from(keys)[0] as Language)}
                        classNames={{
                            trigger: "bg-black border border-white/10 data-[hover=true]:border-white/20 data-[open=true]:border-white data-[open=true]:!ring-0 data-[focus=true]:border-white data-[focus=true]:!ring-0 rounded-xl transition-colors shadow-none h-12 px-4 flex flex-row items-center justify-between",
                            innerWrapper: "flex items-center w-full",
                            value: "text-white font-bold uppercase tracking-wider text-xs text-left truncate w-full",
                            popoverContent: "bg-[rgb(24,24,27)] border border-white/10 text-white"
                        }}
                    >
                        <SelectItem key="en" textValue="English">English</SelectItem>
                        <SelectItem key="sk" textValue="Slovenčina">Slovenčina</SelectItem>
                        <SelectItem key="cs" textValue="Čeština">Čeština</SelectItem>
                        <SelectItem key="de" textValue="Deutsch">Deutsch</SelectItem>
                    </Select>
                </div>
            </CardBody>
        </Card>

        {/* --- KLIENT A PRÍSTUP --- */}
        <Card radius="none" className="bg-[rgb(24,24,27)] border border-white/5 rounded-2xl h-full">
            <CardBody className="p-6 gap-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2 mb-1">
                    <User size={16} className="text-amber-500" />
                    {t('dashboard.newForm.clientInfo')}
                </h2>

                <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-xs font-bold tracking-tight pl-1">
                        {t('dashboard.newForm.labels.clientGreeting')}
                    </label>
                    <Input
                        size="lg"
                        aria-label={t('dashboard.newForm.labels.clientGreeting')}
                        variant="bordered"
                        placeholder={t('dashboard.newForm.placeholders.clientGreeting')}
                        value={clientGreeting}
                        onValueChange={setClientGreeting}
                        startContent={<HandHeart size={18} className="text-zinc-500 flex-shrink-0" />}
                        classNames={getInputClassNames()}
                    />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <label className="text-zinc-400 text-xs font-bold tracking-tight pl-1">
                        {t('dashboard.newForm.labels.clientName')}
                    </label>
                    <Input
                        size="lg" 
                        aria-label={t('dashboard.newForm.labels.clientName')}
                        variant="bordered"
                        placeholder={t('dashboard.newForm.placeholders.clientName')}
                        value={clientName}
                        onValueChange={setClientName}
                        startContent={<LinkIcon size={18} className="text-zinc-500 flex-shrink-0" />}
                        classNames={getInputClassNames()}
                    />
                    <p className="text-[10px] text-zinc-500 tracking-tight leading-snug pl-1">
                        {t('dashboard.newForm.descriptions.clientName')}
                    </p>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <label className="text-zinc-400 text-xs font-bold tracking-tight pl-1">
                        {t('dashboard.newForm.labels.clientEmail')}
                    </label>
                    <Input
                        size="lg" 
                        aria-label={t('dashboard.newForm.labels.clientEmail')}
                        variant="bordered"
                        placeholder={t('dashboard.newForm.placeholders.clientEmail')}
                        value={clientEmail}
                        onValueChange={setClientEmail}
                        isInvalid={isEmailInvalid}
                        errorMessage={isEmailInvalid ? t('dashboard.newForm.errors.invalidEmail') : ""}
                        startContent={<Mail size={18} className={isEmailInvalid ? "text-red-400" : "text-zinc-500 flex-shrink-0"} />}
                        classNames={{
                            ...getInputClassNames(isEmailInvalid),
                            errorMessage: "text-red-400 text-xs font-bold pl-1 mt-1"
                        }}
                    />
                    {!isEmailInvalid && (
                        <p className="text-[10px] text-zinc-500 tracking-tight leading-snug pl-1">
                            {t('dashboard.newForm.descriptions.clientEmail')}
                        </p>
                    )}
                </div>
            </CardBody>
        </Card>

      </div>

      {/* --- TLAČIDLO ODOSLAŤ (Zarovnané doprava, menšie) --- */}
      <div className="flex justify-end mt-8">
          <Button 
              size="md" // Menšia veľkosť tlačidla
              onPress={handleCreateProject}
              isDisabled={!projectName || !projectUrl || !clientName || !clientEmail || isEmailInvalid}
              className="bg-white text-black hover:bg-zinc-200 font-bold tracking-tight rounded-xl px-8 disabled:opacity-30 flex items-center gap-2"
          >
              <Plus size={18} strokeWidth={2.5} />
              {t('dashboard.newForm.submit')}
          </Button>
      </div>

    </div>
  );
}