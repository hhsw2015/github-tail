import { useLanguage } from '../hooks/useLanguage.jsx';
import ProjectItem from './ProjectItem';

const ProjectList = ({ projects }) => {
  const { t } = useLanguage();

  if (projects.length === 0) {
    return (
      <section id="projects-container">
        <ul id="projects-list" className="projects-list">
          <li>{t('noResults')}</li>
        </ul>
      </section>
    );
  }

  return (
    <section id="projects-container">
      <ul id="projects-list" className="projects-list">
        {projects.map((repo) => (
          <ProjectItem key={repo.id} repo={repo} />
        ))}
      </ul>
    </section>
  );
};

export default ProjectList;
