import { ImageResponse } from "next/og";

// Auto-generated Open Graph image route.
//
// When you share a tabeen.dev URL on LinkedIn/Twitter/Slack, those platforms
// fetch the og:image meta tag from the page and display it in the preview.
// Without this, you'd get a generic favicon or no image at all.
//
// This route generates a PNG on-demand using the title and category passed
// as query params. Each project/post page references it like:
//   /api/og?title=Image+Authenticity+Classifier&category=ML
//
// The image is cached aggressively by Cloudflare's edge so it only
// generates once per unique URL.
//
// To override with a custom image, set `ogImage` in the post's frontmatter.

// Edge runtime is required for next/og's ImageResponse
export const runtime = "edge";

// Standard Open Graph dimensions — 1200x630 is the LinkedIn/Twitter spec
const SIZE = { width: 1200, height: 630 };

// Color tokens — kept in sync with globals.css.
// Hard-coded here because edge runtime can't read CSS variables.
const COLORS = {
  bg: "#1A1614",
  surface: "#2C2622",
  ink: "#F5F2E8",
  muted: "#8A8378",
  accent: "#D8602A",
  chartreuse: "#D4DC3F",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Truncate long titles so they fit in the layout
  const titleParam = searchParams.get("title") ?? "tabeen.dev";
  const title =
    titleParam.length > 80 ? titleParam.slice(0, 77) + "…" : titleParam;

  const category = searchParams.get("category") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: COLORS.bg,
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          fontFamily: "serif",
          color: COLORS.ink,
        }}
      >
        {/* Top bar — patterned mark + wordmark, mirroring site header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {/* Logo mark — same V1 scattered pattern, scaled up.
              Drawn directly with SVG via JSX since edge runtime
              supports SVG primitives in ImageResponse. */}
          <svg width={44} height={44} viewBox="0 0 22 22">
            <rect width="22" height="22" fill={COLORS.surface} rx="3" />
            <circle cx="5" cy="5" r="1.5" fill={COLORS.ink} />
            <circle cx="11" cy="4" r="1.2" fill={COLORS.chartreuse} />
            <circle cx="17" cy="6" r="1.3" fill={COLORS.ink} />
            <circle cx="6" cy="10" r="1.2" fill={COLORS.chartreuse} />
            <circle cx="11" cy="11" r="1.6" fill={COLORS.ink} />
            <circle cx="16" cy="11" r="1.2" fill={COLORS.chartreuse} />
            <circle cx="5" cy="16" r="1.3" fill={COLORS.ink} />
            <circle cx="11" cy="17" r="1.2" fill={COLORS.chartreuse} />
            <circle cx="17" cy="16" r="1.5" fill={COLORS.ink} />
          </svg>
          <div style={{ fontSize: 32, color: COLORS.ink, display: "flex" }}>
            tabeen<span style={{ color: COLORS.accent }}>.</span>dev
          </div>
        </div>

        {/* Spacer pushes title to vertical center */}
        <div style={{ flex: 1 }} />

        {/* Category label — only renders if provided */}
        {category && (
          <div
            style={{
              fontSize: 22,
              color: COLORS.accent,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 24,
              fontFamily: "sans-serif",
            }}
          >
            {category}
          </div>
        )}

        {/* Title — main visual element, large serif */}
        <div
          style={{
            fontSize: 72,
            lineHeight: 1.1,
            color: COLORS.ink,
            letterSpacing: "-0.02em",
            maxWidth: "1040px",
            display: "flex",
          }}
        >
          {title}
        </div>

        {/* Bottom accent bar — small orange line as visual signature */}
        <div
          style={{
            display: "flex",
            marginTop: 40,
            width: 60,
            height: 4,
            background: COLORS.accent,
          }}
        />
      </div>
    ),
    SIZE
  );
}
