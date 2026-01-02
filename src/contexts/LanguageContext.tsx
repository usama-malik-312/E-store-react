import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type Language = "en" | "ur";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language") as Language;
    return saved || "en";
  });

  const isRTL = language === "ur";

  useEffect(() => {
    // Update i18n language
    i18n.changeLanguage(language);

    // Update document direction and language
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;

    // Update body class for RTL styling
    if (isRTL) {
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
    } else {
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
    }

    // Save to localStorage
    localStorage.setItem("language", language);
  }, [language, isRTL, i18n]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

