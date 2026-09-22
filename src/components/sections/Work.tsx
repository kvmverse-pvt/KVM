"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useIsMobile } from "@/hooks/useMedia";
import { WorkExhibition } from "@/components/sections/work/WorkExhibition";
import { WorkMobileStack } from "@/components/sections/work/WorkMobileStack";

export function Work() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  // The static stack is the SSR/no-JS output; only upgrade once mounted so the
  // first client render matches the server.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const showExhibition = mounted && !isMobile && !reduced;

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
        {showExhibition ? null : (
          <WorkMobileStack animated={mounted && !reduced && isMobile} />
        )}
      </div>

      {showExhibition ? <WorkExhibition /> : null}
    </section>
  );
}
