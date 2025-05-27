"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg" | "xl"
  opacity?: "low" | "medium" | "high"
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, blur = "md", opacity = "medium", ...props }, ref) => {
    const blurClasses = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
    }

    const opacityClasses = {
      low: "bg-background/30 border-white/10",
      medium: "bg-background/50 border-white/20",
      high: "bg-background/70 border-white/30",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border shadow-lg",
          blurClasses[blur],
          opacityClasses[opacity],
          "transition-all duration-300 hover:shadow-xl hover:border-white/40",
          className,
        )}
        {...props}
      />
    )
  },
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
