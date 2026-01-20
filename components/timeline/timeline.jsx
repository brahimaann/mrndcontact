"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Timeline = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative flex flex-col", className)}
      {...props}
    >
      {children}
    </div>
  )
})
Timeline.displayName = "Timeline"

export { Timeline }
