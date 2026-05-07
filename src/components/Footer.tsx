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
          <a
            href="https://github.com/tabeen"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/tabeen"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:hello@tabeen.dev"
            className="hover:text-ink transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
