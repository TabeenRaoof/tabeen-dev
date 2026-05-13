import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — email, GitHub, LinkedIn.",
};

// Contact page is intentionally minimal — three direct links, no form.
// A form would mean either a backend (Cloudflare Worker + email API) or
// a third-party service. For v1 this is faster, more honest, and lets
// people use whatever channel they prefer.

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8">
      <section className="py-14">
        <h1 className="text-3xl sm:text-4xl text-ink mb-6">Contact</h1>
        <p className="text-sm text-muted leading-relaxed max-w-md mb-10">
          The fastest way to reach me is by email. I&apos;m also active on
          GitHub and LinkedIn.
        </p>

        <div className="flex flex-col gap-4">
          <a
            href="mailto:raoof.tabeen@gmail.com"
            className="flex items-center gap-3 text-ink py-4 border-b border-line hover:text-accent transition-colors group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-accent">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="text-base">raoof.tabeen@gmail.com</span>
          </a>

          <a
            href="https://github.com/tabeenraoof"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-ink py-4 border-b border-line hover:text-accent transition-colors group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted group-hover:text-accent">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="text-base">github.com/tabeenraoof</span>
          </a>

          <a
            href="https://www.linkedin.com/in/tabeenraoof"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-ink py-4 border-b border-line hover:text-accent transition-colors group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted group-hover:text-accent">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span className="text-base">linkedin.com/in/tabeenraoof</span>
          </a>
        </div>
      </section>
    </div>
  );
}
