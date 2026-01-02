import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "@/locales/en.json";
import urTranslations from "@/locales/ur.json";

// Get saved language from localStorage or default to English
const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  lng: savedLanguage,
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  resources: {
    en: {
      translation: enTranslations,
    },
    ur: {
      translation: urTranslations,
    },
  },
});

// Set initial document direction
const isRTL = savedLanguage === "ur";
document.documentElement.dir = isRTL ? "rtl" : "ltr";
document.documentElement.lang = savedLanguage;

if (isRTL) {
  document.body.classList.add("rtl");
} else {
  document.body.classList.add("ltr");
}

export default i18n;
