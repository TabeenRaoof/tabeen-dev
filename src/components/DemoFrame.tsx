"use client";

import { useEffect, useRef, useState } from "react";

// Wraps a demo iframe with a fullscreen toggle.
//
// requestFullscreen is called on the wrapping <div>, not the <iframe>
// itself — that's deliberate. Calling it on the div works for any embedded
// site regardless of whether that site's own script requests fullscreen
// (which would need an `allow="fullscreen"` permission delegation and
// cooperation from the embedded page), and it means the iframe just needs
// to grow to fill its now-fullscreen container via CSS.

interface DemoFrameProps {
  src: string;
  title: string;
  /** Tailwind height class for the normal (non-fullscreen) state, e.g. "h-[600px]" */
  heightClassName: string;
}

export function DemoFrame({ src, title, heightClassName }: DemoFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      const docWithWebkit = document as Document & { webkitFullscreenElement?: Element | null };
      const current = document.fullscreenElement ?? docWithWebkit.webkitFullscreenElement;
      setIsFullscreen(current === containerRef.current);
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      const docWithWebkit = document as Document & { webkitExitFullscreen?: () => void };
      const exit = docWithWebkit.exitFullscreen ?? docWithWebkit.webkitExitFullscreen;
      exit?.call(document);
    } else {
      // Safari (desktop and iOS) still needs the webkit-prefixed call.
      const elWithWebkit = el as HTMLDivElement & { webkitRequestFullscreen?: () => void };
      const request = elWithWebkit.requestFullscreen ?? elWithWebkit.webkitRequestFullscreen;
      request?.call(el);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-surface border border-line rounded-md overflow-hidden ${
        isFullscreen ? "h-screen" : ""
      }`}
    >
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
        title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
        className="absolute top-2.5 right-2.5 z-10 inline-flex items-center justify-center w-9 h-9 text-ink bg-bg/80 border border-line rounded-md hover:bg-bg hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 transition-colors"
      >
        {isFullscreen ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 3v3a2 2 0 0 1-2 2H3" />
            <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
            <path d="M3 16h3a2 2 0 0 1 2 2v3" />
            <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        )}
      </button>
      <iframe
        src={src}
        title={title}
        className={`w-full border-0 ${isFullscreen ? "h-full" : heightClassName}`}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
