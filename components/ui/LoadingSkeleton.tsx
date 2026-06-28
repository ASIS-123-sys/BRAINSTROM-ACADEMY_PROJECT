import React from "react";

interface LoadingSkeletonProps {
  /** The shape of the skeleton item. Defaults to 'rect'. */
  variant?: "rect" | "circle" | "text";
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export default function LoadingSkeleton({
  variant = "rect",
  width,
  height,
  className = "",
  count = 1,
}: LoadingSkeletonProps) {
  const shapeClass =
    variant === "circle"
      ? "rounded-full"
      : variant === "text"
      ? "rounded-sm h-4"
      : "rounded-lg";

  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, index) => (
        <div
          key={index}
          className={[
            "animate-pulse bg-gray-200",
            shapeClass,
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            width: width !== undefined ? width : undefined,
            height: height !== undefined ? height : undefined,
          }}
        />
      ))}
    </>
  );
}

/* ─── Composable Skeleton Layouts for Common UI Elements ─── */

/** A skeleton layout representing a Card component */
export function SkeletonCard() {
  return (
    <div className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <LoadingSkeleton variant="circle" width={40} height={40} />
        <div className="flex-1 flex flex-col gap-2">
          <LoadingSkeleton variant="text" width="60%" />
          <LoadingSkeleton variant="text" width="40%" />
        </div>
      </div>
      <LoadingSkeleton variant="rect" height={140} className="w-full" />
      <div className="flex flex-col gap-2">
        <LoadingSkeleton variant="text" width="100%" />
        <LoadingSkeleton variant="text" width="90%" />
        <LoadingSkeleton variant="text" width="75%" />
      </div>
    </div>
  );
}

/** A skeleton layout representing a list of table rows */
export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-white">
          <div className="flex items-center gap-3 w-2/3">
            <LoadingSkeleton variant="circle" width={32} height={32} />
            <div className="flex-1 flex flex-col gap-1.5">
              <LoadingSkeleton variant="text" width="40%" />
              <LoadingSkeleton variant="text" width="20%" />
            </div>
          </div>
          <LoadingSkeleton variant="rect" width={80} height={28} className="rounded-full" />
        </div>
      ))}
    </div>
  );
}
