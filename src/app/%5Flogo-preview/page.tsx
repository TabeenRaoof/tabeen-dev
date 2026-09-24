import { Logo, LogoAlt } from "@/components/Logo";
import type { Metadata } from "next";

// Internal comparison page — not linked from nav, excluded from the
// sitemap (src/app/sitemap.ts) and disallowed in robots.ts. Exists purely
// so a human can compare the current 3x3-grid mark against the proposed
// LogoAlt (a single row of tapering, unevenly-spaced dots) at real sizes,
// in both color schemes, before deciding whether to switch. This page
// does not decide that — see VISUAL-PASS.md.

export const metadata: Metadata = {
  title: "Logo comparison (internal)",
  robots: { index: false, follow: false },
};

const SIZES = [16, 32, 64] as const;

function Swatch({
  label,
  bg,
  fg,
  isLight,
}: {
  label: string;
  bg: string;
  fg: string;
  isLight: boolean;
}) {
  return (
    <div style={{ background: bg, color: fg }} className="p-8 rounded-lg">
      <p className="text-xs mb-6 opacity-70" style={{ color: fg }}>
        {label}
      </p>

      <div className="flex flex-col gap-8">
        <div>
          <p className="text-xs mb-3 opacity-60">Current mark (3×3 grid)</p>
          <div className="flex items-end gap-6 flex-wrap">
            {SIZES.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Logo size={size} />
                <span className="text-2xs opacity-60">{size}px</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2.5">
                <Logo size={22} />
                <span
                  className="font-serif text-lg tracking-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  tabeen<span style={{ color: "#D9632E" }}>.</span>dev
                </span>
              </div>
              <span className="text-2xs opacity-60">header size (22px)</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs mb-3 opacity-60">
            Proposed alternative (tapering row)
          </p>
          <div className="flex items-end gap-6 flex-wrap">
            {SIZES.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <LogoAlt size={size} />
                <span className="text-2xs opacity-60">{size}px</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2.5">
                <LogoAlt size={22} />
                <span
                  className="font-serif text-lg tracking-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  tabeen<span style={{ color: "#D9632E" }}>.</span>dev
                </span>
              </div>
              <span className="text-2xs opacity-60">header size (22px)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LogoPreviewPage() {
  return (
    <div
      style={{ background: "#0E0C0B", minHeight: "100vh" }}
      className="px-6 py-12"
    >
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-2xl text-white mb-2">
            Logo comparison — internal, not indexed
          </h1>
          <p className="text-sm text-white/60 max-w-xl">
            Current 3×3 dot-grid mark vs. the proposed tapering-row
            alternative, at 16px, 32px, 64px, and header size. tabeen.dev has
            no light theme — the SVGs use the site&apos;s dark-theme fill
            tokens regardless of backdrop — so the second panel is a
            background swap to sanity-check the mark against a light context
            (e.g. a browser chrome or favicon tray), not a themed re-render.
            This page exists to let a human choose — it makes no
            recommendation and changes nothing on its own. See
            VISUAL-PASS.md, Task 5.
          </p>
        </div>

        <Swatch label="Dark (site default)" bg="#1A1614" fg="#F5F2E8" isLight={false} />
        <Swatch label="Light background (context check only — see note above)" bg="#F5F2E8" fg="#1A1614" isLight={true} />
      </div>
    </div>
  );
}
