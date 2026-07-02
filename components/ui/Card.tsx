import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Optional click handler — renders the card as a hoverable interactive surface */
  onClick?: () => void;
  /** Render a top-edge accent bar in the brand colour */
  accent?: "blue" | "orange" | "none";
  /** Remove default padding */
  noPadding?: boolean;
}

export default function Card({
  children,
  className = "",
  onClick,
  accent = "none",
  noPadding = false,
}: CardProps) {
  const accentClasses: Record<string, string> = {
    blue: "border-t-4 border-t-blue-700",
    orange: "border-t-4 border-t-orange-500",
    none: "",
  };

  const baseClasses = [
    "bg-white rounded-xl shadow-md border border-gray-100 text-gray-900",
    accentClasses[accent],
    noPadding ? "" : "p-6",
    onClick
      ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        className={baseClasses}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick();
        }}
      >
        {children}
      </div>
    );
  }

  return <div className={baseClasses}>{children}</div>;
}

/* ─── Composable sub-components ─────────────────────────────────── */

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
          {title}
        </h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardDivider() {
  return <hr className="border-gray-100 my-4" />;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-4 pt-4 border-t border-gray-100 flex items-center gap-3 ${className}`}
    >
      {children}
    </div>
  );
}
