import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import vi from "./vi/index"; 
import en from "./en/index";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: vi, 
      en: en
    },
    lng: localStorage.getItem('language') || "vi",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;