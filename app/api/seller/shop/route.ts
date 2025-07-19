import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import SellerShop from "@/models/SellerShop"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    let shop = await SellerShop.findOne({ sellerId: user.userId }).populate("products")

    if (!shop) {
      // Create default shop if doesn't exist
      shop = new SellerShop({
        sellerId: user.userId,
        shopName: `${user.profile?.firstName || "Seller"}'s Shop`,
        shopDescription: "Welcome to my shop!",
        products: [],
      })
      await shop.save()
    }

    return NextResponse.json({ shop })
  } catch (error) {
    console.error("Error fetching shop:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const shopData = await request.json()
    const { shopName, shopDescription, logo, banner, isActive, products, customization } = shopData

    let shop = await SellerShop.findOne({ sellerId: user.userId })

    if (!shop) {
      shop = new SellerShop({
        sellerId: user.userId,
        shopName: shopName || "My Shop",
        shopDescription: shopDescription || "",
        logo,
        banner,
        isActive: isActive !== undefined ? isActive : true,
        products: products || [],
        customization: customization || {},
      })
    } else {
      if (shopName) shop.shopName = shopName
      if (shopDescription !== undefined) shop.shopDescription = shopDescription
      if (logo !== undefined) shop.logo = logo
      if (banner !== undefined) shop.banner = banner
      if (isActive !== undefined) shop.isActive = isActive
      if (products) shop.products = products
      if (customization) shop.customization = { ...shop.customization, ...customization }
    }

    await shop.save()

    return NextResponse.json({
      message: "Shop updated successfully",
      shop,
    })
  } catch (error) {
    console.error("Error updating shop:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
