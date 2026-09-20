"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PROJECT_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

type FormState = {
  name: string;
  email: string;
  projectType: string;
  message: string;
};

const initial: FormState = {
  name: "",
  email: "",
  projectType: PROJECT_TYPES[0],
  message: "",
};

const fieldClass = cn(
  "w-full rounded-xl border border-ink-200 bg-ink px-4 py-3 text-chalk",
  "placeholder:text-chalk-dim outline-none transition-[border-color,box-shadow] duration-200",
  "focus-visible:border-coral/70 focus-visible:ring-2 focus-visible:ring-coral/30",
);

export function Contact() {
  const reduced = useReducedMotion();
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sent");
    setForm(initial);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-ink-200 bg-ink-50 py-28 md:py-36"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-mesh-soft"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-coral/10 blur-3xl"
        aria-hidden
      />

      <div className="site-wrap relative grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Start a project"
            title="Got something weird, ambitious, or overdue?"
            description="Tell us what you're building. We'll tell you straight if we're the right fit — and how we'd ship it."
          />
          <p className="mt-8 text-sm text-chalk-dim">
            Prefer email?{" "}
            <a
              href="mailto:hello@kvmverse.dev"
              className="rounded-sm text-chalk underline decoration-coral/50 underline-offset-4 transition-colors hover:text-coral focus-ring"
            >
              hello@kvmverse.dev
            </a>
          </p>
        </div>

        <motion.form
          onSubmit={onSubmit}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-ink-200 bg-ink-100 p-6 shadow-card sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" htmlFor="name">
              <input
                id="name"
                name="name"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={fieldClass}
                placeholder="Alex Founder"
              />
            </Field>
            <Field label="Email" htmlFor="email">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={fieldClass}
                placeholder="you@startup.com"
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Project type" htmlFor="projectType">
              <select
                id="projectType"
                name="projectType"
                required
                value={form.projectType}
                onChange={(e) =>
                  setForm({ ...form, projectType: e.target.value })
                }
                className={cn(fieldClass, "appearance-none")}
              >
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-ink-100 text-chalk">
                    {type}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Message" htmlFor="message">
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={cn(fieldClass, "resize-y")}
                placeholder="What are you building, and when do you want it live?"
              />
            </Field>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Button type="submit">Send message</Button>
            {status === "sent" ? (
              <p role="status" className="text-sm text-coral">
                Got it — we&apos;ll be in touch soon.
              </p>
            ) : null}
          </div>
        </motion.form>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-chalk-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
