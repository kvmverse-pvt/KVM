"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Work() {
  const reduced = useReducedMotion();

  return (
    <section
      id="work"
      className="relative border-t border-ink-200 bg-ink-50 py-28 md:py-36"
    >
      <div className="site-wrap">
        <SectionHeading
          eyebrow="Selected work"
          title="Things we've put into the world."
          description="Placeholders for now — real case studies coming. The vibe is already the standard."
        />

        <ul className="mt-16 grid gap-5 sm:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <motion.li
              key={project.title}
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <article className="group relative overflow-hidden rounded-2xl border border-ink-200 bg-ink-100 shadow-card">
                <div
                  className="relative aspect-[16/11] overflow-hidden"
                  style={{ backgroundImage: project.gradient }}
                >
                  <div
                    className="absolute inset-0 opacity-40 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 45%)",
                    }}
                    aria-hidden
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                    <span className="inline-flex items-center gap-2 text-sm text-white">
                      Case study soon
                      <ArrowUpRight size={16} aria-hidden />
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-4 p-5">
                  <div>
                    <h3 className="font-display text-xl tracking-tight text-chalk">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-chalk-muted">
                      {project.category}
                    </p>
                  </div>
                  <p className="text-sm text-chalk-dim">{project.year}</p>
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
