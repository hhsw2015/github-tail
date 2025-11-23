import { useLanguage } from '../hooks/useLanguage.jsx';

const RefreshIndicator = ({ status, lastCheckTime }) => {
  const { t } = useLanguage();

  let message = '';
  let className = 'refresh-indicator';

  switch (status) {
    case 'checking':
      message = t('checking');
      className += ' checking';
      break;
    case 'updated':
      message = t('lastCheck').replace('{time}', lastCheckTime || '');
      className += ' updated';
      break;
    case 'error':
      message = t('checkError').replace('{time}', lastCheckTime || '');
      className += ' error';
      break;
    default:
      message = t('checking');
  }

  return (
    <section className="auto-refresh-info">
      <span id="refresh-indicator" className={className}>
        {message}
      </span>
    </section>
  );
};

export default RefreshIndicator;
