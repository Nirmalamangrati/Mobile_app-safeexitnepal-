import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const resources = {
  en: {
    translation: {
      preferences: "Preferences",
      langSelection: "Language Selection",
      changePassword: "Change Password",
      changeLangBtn: "Change Language",
      currentPassword: "Current Password",
      newPassword: "New Password",
      saveLang: "Save Language",
      updatePass: "Update Password",
      enterCurrentPass: "Enter current password",
      enterNewPass: "Enter new password",
      english: "English",
      nepali: "Nepali",
    },
  },
  ne: {
    translation: {
      preferences: "प्राथमिकताहरू",
      langSelection: "भाषा छनोट",
      changePassword: "पासवर्ड परिवर्तन",
      changeLangBtn: "भाषा परिवर्तन",
      currentPassword: "हालको पासवर्ड",
      newPassword: "नयाँ पासवर्ड",
      saveLang: "भाषा सुरक्षित गर्नुहोस्",
      updatePass: "पासवर्ड अपडेट गर्नुहोस्",
      enterCurrentPass: "हालको पासवर्ड राख्नुहोस्",
      enterNewPass: "नयाँ पासवर्ड राख्नुहोस्",
      english: "English",
      nepali: "नेपाली",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
