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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Truncate long titles so they fit in the layout
  const titleParam = searchParams.get("title") ?? "tabeen.dev";
  const title = titleParam.length > 80
    ? titleParam.slice(0, 77) + "…"
    : titleParam;

  const category = searchParams.get("category") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0F2419", // Forest dark — matches site bg
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          fontFamily: "serif",
          color: "#F5F2E8", // Cream — matches site text
        }}
      >
        {/* Top bar — site brand */}
        <div
          style={{
            fontSize: 28,
            display: "flex",
            alignItems: "center",
            color: "#F5F2E8",
          }}
        >
          tabeen<span style={{ color: "#D8602A" }}>.</span>dev
        </div>

        {/* Spacer pushes title to vertical center */}
        <div style={{ flex: 1 }} />

        {/* Category label — only renders if provided */}
        {category && (
          <div
            style={{
              fontSize: 22,
              color: "#D8602A", // Orange accent
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
            color: "#F5F2E8",
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
            background: "#D8602A",
          }}
        />
      </div>
    ),
    SIZE
  );
}
