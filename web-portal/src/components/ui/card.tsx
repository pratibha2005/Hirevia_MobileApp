import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "subtle-glass rounded-xl",
                    className
                )}
                {...props}
            />
        )
    }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "px-6 py-4 border-b border-[var(--border)]",
                    className
                )}
                {...props}
            />
        )
    }
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn(
                    "text-lg font-semibold text-[var(--foreground)]",
                    className
                )}
                {...props}
            />
        )
    }
)
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("p-6", className)}
                {...props}
            />
        )
    }
)
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
