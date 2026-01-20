"use client";
import * as React from "react";
import styles from "./loader.module.css";

/**
 * @param {Object} props
 * @param {number | string} [props.size=16] - Sets width/height via font-size (the CSS uses em units).
 * @param {string} [props.label="Loading"] - Optional label for screen readers.
 * @param {string} [props.className] - Extra className hook for layout.
 */
export default function Loader({
  size = 16,
  label = "Loading",
  className,
}) {
  const fontSize =
    typeof size === "number" ? `${size}px` : size;

  return (
    <span
      className={[styles.loader, className].filter(Boolean).join(" ")}
      style={{ fontSize }}
      role="status"
      aria-live="polite"
      aria-label={label}
    />
  );
}
