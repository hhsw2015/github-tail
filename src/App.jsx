import { useState, useEffect, useCallback, useRef } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider, useLanguage } from './hooks/useLanguage.jsx';
import { useAutoRefresh } from './hooks/useAutoRefresh.js';
import SEO from './components/SEO';
import Header from './components/Header';
import Controls from './components/Controls';
import Pagination from './components/Pagination';
import ProjectList from './components/ProjectList';
import Footer from './components/Footer';
import UpdateNotification from './components/UpdateNotification';
import RefreshIndicator from './components/RefreshIndicator';

const PAGE_SIZE = 25;

const AppContent = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [minStars, setMinStars] = useState('20');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const isInitialLoad = useRef(true);
  const lastUpdatedRef = useRef(null);

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/alcastelo/github-tail/refs/heads/master/data/projects.json?cb=${Date.now()}`,
        { cache: 'no-store' }
      );
      const data = await res.json();

      const newLastUpdated = data.last_updated;
      const hasChanges = lastUpdatedRef.current && newLastUpdated !== lastUpdatedRef.current;

      // Only update state if data actually changed
      if (hasChanges || isInitialLoad.current) {
        lastUpdatedRef.current = newLastUpdated;
        setLastUpdated(newLastUpdated);
        setProjects(data.projects || []);
        setTotalCount(data.count || 0);

        // Set default min stars on initial load
        if (isInitialLoad.current && data.source?.min_stars) {
          setMinStars(data.source.min_stars.toString());
        }

        // Show notification and reset to page 1 if data changed (not on initial load)
        if (hasChanges && !isInitialLoad.current) {
          setShowNotification(true);
          setCurrentPage(1);
        }

        isInitialLoad.current = false;
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      throw err;
    }
  }, []);

  const { status, lastCheckTime } = useAutoRefresh(loadProjects);

  // Load projects on mount only (not when loadProjects changes)
  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters when projects, searchTerm, or minStars change
  useEffect(() => {
    const minStarsNum = parseInt(minStars || '0', 10);
    const searchLower = searchTerm.toLowerCase().trim();

    const filtered = projects.filter((p) => {
      const meetsStars = (p.stargazers_count || 0) >= minStarsNum;
      const meetsSearch =
        !searchLower ||
        (p.full_name || p.name || '').toLowerCase().includes(searchLower) ||
        (p.description || '').toLowerCase().includes(searchLower);

      return meetsStars && meetsSearch;
    });

    setFilteredProjects(filtered);

    // Reset to page 1 when filters change
    if (searchTerm || minStars !== '20') {
      setCurrentPage(1);
    }
  }, [projects, searchTerm, minStars]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageProjects = filteredProjects.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top of projects container
    const container = document.getElementById('projects-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <SEO />
      <Header />
      <main className="container">
        <Controls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          minStars={minStars}
          setMinStars={setMinStars}
        />

        <section id="meta" className="meta">
          <span id="last-updated">
            {lastUpdated
              ? `${t('lastUpdated')}${new Date(lastUpdated).toLocaleString()}`
              : t('noData')}
          </span>
          <span id="total-count">
            {t('reposListed')}
            {totalCount}
          </span>
        </section>

        <RefreshIndicator status={status} lastCheckTime={lastCheckTime} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          position="top"
        />

        <ProjectList projects={pageProjects} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          position="bottom"
        />
      </main>

      <Footer />

      <UpdateNotification
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </HelmetProvider>
  );
};

export default App;
