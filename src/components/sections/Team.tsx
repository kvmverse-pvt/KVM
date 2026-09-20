"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TEAM } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Team() {
  const reduced = useReducedMotion();

  return (
    <section
      id="team"
      className="relative border-t border-ink-200 bg-ink py-28 md:py-36"
    >
      <div className="site-wrap">
        <SectionHeading
          eyebrow="Team"
          title="Three people. One standard."
          description="Engineers and a designer who sit in the same problem space — not a relay race of handoffs."
        />

        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {TEAM.map((member, index) => (
            <motion.li
              key={member.name}
              initial={reduced ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: index * 0.1 }}
              className="group"
            >
              <article className="h-full rounded-2xl border border-ink-200 bg-ink-100 p-6 shadow-card transition-transform duration-500 hover:-translate-y-1.5">
                <div
                  className="relative mb-8 flex aspect-[4/5] items-end overflow-hidden rounded-xl bg-gradient-to-br from-ink-50 via-[#e4d8cf] to-[#d8c4bb]"
                  aria-hidden
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(228,69,50,0.22),transparent_55%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="relative z-10 p-5 font-display text-5xl tracking-tight text-chalk/90 transition-transform duration-500 group-hover:translate-y-[-4px] group-hover:scale-105">
                    {member.initials}
                  </span>
                </div>
                <h3 className="font-display text-xl tracking-tight text-chalk">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-coral">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-chalk-muted">
                  {member.tagline}
                </p>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
