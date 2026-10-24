import { useEffect } from 'react';

export type StructuredData = Record<string, any>;

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  type?: 'website' | 'article';
  ogImage?: string;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  schema?: StructuredData | StructuredData[];
}

const DEFAULT_ORIGIN = 'https://quoteworkpro.com';

export function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  type,
  ogImage = '/favicon.svg',
  keywords,
  author,
  schema,
}: SEOProps) {
  const fullTitle = title.includes('QuoteWork Pro') ? title : `${title} | QuoteWork Pro`;
  const canonicalUrl = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${DEFAULT_ORIGIN}${canonical}`
    : typeof window !== 'undefined'
    ? window.location.href.split('?')[0]
    : DEFAULT_ORIGIN;

  useEffect(() => {
    // 1. Page Title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMetaTag = (attribute: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    if (keywords && keywords.length > 0) {
      setMetaTag('name', 'keywords', keywords.join(', '));
    }
    if (author) {
      setMetaTag('name', 'author', author);
    }

    // 3. Open Graph Tags
    const effectiveType = type || ogType;
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', effectiveType);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:site_name', 'QuoteWork Pro');
    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage.startsWith('http') ? ogImage : `${DEFAULT_ORIGIN}${ogImage}`);
    }

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);

    // 5. Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalUrl;

    // 6. JSON-LD Structured Data
    const SCRIPT_ID = 'seo-structured-data';
    let scriptElement = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (schema) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = SCRIPT_ID;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(schema);
    } else if (scriptElement) {
      scriptElement.remove();
    }

    return () => {
      // Clean up dynamic structured data script on unmount
      const existing = document.getElementById(SCRIPT_ID);
      if (existing) existing.remove();
    };
  }, [fullTitle, description, canonicalUrl, ogType, ogImage, schema]);

  return null;
}
