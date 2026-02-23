import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] font-medium transition-all duration-200",
                    "placeholder:text-[var(--muted-foreground)]/60 placeholder:font-normal",
                    "focus:outline-none focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--primary)]/10",
                    "disabled:cursor-not-allowed disabled:bg-[var(--muted)] disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
