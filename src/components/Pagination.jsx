import { useLanguage } from '../hooks/useLanguage.jsx';

const Pagination = ({ currentPage, totalPages, onPageChange, position = 'bottom' }) => {
  const { t } = useLanguage();

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const pageText = t('pageOf')
    .replace('{current}', currentPage)
    .replace('{total}', totalPages);

  const goToFirstPage = () => {
    if (!isFirstPage) {
      onPageChange(1);
    }
  };

  const goToPrevPage = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  const goToLastPage = () => {
    if (!isLastPage) {
      onPageChange(totalPages);
    }
  };

  return (
    <section className={`pagination pagination-${position}`}>
      <button
        onClick={goToFirstPage}
        disabled={isFirstPage}
        title={t('firstPageTitle')}
      >
        {t('firstPage')}
      </button>
      <button
        onClick={goToPrevPage}
        disabled={isFirstPage}
        title={t('prevPageTitle')}
      >
        {t('prevPage')}
      </button>
      <span>{pageText}</span>
      <button
        onClick={goToNextPage}
        disabled={isLastPage}
        title={t('nextPageTitle')}
      >
        {t('nextPage')}
      </button>
      <button
        onClick={goToLastPage}
        disabled={isLastPage}
        title={t('lastPageTitle')}
      >
        {t('lastPage')}
      </button>
    </section>
  );
};

export default Pagination;
