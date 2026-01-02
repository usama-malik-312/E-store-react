import { useTranslation as useI18nTranslation } from "react-i18next";

/**
 * Custom hook for translations with type safety
 * This is a wrapper around react-i18next's useTranslation
 */
export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  return { t, i18n };
};

