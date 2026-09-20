"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AppWindow, Smartphone, Layers } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const ICONS = {
  web: AppWindow,
  mobile: Smartphone,
  software: Layers,
} as const;

export function Services() {
  const reduced = useReducedMotion();

  return (
    <section
      id="services"
      className="relative border-t border-ink-200 bg-ink-50 py-28 md:py-36"
    >
      <div className="site-wrap">
        <SectionHeading
          eyebrow="Services"
          title="Three lanes. Zero fluff."
          description="Pick a lane or run the whole stack with us — from first sketch to shipped product."
        />

        <ul className="mt-16 grid gap-6 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = ICONS[service.id];
            return (
              <motion.li
                key={service.id}
                initial={reduced ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative overflow-hidden rounded-2xl border border-ink-200 bg-ink-100 p-7 shadow-card transition-colors duration-300 hover:border-coral/40"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-coral/0 blur-2xl transition-all duration-500 group-hover:bg-coral/10"
                  aria-hidden
                />
                <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200 bg-ink-50 text-coral transition-transform duration-300 group-hover:scale-110 group-hover:border-coral/40">
                  <Icon size={22} aria-hidden />
                </div>
                <h3 className="font-display text-2xl tracking-tight text-chalk">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-chalk-muted sm:text-base">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-2 border-t border-ink-200 pt-6">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className={cn(
                        "flex items-start gap-2 text-sm text-chalk-muted",
                      )}
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
