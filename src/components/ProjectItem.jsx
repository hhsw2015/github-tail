import { useLanguage } from '../hooks/useLanguage.jsx';

const ProjectItem = ({ repo }) => {
  const { t } = useLanguage();

  return (
    <li className="project-item">
      <div className="repo-header">
        {repo.owner?.avatar_url && (
          <img
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            className="owner-avatar"
            loading="lazy"
          />
        )}
        <h2>
          {repo.owner && (
            <>
              <a
                href={repo.owner.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="owner-link"
              >
                {repo.owner.login}
              </a>
              {' / '}
            </>
          )}
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
        </h2>
      </div>
      <p>{repo.description || <em>{t('noDescription')}</em>}</p>
      <div className="meta-row">
        <span>⭐ {repo.stargazers_count}</span>
        <span>{repo.language || '—'}</span>
        <span>
          {t('updated')}
          {repo.updated_at
            ? new Date(repo.updated_at).toLocaleString()
            : t('unknown')}
        </span>
      </div>
    </li>
  );
};

export default ProjectItem;
