import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { GUIDES, GuideCategory } from '../data/guides';
import { 
  BookOpen, Search, ArrowRight, Clock, Calendar, 
  Tag, Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';

const CATEGORIES: { label: string; value: GuideCategory | 'all' }[] = [
  { label: 'All Guides', value: 'all' },
  { label: 'Fundamentals', value: 'Fundamentals' },
  { label: 'Sri Lanka Compliance', value: 'Sri Lanka Compliance' },
  { label: 'Finance & Tax', value: 'Finance & Tax' },
  { label: 'B2B & Trade', value: 'B2B & Trade' },
];

export const GuidesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = GUIDES.filter(guide => {
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesSearch = 
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.metaDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="guides-page">
      <SEO 
        title="Quotation Guides & Business Quotation Resources"
        description="Master quotation creation, Sri Lankan business quotation formats, discount calculation formulas, terms & conditions, and quotation-to-invoice workflows."
        canonical="/guides"
        keywords={[
          'business quotation template',
          'quotation format Sri Lanka',
          'how to create quotation',
          'quotation terms and conditions',
          'discount calculation quotation',
          'quotation vs invoice'
        ]}
      />

      {/* Hero Header */}
      <section className="guides-hero">
        <div className="container">
          <div className="guides-hero-content">
            <span className="badge badge-primary">
              <BookOpen size={14} style={{ marginRight: '6px' }} />
              Knowledge Hub & Best Practices
            </span>
            <h1 className="guides-hero-title">Quotation Knowledge Base & Business Guides</h1>
            <p className="guides-hero-subtitle">
              Actionable guides, regional formats, calculation formulas, and legal guidelines to help freelancers, contractors, and businesses issue winning quotations.
            </p>

            {/* Search and Filters */}
            <div className="guides-search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search guides by keyword, topic, or Sri Lankan VAT/NBT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search guides"
              />
              {searchQuery && (
                <button 
                  className="clear-search" 
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="category-pills" role="tablist" aria-label="Guide categories">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  role="tab"
                  aria-selected={selectedCategory === cat.value}
                  className={`category-pill ${selectedCategory === cat.value ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Grid */}
      <section className="guides-grid-section">
        <div className="container">
          <div className="guides-header-row">
            <div>
              <h2 className="section-title">
                {selectedCategory === 'all' ? 'All Quotation Guides' : `${selectedCategory} Guides`}
              </h2>
              <p className="section-subtitle">
                Showing {filteredGuides.length} practical {filteredGuides.length === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>

          {filteredGuides.length === 0 ? (
            <div className="empty-guides">
              <BookOpen size={48} className="empty-icon" />
              <h3>No articles found</h3>
              <p>We couldn't find any guides matching "{searchQuery}". Try a different search term or category.</p>
              <button 
                className="btn btn-secondary"
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="guides-grid">
              {filteredGuides.map(guide => (
                <article key={guide.slug} className="guide-card">
                  <div className="guide-card-header">
                    <span className="guide-card-category">
                      <Tag size={12} style={{ marginRight: '4px' }} />
                      {guide.category}
                    </span>
                    <span className="guide-card-meta">
                      <Clock size={12} style={{ marginRight: '4px' }} />
                      {guide.readTime}
                    </span>
                  </div>

                  <h3 className="guide-card-title">
                    <Link to={`/guides/${guide.slug}`}>{guide.title}</Link>
                  </h3>

                  <p className="guide-card-excerpt">{guide.metaDescription}</p>

                  <div className="guide-card-footer">
                    <div className="guide-card-date">
                      <Calendar size={12} style={{ marginRight: '4px' }} />
                      {guide.updatedDate}
                    </div>
                    <Link to={`/guides/${guide.slug}`} className="guide-card-link">
                      Read Guide <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Practical Action CTA Section */}
      <section className="guides-cta-section">
        <div className="container">
          <div className="guides-cta-card">
            <div className="guides-cta-content">
              <span className="badge badge-accent">
                <Sparkles size={14} style={{ marginRight: '6px' }} />
                Instant Generation
              </span>
              <h2>Ready to Put These Best Practices into Action?</h2>
              <p>
                Create clean, professional, PDF quotations formatted for Sri Lankan LKR or international currencies in under 2 minutes. Free with no signup required.
              </p>
              <div className="guides-cta-features">
                <span><CheckCircle2 size={16} /> Instant A4 PDF Export</span>
                <span><CheckCircle2 size={16} /> LKR & 12+ Currencies</span>
                <span><CheckCircle2 size={16} /> Accurate Line-Item Taxes</span>
              </div>
            </div>
            <div className="guides-cta-action">
              <Link to="/create" className="btn btn-primary btn-lg">
                Create Free Quotation Now <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
