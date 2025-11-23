import { useLanguage } from '../hooks/useLanguage.jsx';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <span>{t('footerGenerated')} </span>
          <a
            href="https://github.com/alcastelo/github-tail"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('footerViewRepo')}
          </a>
        </div>

        <div className="kofi-container">
          <span className="kofi-text">{t('footerKofi')}</span>
          <a
            href="https://ko-fi.com/H2H71OI1ZN"
            target="_blank"
            rel="noopener noreferrer"
            className="kofi-button"
          >
            <img
              height="36"
              style={{ border: 0, height: '36px' }}
              src="https://storage.ko-fi.com/cdn/kofi2.png?v=3"
              border="0"
              alt="Buy Me a Coffee at ko-fi.com"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
