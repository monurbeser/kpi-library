"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  Language,
  TRANSLATIONS,
  detectBrowserLanguage,
  getSavedLanguage,
  saveLanguage,
} from "@/lib/i18n";

interface LanguageContextValue {
  lang: Language;
  t: typeof TRANSLATIONS["tr"];
  setLang: (lang: Language) => void;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("tr");

  useEffect(() => {
    const initial = getSavedLanguage() ?? detectBrowserLanguage();
    setLangState(initial);
  }, []);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    saveLanguage(l);
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "tr" ? "en" : "tr");
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={{ lang, t: TRANSLATIONS[lang], setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
