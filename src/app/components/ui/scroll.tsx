import * as React from "react"
import { cn } from "@/lib/utils"

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-auto [color-scheme:dark]",
          "[scrollbar-width:thin]",
          "[scrollbar-color:theme(colors.zinc.700)_transparent]",
          "[&::-webkit-scrollbar]:w-1.5",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:bg-zinc-700",
          "hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
