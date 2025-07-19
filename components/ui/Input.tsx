import type React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input: React.FC<InputProps> = ({ label, error, helperText, className, id, ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      <input id={inputId} className={cn("input", error && "input-error", className)} {...props} />
      {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-neutral-500">{helperText}</p>}
    </div>
  )
}

export default Input
