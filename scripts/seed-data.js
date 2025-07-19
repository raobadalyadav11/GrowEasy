const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce"

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "seller", "customer"], default: "customer" },
    status: { type: String, enum: ["pending", "approved", "rejected", "active"], default: "active" },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: String,
      avatar: String,
    },
    businessInfo: {
      businessName: String,
      businessType: String,
      gstNumber: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String,
      bankName: String,
    },
    documents: {
      aadharCard: String,
      panCard: String,
      bankPassbook: String,
      gstCertificate: String,
    },
  },
  { timestamps: true },
)

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: String,
    price: { type: Number, required: true },
    comparePrice: Number,
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    subcategory: String,
    tags: [String],
    images: [String],
    specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
    affiliatePercentage: { type: Number, default: 5 },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "approved", "rejected", "active", "inactive"], default: "pending" },
    featured: { type: Boolean, default: false },
    seoTitle: String,
    seoDescription: String,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
  },
  { timestamps: true },
)

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    paymentMethod: String,
    paymentId: String,
    shippingAddress: {
      firstName: String,
      lastName: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String,
    },
    trackingNumber: String,
    notes: String,
  },
  { timestamps: true },
)

const User = mongoose.model("User", userSchema)
const Product = mongoose.model("Product", productSchema)
const Order = mongoose.model("Order", orderSchema)

// Sample data
const categories = ["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Beauty", "Toys", "Automotive"]
const subcategories = {
  Electronics: ["Smartphones", "Laptops", "Headphones", "Cameras", "Gaming"],
  Clothing: ["Men", "Women", "Kids", "Shoes", "Accessories"],
  Books: ["Fiction", "Non-Fiction", "Educational", "Comics", "Magazines"],
  "Home & Garden": ["Furniture", "Decor", "Kitchen", "Garden", "Tools"],
  Sports: ["Fitness", "Outdoor", "Team Sports", "Water Sports", "Winter Sports"],
  Beauty: ["Skincare", "Makeup", "Hair Care", "Fragrances", "Tools"],
  Toys: ["Educational", "Action Figures", "Dolls", "Games", "Outdoor"],
  Automotive: ["Parts", "Accessories", "Tools", "Care", "Electronics"],
}

const businessTypes = ["Retail", "Wholesale", "Manufacturing", "Service", "E-commerce", "Import/Export"]
const indianStates = [
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "West Bengal",
  "Delhi",
]
const indianCities = ["Mumbai", "Bangalore", "Chennai", "Pune", "Hyderabad", "Ahmedabad", "Kolkata", "Delhi"]

// Generate random data
function generateRandomString(length) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2)
    .toUpperCase()
}

function generateRandomPhone() {
  return (
    "9" +
    Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(9, "0")
  )
}

function generateRandomGST() {
  return "27" + generateRandomString(13)
}

function generateRandomIFSC() {
  return (
    "SBIN" +
    "0" +
    Math.floor(Math.random() * 100000)
      .toString()
      .padStart(6, "0")
  )
}

