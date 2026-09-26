import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Applied AI/ML engineer in the Bay Area — background, experience, and how to get in touch.",
  alternates: { canonical: "https://tabeen.dev/about" },
};

// About page is hand-written rather than MDX-driven — there's only one,
// and it deserves a custom layout. Edit this file directly to update.
//
// Structure: short bio → experience → education → now → resume download.

interface TimelineEntry {
  org: string;
  role: string;
  dates?: string;
  /** One line of concrete impact — from the résumé, not paraphrased up. */
  impact?: string;
}

const EXPERIENCE: TimelineEntry[] = [
  {
    org: "Xylo AI Studios",
    role: "Forward Deployed / Backend Engineer Intern",
    dates: "Jun 2026 — present",
    impact:
      "Own the ingestion and data-extraction services for a communications platform serving financial-advisory firms; built the coverage monitoring that surfaced a live production outage.",
  },
  {
    org: "FiPet",
    role: "Software Engineer Intern",
    dates: "Feb 2026 — Jun 2026",
    impact:
      "Built and deployed production features in TypeScript, extending native application capabilities, with end-to-end validation before every pull request.",
  },
  {
    org: "Yardi Systems",
    role: "Technical Account Manager",
    dates: "Jul 2022 — Aug 2025",
    impact:
      "Owned end-to-end delivery for roughly 20 enterprise real estate clients — discovery, solution design, configuration, data conversion and go-live.",
  },
  {
    org: "Aviso Wealth",
    role: "New Account Administrator",
    dates: "Dec 2020 — Jul 2022",
    impact:
      "Maintained account indexing pipelines and audited electronic fund transfer pathways in a regulated environment.",
  },
  {
    org: "United Nations (UNHCR & UNDP)",
    role: "Field Associate / Project Officer",
    dates: "Jun 2014 — Jan 2019",
    impact:
      "Led up to three concurrent humanitarian cash-for-work infrastructure projects for over 3,000 workers; built a cloud-based reporting system that replaced siloed spreadsheets across agency offices.",
  },
];

const EDUCATION: TimelineEntry[] = [
  {
    org: "San Francisco Bay University",
    role: "MS Computer Science (AI/ML)",
    dates: "Aug 2025 — Dec 2026",
    impact:
      "GPA 3.63. Research in image authenticity (TruPhoto) and VLM evaluation on edge hardware; ProofShape capstone.",
  },
  {
    org: "University Canada West",
    role: "MBA, Strategic Management & Marketing",
    dates: "Jan 2019 — Jul 2020",
  },
  {
    org: "American University of Iraq, Sulaimani",
    role: "B.B.A., Minor in Economics",
  },
];

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="flex flex-col gap-6">
      {entries.map((e) => (
        <div key={e.org}>
          <div className="flex justify-between items-baseline gap-4">
            <p className="text-sm text-ink font-medium">{e.org}</p>
            {e.dates && (
              <span className="text-xs text-muted whitespace-nowrap">{e.dates}</span>
            )}
          </div>
          <p className="text-xs text-muted">{e.role}</p>
          {e.impact && (
            <p className="text-sm text-muted leading-relaxed mt-1.5">{e.impact}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8">
      <section className="py-14">
        <h1 className="text-3xl sm:text-4xl text-ink mb-6">About</h1>

        <div className="prose">
          <p>
            I&apos;m Tabeen Raoof, a Bay Area-based applied AI/ML engineer.
            I&apos;m pursuing an MS in Computer Science at SFBU (concentration
            in AI/ML), graduating December 2026, with a background spanning
            computer-vision research, backend services, and three years of
            enterprise delivery before that.
          </p>

          <p>
            My path to engineering wasn&apos;t straight. I started in
            international project management at the United Nations, running
            humanitarian infrastructure programmes, then moved into Technical
            Account Management at Yardi Systems in PropTech before going back
            to school. That mix shows up in how I work: I care about technical
            depth, but I also think hard about who the user is and what
            problem the system actually solves.
          </p>

          <p>
            Outside of school and work, I read about value investing, follow
            geopolitics, and spend time with my wife and two children.
          </p>
        </div>
      </section>

      <section className="pb-12 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink mb-6">Experience</h2>
        <Timeline entries={EXPERIENCE} />
      </section>

      <section className="pb-12 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink mb-6">Education</h2>
        <Timeline entries={EDUCATION} />
      </section>

      <section className="pb-12 border-t border-line pt-10">
        <p className="text-sm text-muted leading-relaxed">
          <span className="text-ink font-medium">Now — </span>
          Backend engineering at Xylo AI Studios, the ProofShape capstone, and
          two preprints in preparation (TruPhoto and a VLM evaluation study).
          Available from the first week of January 2027.{" "}
          <span className="text-xs text-muted">(Last updated Sep 2026)</span>
        </p>
      </section>

      <section className="pb-16 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink mb-3.5">Resume</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          For the full version with dates, accomplishments, and references, see
          the PDF.
        </p>
        <a
          href="/resume.pdf"
          download="Tabeen_Raoof_Resume.pdf"
          className="inline-flex items-center gap-1.5 text-sm text-ink px-4 py-3 border border-ink rounded-md hover:bg-surface transition-colors"
        >
          Download resume (PDF)
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
