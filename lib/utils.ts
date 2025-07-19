import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substr(2, 5).toUpperCase()
  return `ORD-${timestamp.slice(-6)}-${random}`
}

export function generateAffiliateId() {
  return Math.random().toString(36).substr(2, 12).toUpperCase()
}

export function calculateDiscount(
  price: number,
  discountType: "percentage" | "fixed",
  discountValue: number,
  maxDiscount?: number,
) {
  let discount = 0

  if (discountType === "percentage") {
    discount = (price * discountValue) / 100
    if (maxDiscount && discount > maxDiscount) {
      discount = maxDiscount
    }
  } else {
    discount = Math.min(discountValue, price)
  }

  return Math.round(discount * 100) / 100
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string) {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}
