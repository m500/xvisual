import { dictionaries, Language } from '../i18n/dictionaries';

export const useTranslation = (lang: Language) => {
  const t = (path: string): string => {
    const keys = path.split('.');
    
    // Fallback na angličtinu, ak sa náhodou jazyk nenájde
    let current: any = dictionaries[lang] || dictionaries.en;
    
    for (const key of keys) {
      if (current[key] === undefined) {
         console.warn(`[i18n] Chýbajúci preklad pre kľúč: ${path} v jazyku ${lang}`);
         return path; // Ak nenájde, vráti aspoň samotný kód
      }
      current = current[key];
    }
    
    return current as string;
  };

  return { t };
};