export const SITE = {
  name: "KVMverse Code Studio",
  shortName: "KVMverse",
  tagline: "We build the internet's next favorite thing.",
  url: "https://kvmverse.dev",
  email: "hello@kvmverse.dev",
  description:
    "KVMverse Code Studio designs and ships custom websites, mobile apps, and software products for founders who care how things feel.",
} as const;

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#work", label: "Work" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
] as const;

/** Headline options explored for the hero - primary is index 0 */
export const HERO_HEADLINES = [
  "We build the internet's next favorite thing",
  "Code that doesn't feel like code",
  "Ship software people actually want to open",
  "Products with taste. Code with teeth.",
] as const;

export const SERVICES = [
  {
    id: "web",
    title: "Web Development",
    description:
      "Custom sites and web apps that load fast, look sharp, and don't fall apart when real users show up.",
    includes: [
      "Marketing sites & product webs",
      "Dashboards & SaaS fronts",
      "Performance & accessibility",
    ],
  },
  {
    id: "mobile",
    title: "Mobile App Development",
    description:
      "iOS and Android apps with native-feel polish - built to be used every day, not demoed once.",
    includes: [
      "Cross-platform & native builds",
      "App Store-ready delivery",
      "Offline-first patterns",
    ],
  },
  {
    id: "software",
    title: "Software Design & Development",
    description:
      "End-to-end product work: from messy idea to shipped software, design and engineering in one room.",
    includes: [
      "Product design & UX",
      "Custom backends & APIs",
      "MVP to scale roadmaps",
    ],
  },
] as const;

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discover",
    body: "We dig into the problem, the users, and the constraints - no fake workshops, just clarity.",
  },
  {
    step: "02",
    title: "Design",
    body: "Flows, systems, and interfaces that feel inevitable. Prototype early. Kill weak ideas fast.",
  },
  {
    step: "03",
    title: "Build",
    body: "Clean architecture, typed code, real shipping cadence. You see progress weekly, not quarterly.",
  },
  {
    step: "04",
    title: "Ship",
    body: "Launch, measure, iterate. We don't ghost after deploy - we make sure it sticks.",
  },
] as const;

export const PROJECTS = [
  {
    title: "Northline",
    category: "Fintech web app",
    year: "2025",
    gradient:
      "linear-gradient(135deg, rgb(26, 20, 32) 0%, rgb(42, 24, 48) 45%, rgb(255, 79, 58) 100%)",
  },
  {
    title: "Pulseboard",
    category: "Analytics dashboard",
    year: "2025",
    gradient:
      "linear-gradient(135deg, rgb(14, 26, 28) 0%, rgb(20, 50, 56) 45%, rgb(61, 139, 139) 100%)",
  },
  {
    title: "Harbor",
    category: "Consumer mobile",
    year: "2024",
    gradient:
      "linear-gradient(135deg, rgb(28, 20, 14) 0%, rgb(58, 36, 24) 45%, rgb(196, 92, 42) 100%)",
  },
  {
    title: "Ledger Kit",
    category: "Design system",
    year: "2024",
    gradient:
      "linear-gradient(135deg, rgb(18, 18, 24) 0%, rgb(30, 30, 40) 45%, rgb(107, 92, 255) 100%)",
  },
] as const;

export const TEAM = [
  {
    name: "Mohammad Muzafar",
    role: "Software Engineer",
    tagline: "Ships systems that stay calm under pressure.",
    initials: "MM",
  },
  {
    name: "Kalkiram Saravanan",
    role: "Software Engineer",
    tagline: "Turns ambiguous specs into solid product.",
    initials: "KS",
  },
  {
    name: "Vignesh Sabari",
    role: "Designer",
    tagline: "Obsesses over how it feels in the hand.",
    initials: "VS",
  },
] as const;

export const PROJECT_TYPES = [
  "Web development",
  "Mobile app",
  "Full product build",
  "Design system",
  "Something else",
] as const;

export const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
] as const;
