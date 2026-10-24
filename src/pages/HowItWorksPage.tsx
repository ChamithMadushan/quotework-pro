import { Link } from 'react-router-dom';
import { SEO, StructuredData } from '../components/SEO';

const steps = [
  {
    num: 1,
    title: 'Enter your business details',
    desc: 'Add your business name, address, contact info, and upload your logo. This appears on every quotation you create.',
  },
  {
    num: 2,
    title: 'Fill in the customer information',
    desc: 'Add the customer or company name, contact details, and address. At least a name or company is required.',
  },
  {
    num: 3,
    title: 'Add your line items',
    desc: 'List each product or service with a description, quantity, and unit price. Add per-item discounts in percentage or fixed amount.',
  },
  {
    num: 4,
    title: 'Configure tax and discounts',
    desc: 'Enable tax (e.g. VAT) with a custom rate if applicable. Add a document-level discount as a percentage or fixed amount.',
  },
  {
    num: 5,
    title: 'Add payment terms and notes',
    desc: 'Specify payment terms, delivery information, and any additional notes or terms and conditions for the customer.',
  },
  {
    num: 6,
    title: 'Preview, print, or download',
    desc: 'Check the live preview on the right side of the form. Click Download PDF to save a professional file, or Print to print directly.',
  },
];

const faqs = [
  {
    q: 'Is QuoteWork Pro completely free?',
    a: 'Yes. Creating quotations, downloading PDFs, and saving drafts are all free. There are no hidden fees or premium tiers.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. You can create and download quotations without signing up. Drafts are saved locally in your browser.',
  },
  {
    q: 'Where is my data stored?',
    a: 'All data stays on your device in your browser\'s localStorage. Nothing is sent to any server. Clearing your browser data will erase saved drafts.',
  },
  {
    q: 'Can I use QuoteWork Pro for tax invoices?',
    a: 'No. QuoteWork Pro produces quotations, not tax invoices or official receipts. Every quotation includes a disclaimer stating this. Consult a qualified accountant for tax invoicing requirements.',
  },
  {
    q: 'Which currencies are supported?',
    a: 'LKR (Sri Lankan Rupee), USD, EUR, GBP, INR, AED, SGD, and AUD. More currencies can be added on request.',
  },
  {
    q: 'Can I edit a downloaded PDF?',
    a: 'The PDF is a rendered snapshot of your quotation. To make changes, edit the form in QuoteWork Pro and download a new PDF.',
  },
  {
    q: 'What happens to my drafts if I close the browser?',
    a: 'Drafts are saved in localStorage and will still be there when you reopen the browser — unless you clear your browsing data or use incognito mode.',
  },
  {
    q: 'Can I use QuoteWork Pro on my phone?',
    a: 'Yes. The interface is fully responsive. On mobile you can switch between the form and preview tabs, and download a PDF directly.',
  },
];

export function HowItWorksPage() {
  const faqSchema: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(f => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.a
      }
    }))
  };

  return (
    <section className="page">
      <SEO 
        title="How It Works | Free Online Quotation Creator"
        description="Learn how to generate professional quotations in 6 easy steps with QuoteWork Pro. Add items, compute LKR or foreign currency totals, configure taxes, and download PDF."
        canonical="/how-it-works"
        schema={[faqSchema]}
      />
      <div className="container">
        {/* Hero */}
        <div className="hiw-hero" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-label">How it works</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', margin: '0 0 14px' }}>
            From blank form to PDF in six steps
          </h1>
          <p className="section-lead">
            No account. No software. Just open the tool, fill in the details, and your professional quotation is ready.
          </p>
          <Link className="btn btn-accent btn-lg" to="/create">
            ✦ Start creating now
          </Link>
        </div>

        {/* Steps */}
        <div className="hiw-steps" style={{ marginBottom: 56 }}>
          {steps.map((step) => (
            <div className="hiw-step" key={step.num}>
              <div className="hiw-step-num">{step.num}</div>
              <div className="hiw-step-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="section-label">FAQ</div>
          <h2>Frequently asked questions</h2>
        </div>
        <div className="faq-grid">
          {faqs.map(({ q, a }) => (
            <details key={q}>
              <summary>{q}</summary>
              <div className="faq-body">{a}</div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <Link className="btn btn-primary btn-lg" to="/create">
            Create your first quotation →
          </Link>
        </div>
      </div>
    </section>
  );
}
