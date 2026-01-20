"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const TimelineItem = React.forwardRef(
  (
    {
      className,
      date,
      title,
      description,
      href,
      status = "completed",
      children,
      ...props
    },
    ref
  ) => {
    const content = (
      <div
        ref={ref}
        className={cn(
          "relative flex gap-4 pb-8 last:pb-0",
          "before:absolute before:left-[11px] before:top-6 before:bottom-0 before:w-0.5 before:bg-white/20 last:before:hidden",
          className
        )}
        {...props}
      >
        {/* Dot */}
        <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
          <div
            className={cn(
              "h-3 w-3 rounded-full border-2 transition-all duration-300",
              status === "completed" && "bg-white border-white",
              status === "in-progress" && "bg-white border-white ring-2 ring-white/50",
              status === "pending" && "bg-transparent border-white/40"
            )}
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          {date && (
            <div className="text-xs uppercase tracking-[0.2em] opacity-60">
              {typeof date === "string" ? date : date.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
          )}
          {title && (
            <div className="group">
              {href ? (
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white  text-black hover:bg-black hover:text-white transition text-sm md:text-base uppercase tracking-[0.2em] no-underline"
                  style={{ color: '#000' }}
                >
                  {title}
                </Link>
              ) : (
                <div className="text-sm md:text-base uppercase tracking-[0.2em]">
                  {title}
                </div>
              )}
            </div>
          )}
          {description && (
            <div className="text-xs opacity-70 leading-relaxed">
              {description}
            </div>
          )}
          {children}
        </div>
      </div>
    )

    return content
  }
)
TimelineItem.displayName = "TimelineItem"

export { TimelineItem }
