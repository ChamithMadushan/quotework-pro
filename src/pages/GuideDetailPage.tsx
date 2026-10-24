import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SEO, StructuredData } from '../components/SEO';
import { getGuideBySlug, getRelatedGuides } from '../data/guides';
import { 
  Clock, Calendar, User, ChevronRight, ArrowLeft, ArrowRight, 
  CheckCircle2, HelpCircle, ChevronDown, ChevronUp, FileText, 
  Sparkles, Share2, Printer, Check 
} from 'lucide-react';

export const GuideDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  if (!slug) {
    return <Navigate to="/guides" replace />;
  }

  const guide = getGuideBySlug(slug);

  if (!guide) {
    return (
      <div className="container py-12 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <SEO 
          title="Guide Not Found" 
          description="The quotation guide you are looking for does not exist or has been moved."
          canonical="/guides"
        />
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Guide Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '480px' }}>
          We couldn't find the article you were looking for. It may have been updated or moved.
        </p>
        <Link to="/guides" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Quotation Guides
        </Link>
      </div>
    );
  }

  const relatedGuides = getRelatedGuides(guide.relatedSlugs);

  const toggleFaq = (index: number) => {
    if (openFaqIndices.includes(index)) {
      setOpenFaqIndices(openFaqIndices.filter(i => i !== index));
    } else {
      setOpenFaqIndices([...openFaqIndices, index]);
    }
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Structured Data schemas: Article, BreadcrumbList, FAQPage
  const articleSchema: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': guide.title,
    'description': guide.metaDescription,
    'image': 'https://quoteworkpro.com/og-image.png',
    'datePublished': guide.publishedDate,
    'dateModified': guide.updatedDate,
    'author': {
      '@type': 'Organization',
      'name': guide.author,
      'url': 'https://quoteworkpro.com'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'QuoteWork Pro',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://quoteworkpro.com/logo.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://quoteworkpro.com/guides/${guide.slug}`
    }
  };

  const breadcrumbSchema: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://quoteworkpro.com/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Guides',
        'item': 'https://quoteworkpro.com/guides'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': guide.title,
        'item': `https://quoteworkpro.com/guides/${guide.slug}`
      }
    ]
  };

  const faqSchema: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': guide.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <div className="guide-detail-page">
      <SEO 
        title={guide.title}
        description={guide.metaDescription}
        canonical={`/guides/${guide.slug}`}
        type="article"
        publishedTime={guide.publishedDate}
        author={guide.author}
        schema={[articleSchema, breadcrumbSchema, faqSchema]}
      />

      {/* Breadcrumb Header */}
      <div className="guide-breadcrumb-bar">
        <div className="container">
          <nav className="guide-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <Link to="/guides">Guides</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span aria-current="page">{guide.title}</span>
          </nav>
        </div>
      </div>

      {/* Guide Article Hero */}
      <header className="guide-header">
        <div className="container guide-header-container">
          <div className="guide-header-badges">
            <span className="badge badge-primary">{guide.category}</span>
            <span className="guide-meta-item">
              <Clock size={14} /> {guide.readTime}
            </span>
            <span className="guide-meta-item">
              <Calendar size={14} /> Last updated: {guide.updatedDate}
            </span>
          </div>

          <h1 className="guide-page-title">{guide.title}</h1>
          <p className="guide-page-subtitle">{guide.subtitle}</p>

          <div className="guide-author-bar">
            <div className="guide-author-info">
              <div className="guide-author-avatar">
                <User size={18} />
              </div>
              <div>
                <span className="guide-author-name">{guide.author}</span>
                <span className="guide-author-role">Commercial Documentation Specialist</span>
              </div>
            </div>

            <div className="guide-actions">
              <button 
                className="btn btn-sm btn-ghost" 
                onClick={handleCopyLink}
                title="Copy article link"
              >
                {copied ? <Check size={16} style={{ color: 'var(--success, #10b981)' }} /> : <Share2 size={16} />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
              <button 
                className="btn btn-sm btn-ghost" 
                onClick={() => window.print()}
                title="Print this guide"
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Guide Layout */}
      <div className="container guide-layout">
        <main className="guide-main-content">
          {/* Key Takeaways Box */}
          <div className="key-takeaways-box">
            <div className="key-takeaways-header">
              <CheckCircle2 size={20} className="takeaway-icon" />
              <h3>Key Practical Takeaways</h3>
            </div>
            <ul className="key-takeaways-list">
              {guide.keyTakeaways.map((takeaway, idx) => (
                <li key={idx}>
                  <strong>Point {idx + 1}:</strong> {takeaway}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Table of Contents */}
          <nav className="guide-toc" aria-label="Table of contents">
            <h4>In this practical guide:</h4>
            <ul>
              {guide.sections.map((section, idx) => (
                <li key={section.id || idx}>
                  <a href={`#section-${section.id}`}>{section.title}</a>
                </li>
              ))}
              <li><a href="#frequently-asked-questions">Frequently Asked Questions</a></li>
            </ul>
          </nav>

          {/* Guide Sections */}
          <div className="guide-sections">
            {guide.sections.map((section) => (
              <section key={section.id} id={`section-${section.id}`} className="guide-section">
                <h2>{section.title}</h2>
                <div 
                  className="guide-section-body"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Embedded Tool CTA */}
          <div className="guide-embedded-tool-card">
            <div className="tool-cta-content">
              <span className="badge badge-accent">
                <Sparkles size={14} style={{ marginRight: '6px' }} />
                Interactive Quotation Builder
              </span>
              <h3>Put this guide into practice on QuoteWork Pro</h3>
              <p>
                Apply the exact layout, Sri Lankan LKR formats, line discounts, and payment terms discussed above in our free quotation creator.
              </p>
            </div>
            <div className="tool-cta-button">
              <Link to="/create" className="btn btn-primary btn-lg">
                <FileText size={18} />
                Generate Quotation Now
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <section id="frequently-asked-questions" className="guide-faq-section">
            <div className="faq-section-header">
              <HelpCircle size={24} className="faq-icon" />
              <div>
                <h2>Frequently Asked Questions</h2>
                <p>Common questions from business owners and procurement professionals</p>
              </div>
            </div>

            <div className="faq-list">
              {guide.faqs.map((faq, idx) => {
                const isOpen = openFaqIndices.includes(idx);
                return (
                  <div key={idx} className={`faq-card ${isOpen ? 'open' : ''}`}>
                    <button 
                      className="faq-question"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {isOpen && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="guide-sidebar">
          {/* Quick Tool Launch Widget */}
          <div className="sidebar-widget widget-generator">
            <h4>Create a Quotation</h4>
            <p>Generate professional A4 PDF quotations with your logo, itemized pricing, and legal terms.</p>
            <ul className="widget-checklist">
              <li><CheckCircle2 size={14} /> 100% Free, no signup</li>
              <li><CheckCircle2 size={14} /> Sri Lanka LKR & global currencies</li>
              <li><CheckCircle2 size={14} /> Auto discount & VAT calculations</li>
              <li><CheckCircle2 size={14} /> High-resolution PDF export</li>
            </ul>
            <Link to="/create" className="btn btn-primary btn-block">
              Open Quotation Maker <ArrowRight size={16} />
            </Link>
          </div>

          {/* Related Guides Widget */}
          {relatedGuides.length > 0 && (
            <div className="sidebar-widget widget-related">
              <h4>Related Guides</h4>
              <div className="related-guides-list">
                {relatedGuides.map(rel => (
                  <Link key={rel.slug} to={`/guides/${rel.slug}`} className="related-guide-item">
                    <span className="related-category">{rel.category}</span>
                    <h5>{rel.title}</h5>
                    <span className="related-meta">{rel.readTime}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Related Guides Full Grid at Bottom */}
      {relatedGuides.length > 0 && (
        <section className="guide-bottom-related">
          <div className="container">
            <div className="bottom-related-header">
              <h2>Explore More Quotation Resources</h2>
              <Link to="/guides" className="view-all-link">
                View all guides <ArrowRight size={14} />
              </Link>
            </div>
            <div className="guides-grid">
              {relatedGuides.slice(0, 3).map(rel => (
                <article key={rel.slug} className="guide-card">
                  <div className="guide-card-header">
                    <span className="guide-card-category">{rel.category}</span>
                    <span className="guide-card-meta">{rel.readTime}</span>
                  </div>
                  <h3 className="guide-card-title">
                    <Link to={`/guides/${rel.slug}`}>{rel.title}</Link>
                  </h3>
                  <p className="guide-card-excerpt">{rel.metaDescription}</p>
                  <div className="guide-card-footer">
                    <span className="guide-card-date">{rel.updatedDate}</span>
                    <Link to={`/guides/${rel.slug}`} className="guide-card-link">
                      Read <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
