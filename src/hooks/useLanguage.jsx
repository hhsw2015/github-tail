import { useState, useEffect, createContext, useContext } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    // Check for URL parameter first, then saved preference, then browser language
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const savedLang = localStorage.getItem('preferred-language');
    const browserLang = navigator.language.split('-')[0];

    if (urlLang && (urlLang === 'en' || urlLang === 'es')) {
      setLang(urlLang);
    } else if (savedLang) {
      setLang(savedLang);
    } else if (browserLang === 'es') {
      setLang('es');
    }
  }, []);

  const switchLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('preferred-language', newLang);
    document.documentElement.lang = newLang;
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
