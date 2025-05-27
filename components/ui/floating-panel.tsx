"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export interface FloatingPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  position?: "left" | "right" | "top" | "bottom"
  size?: "sm" | "md" | "lg" | "xl"
}

const FloatingPanel = React.forwardRef<HTMLDivElement, FloatingPanelProps>(
  ({ className, isOpen = true, position = "right", size = "md", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-64",
      md: "w-80",
      lg: "w-96",
      xl: "w-[28rem]",
    }

    const positionClasses = {
      left: "left-0 top-0 h-full",
      right: "right-0 top-0 h-full",
      top: "top-0 left-0 w-full",
      bottom: "bottom-0 left-0 w-full",
    }

    const slideVariants = {
      left: {
        hidden: { x: "-100%", opacity: 0 },
        visible: { x: 0, opacity: 1 },
      },
      right: {
        hidden: { x: "100%", opacity: 0 },
        visible: { x: 0, opacity: 1 },
      },
      top: {
        hidden: { y: "-100%", opacity: 0 },
        visible: { y: 0, opacity: 1 },
      },
      bottom: {
        hidden: { y: "100%", opacity: 0 },
        visible: { y: 0, opacity: 1 },
      },
    }

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={ref}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={slideVariants[position]}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed z-50 bg-background/95 backdrop-blur-md border shadow-2xl",
              positionClasses[position],
              position === "left" || position === "right" ? sizeClasses[size] : "",
              className,
            )}
            {...props}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    )
  },
)
FloatingPanel.displayName = "FloatingPanel"

export { FloatingPanel }
