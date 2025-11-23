import { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage.jsx';

const UpdateNotification = ({ show, onClose }) => {
  const { t } = useLanguage();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (show) {
      setFadeOut(false);
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(onClose, 300);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`update-notification ${fadeOut ? 'fade-out' : ''}`}>
      <span dangerouslySetInnerHTML={{ __html: t('newRepos') }} />
      <button onClick={onClose}>✕</button>
    </div>
  );
};

export default UpdateNotification;
