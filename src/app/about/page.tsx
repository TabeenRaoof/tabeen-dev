import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Background, experience, and how to get in touch.",
};

// About page is hand-written rather than MDX-driven — there's only one,
// and it deserves a custom layout. Edit this file directly to update.
//
// Structure: short bio → experience timeline → resume download.

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8">
      <section className="py-14">
        <h1 className="text-3xl sm:text-4xl text-ink mb-6">About</h1>

        <div className="prose">
          <p>
            I&apos;m Tabeen Raoof, a Bay Area-based engineer working at the
            intersection of machine learning and product. I&apos;m currently
            pursuing an MS in Computer Science at SFBU (concentration in AI/ML)
            and building at FiPet, a gamified financial education app.
          </p>

          <p>
            My path to engineering wasn&apos;t straight. I started in
            international project management at the United Nations, then moved
            into Technical Account Management at Yardi Systems in PropTech
            before going back to school. That mix shows up in how I work: I
            care about technical depth, but I also think hard about who the
            user is and what business problem the system actually solves.
          </p>

          <p>
            Outside of school and work, I read about value investing, follow
            geopolitics, and spend time with my partner and our young child.
          </p>
        </div>
      </section>

      <section className="pb-12 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink mb-6">Experience</h2>
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-baseline gap-4">
            <div className="flex-1">
              <p className="text-sm text-ink font-medium">FiPet</p>
              <p className="text-xs text-muted">Software Engineering Intern</p>
            </div>
            <span className="text-xs text-muted whitespace-nowrap">2026 — present</span>
          </div>
          <div className="flex justify-between items-baseline gap-4">
            <div className="flex-1">
              <p className="text-sm text-ink font-medium">SFBU</p>
              <p className="text-xs text-muted">MS Computer Science (AI/ML)</p>
            </div>
            <span className="text-xs text-muted whitespace-nowrap">2025 — present</span>
          </div>
          <div className="flex justify-between items-baseline gap-4">
            <div className="flex-1">
              <p className="text-sm text-ink font-medium">Yardi Systems</p>
              <p className="text-xs text-muted">Technical Account Manager</p>
            </div>
            <span className="text-xs text-muted whitespace-nowrap">— 2025</span>
          </div>
          <div className="flex justify-between items-baseline gap-4">
            <div className="flex-1">
              <p className="text-sm text-ink font-medium">United Nations</p>
              <p className="text-xs text-muted">Project Manager (international)</p>
            </div>
            <span className="text-xs text-muted whitespace-nowrap">earlier</span>
          </div>
        </div>
      </section>

      <section className="pb-16 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink mb-3.5">Resume</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          For the full version with dates, accomplishments, and references, see
          the PDF.
        </p>
        <a
          href="/resume.pdf"
          download
          className="inline-flex items-center gap-1.5 text-sm text-ink px-4 py-2 border border-ink rounded-md hover:bg-surface transition-colors"
        >
          Download resume (PDF)
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>
        <p className="text-xs text-muted mt-3">
          Or get in touch:{" "}
          <Link href="/contact" className="text-accent hover:underline">
            contact
          </Link>
        </p>
      </section>
    </div>
  );
}
