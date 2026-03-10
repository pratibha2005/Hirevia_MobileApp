import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "link" | "accent"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
                    {
                        "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:shadow-md hover:bg-opacity-90": variant === "default",
                        "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm hover:shadow-md hover:bg-opacity-90": variant === "accent",
                        "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] hover:border-[var(--primary)]/20": variant === "outline",
                        "hover:bg-[var(--muted)] hover:text-[var(--foreground)] text-[var(--muted-foreground)]": variant === "ghost",
                        "h-9 px-4 py-2": size === "default",
                        "h-8 px-3 text-xs": size === "sm",
                        "h-11 px-6 text-base": size === "lg",
                        "h-9 w-9 p-0": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
