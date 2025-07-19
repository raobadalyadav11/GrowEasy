import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"

export async function GET() {
  try {
    await connectDB()

    // Get unique categories with product counts
    const categoriesData = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          productCount: { $sum: 1 },
          featured: { $first: "$featured" },
        },
      },
      {
        $project: {
          name: "$_id",
          productCount: 1,
          featured: { $ifNull: ["$featured", false] },
          description: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "Electronics"] }, then: "Latest gadgets and electronic devices" },
                { case: { $eq: ["$_id", "Fashion"] }, then: "Trendy clothing and accessories" },
                { case: { $eq: ["$_id", "Home & Garden"] }, then: "Everything for your home and garden" },
                { case: { $eq: ["$_id", "Sports"] }, then: "Sports equipment and fitness gear" },
                { case: { $eq: ["$_id", "Books"] }, then: "Books and educational materials" },
                { case: { $eq: ["$_id", "Health & Beauty"] }, then: "Health and beauty products" },
              ],
              default: "Quality products in this category",
            },
          },
          image: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "Electronics"] }, then: "/placeholder.jpg" },
                { case: { $eq: ["$_id", "Fashion"] }, then: "/placeholder.jpg" },
                { case: { $eq: ["$_id", "Home & Garden"] }, then: "/placeholder.jpg" },
                { case: { $eq: ["$_id", "Sports"] }, then: "/placeholder.jpg" },
                { case: { $eq: ["$_id", "Books"] }, then: "/placeholder.jpg" },
                { case: { $eq: ["$_id", "Health & Beauty"] }, then: "/placeholder.jpg" },
              ],
              default: "/placeholder.jpg",
            },
          },
        },
      },
      { $sort: { featured: -1, productCount: -1 } },
    ])

    return NextResponse.json({
      success: true,
      categories: categoriesData,
    })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}
