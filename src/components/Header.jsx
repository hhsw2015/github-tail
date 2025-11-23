import { useLanguage } from '../hooks/useLanguage.jsx';

const Header = () => {
  const { lang, switchLanguage, t } = useLanguage();

  return (
    <header className="header">
      <div className="language-switcher">
        <button
          className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          onClick={() => switchLanguage('en')}
        >
          🇬🇧 EN
        </button>
        <button
          className={`lang-btn ${lang === 'es' ? 'active' : ''}`}
          onClick={() => switchLanguage('es')}
        >
          🇪🇸 ES
        </button>
      </div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <p className="sub-info">{t('autoUpdate')}</p>
      <p className="sub-info-small">{t('autoRefreshInfo')}</p>
    </header>
  );
};

export default Header;
