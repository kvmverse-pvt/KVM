import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#F4F1EB",
          50: "#EBE6DD",
          100: "#FFFCFA",
          200: "#DDD6CB",
          300: "#C9C1B4",
        },
        chalk: {
          DEFAULT: "#1A1714",
          muted: "#5A554E",
          dim: "#8A847B",
        },
        coral: {
          DEFAULT: "#E44532",
          soft: "#F06251",
          deep: "#C43524",
          glow: "rgba(228, 69, 50, 0.28)",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.75rem, 8vw, 6.5rem)",
          { lineHeight: "0.92", letterSpacing: "-0.04em", fontWeight: "700" },
        ],
        "display-lg": [
          "clamp(2.25rem, 5vw, 4rem)",
          { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "700" },
        ],
        "display-md": [
          "clamp(1.75rem, 3.5vw, 2.75rem)",
          { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
      },
      maxWidth: {
        site: "100rem",
      },
      boxShadow: {
        glow: "0 18px 50px -20px rgba(228, 69, 50, 0.45)",
        card: "0 18px 40px -24px rgba(26, 23, 20, 0.16)",
      },
      backgroundImage: {
        "mesh-hero":
          "radial-gradient(ellipse 80% 60% at 72% 18%, rgba(228,69,50,0.14), transparent 55%), radial-gradient(ellipse 50% 40% at 12% 82%, rgba(201,193,180,0.35), transparent 50%)",
        "mesh-soft":
          "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(228,69,50,0.08), transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