function generateRandomAccountNumber() {
  return Math.floor(Math.random() * 10000000000000000).toString()
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function generateProductName(category, subcategory) {
  const adjectives = [
    "Premium",
    "Professional",
    "Deluxe",
    "Ultra",
    "Pro",
    "Advanced",
    "Smart",
    "Digital",
    "Wireless",
    "Portable",
  ]
  const brands = ["TechPro", "EliteMax", "PowerCore", "SmartTech", "ProGear", "UltraMax", "DigitalPro", "TechElite"]

  return `${getRandomElement(adjectives)} ${getRandomElement(brands)} ${subcategory}`
}

function generateProductDescription(name, category) {
  return `Experience the best in ${category.toLowerCase()} with our ${name}. This premium product offers exceptional quality, durability, and performance. Perfect for both personal and professional use, it combines cutting-edge technology with user-friendly design. Features include advanced functionality, reliable performance, and excellent value for money. Backed by our quality guarantee and customer support.`
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Product.deleteMany({})
    await Order.deleteMany({})
    console.log("Cleared existing data")

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12)
    const admin = new User({
      email: "admin@ecommerce.com",
      password: adminPassword,
      role: "admin",
      status: "active",
      profile: {
        firstName: "Admin",
        lastName: "User",
        phone: generateRandomPhone(),
      },
    })
    await admin.save()
    console.log("Created admin user")

    // Create sellers
    const sellers = []
    for (let i = 0; i < 25; i++) {
      const password = await bcrypt.hash("seller123", 12)
      const firstName = ["Raj", "Priya", "Amit", "Sneha", "Vikram", "Anita", "Rohit", "Kavya", "Arjun", "Meera"][i % 10]
      const lastName = ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Agarwal", "Jain", "Shah", "Verma", "Mehta"][
        i % 10
      ]
      const businessName = `${firstName} ${lastName} Enterprises`

      const seller = new User({
        email: `seller${i + 1}@example.com`,
        password,
        role: "seller",
        status: i < 20 ? "approved" : "pending", // 20 approved, 5 pending
        profile: {
          firstName,
          lastName,
          phone: generateRandomPhone(),
        },
        businessInfo: {
          businessName,
          businessType: getRandomElement(businessTypes),
          gstNumber: generateRandomGST(),
          address: {
            street: `${Math.floor(Math.random() * 999) + 1}, ${getRandomElement(["MG Road", "Park Street", "Main Road", "Commercial Street"])}`,
            city: getRandomElement(indianCities),
            state: getRandomElement(indianStates),
            zipCode: Math.floor(Math.random() * 900000 + 100000).toString(),
            country: "India",
          },
        },
        bankDetails: {
          accountNumber: generateRandomAccountNumber(),
          ifscCode: generateRandomIFSC(),
          accountHolderName: `${firstName} ${lastName}`,
          bankName: getRandomElement([
            "State Bank of India",
            "HDFC Bank",
            "ICICI Bank",
            "Axis Bank",
            "Punjab National Bank",
          ]),
        },
        documents: {
          aadharCard: "https://example.com/aadhar.pdf",
          panCard: "https://example.com/pan.pdf",
          bankPassbook: "https://example.com/passbook.pdf",
          gstCertificate: "https://example.com/gst.pdf",
        },
      })
      await seller.save()
      if (seller.status === "approved") {
        sellers.push(seller)
      }
    }
    console.log("Created 25 sellers (20 approved, 5 pending)")

    // Create customers
    for (let i = 0; i < 50; i++) {
      const password = await bcrypt.hash("customer123", 12)
      const firstName = [
        "Aarav",
        "Vivaan",
        "Aditya",
        "Vihaan",
        "Arjun",
        "Sai",
        "Reyansh",
        "Ayaan",
        "Krishna",
        "Ishaan",
      ][i % 10]
      const lastName = ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Agarwal", "Jain", "Shah", "Verma", "Mehta"][
        i % 10
      ]

      const customer = new User({
        email: `customer${i + 1}@example.com`,
        password,
        role: "customer",
        status: "active",
        profile: {
          firstName,
          lastName,
          phone: generateRandomPhone(),
        },
      })
      await customer.save()
    }
    console.log("Created 50 customers")

    // Create products
    const products = []
    for (let i = 0; i < 150; i++) {
      const category = getRandomElement(categories)
      const subcategory = getRandomElement(subcategories[category])
      const seller = getRandomElement(sellers)
      const name = generateProductName(category, subcategory)
      const price = Math.floor(Math.random() * 50000) + 500 // 500 to 50500
      const comparePrice = Math.random() > 0.7 ? Math.floor(price * (1 + Math.random() * 0.5)) : null

      const product = new Product({
        name,
        description: generateProductDescription(name, category),
        shortDescription: `High-quality ${subcategory.toLowerCase()} perfect for your needs.`,
        price,
        comparePrice,
        stock: Math.floor(Math.random() * 100) + 1,
        sku: `SKU${generateRandomString(8)}`,
        category,
        subcategory,
        tags: [category.toLowerCase(), subcategory.toLowerCase(), "quality", "premium"],
        images: [
          `https://picsum.photos/800/600?random=${i * 3 + 1}`,
          `https://picsum.photos/800/600?random=${i * 3 + 2}`,
          `https://picsum.photos/800/600?random=${i * 3 + 3}`,
        ],
        specifications: {
          brand: getRandomElement(["TechPro", "EliteMax", "PowerCore", "SmartTech"]),
          warranty: getRandomElement(["1 Year", "2 Years", "3 Years"]),
          color: getRandomElement(["Black", "White", "Silver", "Blue", "Red"]),
          weight: `${(Math.random() * 5 + 0.1).toFixed(1)} kg`,
        },
        affiliatePercentage: Math.floor(Math.random() * 15) + 5, // 5-20%
        sellerId: seller._id,
        status: Math.random() > 0.1 ? "active" : "pending", // 90% active, 10% pending
        featured: Math.random() > 0.8, // 20% featured
        seoTitle: `${name} - Best ${category} Online`,
        seoDescription: `Buy ${name} online at best price. High quality ${category.toLowerCase()} with fast delivery and warranty.`,
        weight: Math.random() * 5 + 0.1,
        dimensions: {
          length: Math.floor(Math.random() * 50) + 10,
          width: Math.floor(Math.random() * 50) + 10,
          height: Math.floor(Math.random() * 50) + 10,
        },
      })
      await product.save()
      products.push(product)
    }
    console.log("Created 150 products")

    // Create orders
    const customers = await User.find({ role: "customer" }).limit(30)
    const activeProducts = products.filter((p) => p.status === "active")

    for (let i = 0; i < 75; i++) {
      const customer = getRandomElement(customers)
      const numItems = Math.floor(Math.random() * 3) + 1 // 1-3 items per order
      const orderItems = []
      let subtotal = 0

      for (let j = 0; j < numItems; j++) {
        const product = getRandomElement(activeProducts)
        const quantity = Math.floor(Math.random() * 3) + 1
        const itemTotal = product.price * quantity

        orderItems.push({
          productId: product._id,
          sellerId: product.sellerId,
          name: product.name,
          price: product.price,
          quantity,
          image: product.images[0],
        })

        subtotal += itemTotal
      }

      const tax = Math.floor(subtotal * 0.18) // 18% GST
      const shipping = subtotal > 500 ? 0 : 50 // Free shipping above 500
      const total = subtotal + tax + shipping

      const order = new Order({
        orderNumber: `ORD${Date.now().toString().slice(-6)}${generateRandomString(3)}`,
        customerId: customer._id,
        items: orderItems,
        subtotal,
        tax,
        shipping,
        total,
        status: getRandomElement(["pending", "confirmed", "processing", "shipped", "delivered"]),
        paymentStatus: Math.random() > 0.1 ? "paid" : "pending",
        paymentMethod: getRandomElement(["razorpay", "cod", "upi"]),
        paymentId: `pay_${generateRandomString(14)}`,
        shippingAddress: {
          firstName: customer.profile.firstName,
          lastName: customer.profile.lastName,
          street: `${Math.floor(Math.random() * 999) + 1}, ${getRandomElement(["Residency Road", "Brigade Road", "Koramangala", "Indiranagar"])}`,
          city: getRandomElement(indianCities),
          state: getRandomElement(indianStates),
          zipCode: Math.floor(Math.random() * 900000 + 100000).toString(),
          country: "India",
          phone: customer.profile.phone,
        },
        trackingNumber: Math.random() > 0.5 ? `TRK${generateRandomString(10)}` : null,
      })
      await order.save()
    }
    console.log("Created 75 orders")

    console.log("\n=== SEED DATA SUMMARY ===")
    console.log("✅ 1 Admin user created")
    console.log("✅ 25 Sellers created (20 approved, 5 pending)")
    console.log("✅ 50 Customers created")
    console.log("✅ 150 Products created")
    console.log("✅ 75 Orders created")
    console.log("\n=== LOGIN CREDENTIALS ===")
    console.log("Admin: admin@ecommerce.com / admin123")
    console.log("Seller: seller1@example.com / seller123 (and seller2, seller3, etc.)")
    console.log("Customer: customer1@example.com / customer123 (and customer2, customer3, etc.)")
    console.log("\nDatabase seeded successfully! 🎉")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await mongoose.disconnect()
  }
}

// Run the seed function
seedDatabase()
