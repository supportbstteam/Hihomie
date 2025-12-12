import en from './en';
import es from './es';

// Get selected language from localStorage, fallback to 'en'
// const savedLang = typeof window !== "undefined" ? localStorage.getItem('hi_home_trans') : null;
const DEFAULT_LANGUAGE = 'es'; // change fallback to 'es' if needed

const translations = {
  en,
  es,
};

export const t = (key) => {
  return translations[DEFAULT_LANGUAGE]?.[key] || key;
};
// testing