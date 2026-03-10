"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries, Language } from './dictionaries';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('sk'); // Predvolený default
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 1. Zisti, či si užívateľ niekedy predtým zvolil jazyk
    const savedLang = localStorage.getItem('xvisual_dashboard_lang') as Language;
    if (savedLang && dictionaries[savedLang]) {
      setLanguageState(savedLang);
    } 
    // 2. Ak nie, skús to odhadnúť podľa jeho prehliadača (napr. "sk-SK" -> "sk")
    else {
      const browserLang = navigator.language.slice(0, 2) as Language;
      if (dictionaries[browserLang]) {
        setLanguageState(browserLang);
      }
    }
    // Až keď vieme správny jazyk, môžeme zobraziť aplikáciu
    setIsMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('xvisual_dashboard_lang', lang); // Uloženie na ďalšie návštevy
  };

  const t = (path: string): string => {
    // Prekladacia logika: Nájde string podľa cesty (napr. "dashboard.sidebar.overview")
    const keys = path.split('.');
    let current: any = dictionaries[language] || dictionaries.en;
    
    for (const key of keys) {
      if (current[key] === undefined) {
         console.warn(`[i18n] Chýba preklad pre kľúč: ${path}`);
         return path;
      }
      current = current[key];
    }
    return current as string;
  };

  // Ak sa ešte nezistil jazyk (bežíme na serveri), nič nevykreslíme, aby sme predišli blikaniu
  if (!isMounted) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage musí byť použitý vnútri LanguageProvider");
  }
  return context;
};