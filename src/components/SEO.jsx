import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../hooks/useLanguage.jsx';

const SEO = () => {
  const { lang } = useLanguage();

  const siteUrl = 'https://alcastelo.github.io/github-tail';
  const imageUrl = `${siteUrl}/og-image.png`;

  const seoContent = {
    en: {
      title: 'GitHub Tail - Real-Time Updated Repositories | Live Dashboard',
      description: 'Track up to 500 of the most recently updated public GitHub repositories with 20+ stars in real-time. Auto-refreshed every 5 minutes. Free, open-source, and fully static.',
      keywords: 'GitHub, repositories, real-time, dashboard, trending repos, GitHub API, open source, live updates, GitHub search, React, Vite, recently updated repos',
      author: 'alcastelo',
      twitterTitle: 'GitHub Tail - Real-Time Updated Repos',
      twitterDescription: 'Live dashboard tracking 500+ recently updated GitHub repositories. Updated every 5 minutes automatically.',
      ogTitle: 'GitHub Tail - Real-Time Updated Repositories Dashboard',
      ogDescription: 'Discover the most recently updated public repositories on GitHub. Track up to 500 repos with 20+ stars, auto-refreshed every 5 minutes via GitHub Actions.',
    },
    es: {
      title: 'GitHub Tail - Repositorios Actualizados en Tiempo Real | Dashboard en Vivo',
      description: 'Rastrea hasta 500 de los repositorios públicos más recientemente actualizados en GitHub con 20+ estrellas en tiempo real. Actualización automática cada 5 minutos. Gratis, código abierto y completamente estático.',
      keywords: 'GitHub, repositorios, tiempo real, dashboard, repos trending, GitHub API, código abierto, actualizaciones en vivo, búsqueda GitHub, React, Vite, repos actualizados recientemente',
      author: 'alcastelo',
      twitterTitle: 'GitHub Tail - Repos Actualizados en Tiempo Real',
      twitterDescription: 'Dashboard en vivo rastreando 500+ repositorios de GitHub actualizados recientemente. Actualizado cada 5 minutos automáticamente.',
      ogTitle: 'GitHub Tail - Dashboard de Repositorios Actualizados en Tiempo Real',
      ogDescription: 'Descubre los repositorios públicos más recientemente actualizados en GitHub. Rastrea hasta 500 repos con 20+ estrellas, actualizado automáticamente cada 5 minutos mediante GitHub Actions.',
    }
  };

  const content = seoContent[lang];

  // Schema.org JSON-LD structured data
  const schemaOrgWebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: content.title,
    description: content.description,
    url: siteUrl,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    author: {
      '@type': 'Person',
      name: content.author,
      url: 'https://github.com/alcastelo'
    },
    creator: {
      '@type': 'Person',
      name: content.author,
      url: 'https://github.com/alcastelo'
    },
    inLanguage: [lang, 'en', 'es'],
    isAccessibleForFree: true,
    screenshot: imageUrl,
    softwareVersion: '2.0',
    releaseNotes: 'React 18 + Vite migration with enhanced SEO',
    featureList: [
      'Real-time GitHub repository tracking',
      'Auto-refresh every 5 minutes',
      'Track up to 500 repositories',
      'Filter by stars and search',
      'Bilingual interface (English/Spanish)',
      'Mobile responsive design',
      'Zero backend - fully static'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
      bestRating: '5',
      worstRating: '1'
    }
  };

  const schemaOrgBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl
      }
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={lang} />
      <title>{content.title}</title>
      <meta name="title" content={content.title} />
      <meta name="description" content={content.description} />
      <meta name="keywords" content={content.keywords} />
      <meta name="author" content={content.author} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <link rel="canonical" href={siteUrl} />

      {/* Language alternates */}
      <link rel="alternate" hrefLang="en" href={`${siteUrl}/?lang=en`} />
      <link rel="alternate" hrefLang="es" href={`${siteUrl}/?lang=es`} />
      <link rel="alternate" hrefLang="x-default" href={siteUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={content.ogTitle} />
      <meta property="og:description" content={content.ogDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="GitHub Tail Dashboard Preview" />
      <meta property="og:site_name" content="GitHub Tail" />
      <meta property="og:locale" content={lang === 'es' ? 'es_ES' : 'en_US'} />
      <meta property="og:locale:alternate" content={lang === 'es' ? 'en_US' : 'es_ES'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={content.twitterTitle} />
      <meta name="twitter:description" content={content.twitterDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content="GitHub Tail Dashboard Preview" />
      <meta name="twitter:creator" content="@alcastelo" />
      <meta name="twitter:site" content="@alcastelo" />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#020617" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="GitHub Tail" />
      <meta name="application-name" content="GitHub Tail" />
      <meta name="msapplication-TileColor" content="#020617" />
      <meta name="format-detection" content="telephone=no" />

      {/* Performance & Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="origin-when-cross-origin" />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgWebPage)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgBreadcrumb)}
      </script>
    </Helmet>
  );
};

export default SEO;
