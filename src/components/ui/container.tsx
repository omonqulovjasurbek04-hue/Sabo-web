import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "footer" | "header";
}

export function Container({ as = "div", className, ...props }: ContainerProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] px-6 max-sm:px-4",
        className
      )}
      {...props}
    />
  );
}