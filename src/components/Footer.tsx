// Footer is a server component — no interactivity needed.
// Year is computed at build time, which is fine for a static site
// (rebuild on Jan 1 if you want to be precise about it).

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-muted">
        <span>© {year} Tabeen Raoof</span>
        <div className="flex gap-4">
          {/* relative + before:-inset gives each link a ~44px invisible tap
              target (WCAG 2.5.5) without changing the visible text or the
              16px gap between links; x-inset is kept under half the gap so
              neighboring hit areas never overlap. */}
          <a
            href="https://github.com/tabeenraoof"
            target="_blank"
            rel="noopener noreferrer"
            className="relative before:absolute before:-inset-y-3 before:-inset-x-1.5 before:content-[''] hover:text-ink transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/tabeenraoof"
            target="_blank"
            rel="noopener noreferrer"
            className="relative before:absolute before:-inset-y-3 before:-inset-x-1.5 before:content-[''] hover:text-ink transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:raoof.tabeen@gmail.com"
            className="relative before:absolute before:-inset-y-3 before:-inset-x-1.5 before:content-[''] hover:text-ink transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
