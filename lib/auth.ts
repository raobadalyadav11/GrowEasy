import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import connectDB from "./mongodb"
import User from "@/models/User"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface UserPayload {
  userId: string
  email: string
  role: "admin" | "seller" | "customer"
}

export async function generateToken(payload: UserPayload): Promise<string> {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return null
    }

    // Verify user still exists in database
    await connectDB()
    const user = await User.findById(payload.userId)
    if (!user) {
      return null
    }

    return payload
  } catch (error) {
    return null
  }
}
