import type React from "react"
import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  return <div className={cn("card", hover && "hover-lift", className)}>{children}</div>
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return <div className={cn("card-header", className)}>{children}</div>
}

const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return <div className={cn("flex-1", className)}>{children}</div>
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return <div className={cn("pt-4 mt-6 border-t border-neutral-200", className)}>{children}</div>
}

export { Card, CardHeader, CardBody, CardFooter }
