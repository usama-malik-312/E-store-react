import { Select } from "antd";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const languages = [
    { label: "English", value: "en" },
    { label: "اردو", value: "ur" },
  ];

  return (
    <Select
      value={language}
      onChange={(value) => setLanguage(value as "en" | "ur")}
      options={languages}
      size="small"
      style={{ minWidth: 100 }}
    />
  );
};

