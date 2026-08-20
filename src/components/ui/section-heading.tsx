import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as = "h2",
  className,
}: SectionHeadingProps) {
  const Tag = as;
  return (
    <div
      className={cn(
        "flex flex-col gap-3 mb-10",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-secondary">
          {eyebrow}
        </span>
      ) : null}
      <Tag className="font-display font-bold text-foreground">{title}</Tag>
      {subtitle ? (
        <p className="max-w-xl text-muted text-base sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}