"use client";

import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  fullWidth = true,
  id,
  className = "",
  disabled,
  required,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? "w-full" : ""}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative flex items-center">
        {/* Left icon */}
        {leftIcon && (
          <span
            className="absolute left-3 flex items-center text-gray-400 pointer-events-none"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            [hasError ? errorId : null, hint ? hintId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={[
            "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900",
            "placeholder:text-gray-400",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            leftIcon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
            hasError
              ? "border-red-400 focus:border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
            disabled
              ? "bg-gray-50 text-gray-400 cursor-not-allowed opacity-70"
              : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {/* Right icon */}
        {rightIcon && (
          <span
            className="absolute right-3 flex items-center text-gray-400 pointer-events-none"
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p id={errorId} role="alert" className="flex items-center gap-1 text-xs text-red-600 mt-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}

      {/* Hint text */}
      {!hasError && hint && (
        <p id={hintId} className="text-xs text-gray-500 mt-0.5">
          {hint}
        </p>
      )}
    </div>
  );
}
