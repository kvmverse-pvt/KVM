import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  asChild?: boolean;
};

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 focus-ring disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-coral text-white shadow-glow hover:bg-coral-soft hover:scale-[1.02] active:scale-[0.98]",
    ghost:
      "bg-transparent text-chalk hover:bg-ink-50 hover:text-chalk",
    outline:
      "border border-chalk/15 text-chalk hover:border-coral/50 hover:text-coral hover:bg-coral/5",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "ghost" | "outline";
};

export function LinkButton({
  className,
  variant = "primary",
  children,
  ...props
}: LinkButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 focus-ring";

  const variants = {
    primary:
      "bg-coral text-white shadow-glow hover:bg-coral-soft hover:scale-[1.02] active:scale-[0.98]",
    ghost:
      "bg-transparent text-chalk hover:bg-ink-50 hover:text-chalk",
    outline:
      "border border-chalk/15 text-chalk hover:border-coral/50 hover:text-coral hover:bg-coral/5",
  };

  return (
    <a className={cn(base, variants[variant], className)} {...props}>
      {children}
    </a>
  );
}
