"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-ink-200 bg-ink/85 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav
        className="site-wrap flex items-center justify-between py-4"
        aria-label="Primary"
      >
        <a
          href="#top"
          className="font-display text-lg font-semibold tracking-tight text-chalk focus-ring rounded-sm"
        >
          {SITE.shortName}
          <span className="text-coral">.</span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-chalk-muted transition-colors duration-200 hover:text-chalk focus-ring rounded-sm"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <LinkButton href="#contact" variant="primary">
            Start a project
          </LinkButton>
        </div>

        <button
          type="button"
          className="focus-ring rounded-full p-2 text-chalk lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open ? (
        <motion.div
          id="mobile-nav"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-ink-200 bg-ink/95 px-5 py-6 backdrop-blur-xl lg:hidden"
        >
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-2 font-display text-2xl text-chalk"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <LinkButton
            href="#contact"
            className="mt-6 w-full"
            onClick={() => setOpen(false)}
          >
            Start a project
          </LinkButton>
        </motion.div>
      ) : null}
    </header>
  );
}
