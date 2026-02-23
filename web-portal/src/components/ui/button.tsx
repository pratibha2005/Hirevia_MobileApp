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
                    "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius)] text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
                    {
                        "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:shadow-md hover:opacity-90": variant === "default",
                        "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm hover:shadow-md hover:brightness-110": variant === "accent",
                        "border border-[var(--border)] bg-white text-[var(--foreground)] shadow-sm hover:bg-[var(--muted)] hover:border-gray-300": variant === "outline",
                        "hover:bg-[var(--muted)] hover:text-[var(--foreground)] text-[var(--muted-foreground)]": variant === "ghost",
                        "h-10 px-4 py-2": size === "default",
                        "h-9 px-3 text-xs": size === "sm",
                        "h-12 px-8 text-base": size === "lg",
                        "h-10 w-10": size === "icon",
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
