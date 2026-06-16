import type { TheorySection } from "@/lib/course/types";

export function TheoryReader({ sections }: { sections: TheorySection[] }) {
  return (
    <article className="space-y-8">
      {sections.map((section, i) => (
        <section key={i} className="border-b border-border pb-8 last:border-0">
          <h2 className="font-h text-lg font-bold uppercase tracking-wide text-charcoal">
            {section.title}
          </h2>
          <p className="font-body mt-3 text-sm leading-relaxed text-[#5a5a52]">{section.body}</p>
          {section.bullets && section.bullets.length > 0 && (
            <ul className="mt-4 space-y-2">
              {section.bullets.map((item, j) => (
                <li key={j} className="flex gap-2 font-body text-sm text-[#5a5a52]">
                  <span className="text-sage">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}
