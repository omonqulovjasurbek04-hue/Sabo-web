import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'product' | 'article';
  ogImage?: string;
  schemaData?: Record<string, any> | Array<Record<string, any>>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = '/image/logo.png',
  schemaData,
}) => {
  useEffect(() => {
    // 1. Document Title
    const baseTitle = 'SABO — Tabiiylik Sari Intilamiz | Premium Sut Mahsulotlari';
    document.title = title ? `${title} | SABO` : baseTitle;

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description || "SABO — Tabiiylik sari intilamiz. 100% tabiiy sut, qatiq, kefir, smetana, qaymoq va yogurt mahsulotlari.");

    // 3. OpenGraph Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title ? `${title} | SABO` : baseTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description || "Tabiatdan dasturxoningizgacha. 100% toza va tabiiy SABO sut mahsulotlari.");

    const ogTypeEl = document.querySelector('meta[property="og:type"]');
    if (ogTypeEl) ogTypeEl.setAttribute('content', ogType);

    // 4. Canonical Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    const currentUrl = canonicalUrl || window.location.href.split('?')[0];
    canonicalTag.setAttribute('href', currentUrl);

    // 5. JSON-LD Structured Data for Google E-commerce Rich Snippets
    let scriptTag = document.getElementById('sabo-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'sabo-schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    if (schemaData) {
      scriptTag.textContent = JSON.stringify(schemaData);
    } else {
      // Default Organization Schema (Strict Source of Truth)
      const defaultOrgSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'SABO',
        url: window.location.origin,
      };
      scriptTag.textContent = JSON.stringify(defaultOrgSchema);
    }
  }, [title, description, canonicalUrl, ogType, ogImage, schemaData]);

  return null;
};
