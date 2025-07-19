import type React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "success" | "warning" | "error"
  size?: "sm" | "md" | "lg"
  className?: string
}

const Badge: React.FC<BadgeProps> = ({ children, variant = "primary", size = "md", className }) => {
  const baseClasses = "badge"

  const variantClasses = {
    primary: "badge-primary",
    secondary: "badge-secondary",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
  }

  return <span className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}>{children}</span>
}

export default Badge
