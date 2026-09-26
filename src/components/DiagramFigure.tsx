import Image from "next/image";
import type { ContentMeta } from "@/lib/content";

// Architecture/pipeline diagram for Work and Research pages.
//
// Diagrams are usually wider than the ~640px reading column, which would
// shrink their text below legibility, so the figure uses the same breakout
// width as demo embeds on large screens, and the whole image links to the
// full-resolution file for phones. The link's accessible name is the
// image's alt text, which should describe the diagram, not just name it.

type Diagram = NonNullable<ContentMeta["diagram"]>;

export function DiagramFigure({ diagram }: { diagram: Diagram }) {
  return (
    <section className="pb-8">
      <h2 className="font-serif text-2xl text-ink mb-4">Architecture</h2>
      <figure className="lg:mx-[-7rem] xl:mx-[-12rem]">
        <a
          href={diagram.src}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-surface border border-line rounded-md p-4 hover:border-accent transition-colors"
        >
          <Image
            src={diagram.src}
            alt={diagram.alt}
            width={diagram.width}
            height={diagram.height}
            className="w-full h-auto"
          />
        </a>
        <figcaption className="text-xs text-muted mt-2 leading-relaxed">
          {diagram.caption ? `${diagram.caption} ` : ""}Select the diagram to open it at full
          size.
        </figcaption>
      </figure>
    </section>
  );
}
