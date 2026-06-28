import React from "react";

type BadgeVariant = "success" | "danger" | "info" | "warning" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  // Green for paid/success
  success: "bg-green-50 text-green-700 border-green-200",
  // Red for due/danger
  danger: "bg-red-50 text-red-700 border-red-200",
  // Blue for active/info
  info: "bg-blue-50 text-blue-700 border-blue-200",
  // Orange/yellow for warning/pending
  warning: "bg-orange-50 text-orange-700 border-orange-200",
  // Default/neutral
  neutral: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        "transition-colors duration-150",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
