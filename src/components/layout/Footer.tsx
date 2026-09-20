import { NAV_LINKS, SITE, SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-200 bg-ink pb-10 pt-16">
      <div className="site-wrap grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <a
            href="#top"
            className="font-display text-2xl font-semibold tracking-tight text-chalk focus-ring rounded-sm"
          >
            {SITE.shortName}
            <span className="text-coral">.</span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-chalk-muted">
            {SITE.tagline}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-chalk-dim">
            Navigate
          </p>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-chalk-muted transition-colors hover:text-chalk focus-ring rounded-sm"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-chalk-dim">
            Social
          </p>
          <ul className="mt-4 space-y-2">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-chalk-muted transition-colors hover:text-chalk focus-ring rounded-sm"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-wrap mt-14 flex flex-col gap-2 border-t border-ink-200 pt-6 text-xs text-chalk-dim md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {SITE.name}. All rights reserved.
        </p>
        <p>Built with intent — not templates.</p>
      </div>
    </footer>
  );
}
