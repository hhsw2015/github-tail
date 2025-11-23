import { useLanguage } from '../hooks/useLanguage.jsx';

const Controls = ({ searchTerm, setSearchTerm, minStars, setMinStars }) => {
  const { t } = useLanguage();

  return (
    <section className="controls">
      <label>
        <span>{t('search')}</span>
        <input
          type="text"
          id="search-input"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>
      <label>
        <span>{t('minStars')}</span>
        <input
          type="number"
          id="min-stars-input"
          value={minStars}
          min="0"
          onChange={(e) => setMinStars(e.target.value)}
        />
      </label>
    </section>
  );
};

export default Controls;
