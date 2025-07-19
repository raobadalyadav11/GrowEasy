import Link from "next/link"
import {
  ShoppingBag,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Star,
  ArrowRight,
  CheckCircle,
  Award,
  Truck,
  CreditCard,
  Headphones,
  Target,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function HomePage() {
  const features = [
    {
      icon: ShoppingBag,
      title: "Multi-Vendor Marketplace",
      description: "Connect buyers with multiple sellers in one unified platform with seamless transactions",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Real-time insights and analytics to help sellers optimize their business performance",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Users,
      title: "Seller Management",
      description: "Comprehensive tools for managing sellers, approvals, and business relationships",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Integrated Razorpay with multiple payment options and fraud protection",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with fast loading times and smooth user experience",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Globe,
      title: "Global Ready",
      description: "Built for scale with multi-currency support and international shipping",
      color: "from-indigo-500 to-indigo-600",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Electronics Seller",
      content: "This platform has transformed my business. Sales increased by 300% in just 6 months!",
      rating: 5,
      avatar: "/placeholder-user.jpg",
      company: "TechWorld Electronics",
    },
    {
      name: "Priya Sharma",
      role: "Fashion Retailer",
      content: "The seller dashboard is incredibly intuitive. Managing inventory has never been easier.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
      company: "StyleHub Fashion",
    },
    {
      name: "Amit Patel",
      role: "Home Decor Seller",
      content: "Excellent support team and great commission structure. Highly recommended!",
      rating: 5,
      avatar: "/placeholder-user.jpg",
      company: "HomeStyle Decor",
    },
  ]

  const benefits = [
    "Zero setup fees - Start selling immediately",
    "Competitive commission rates starting at 5%",
    "24/7 customer support in multiple languages",
    "Advanced inventory management tools",
    "Integrated shipping and logistics",
    "Marketing and promotional tools",
  ]

  const stats = [
    { number: "10K+", label: "Active Sellers", icon: Users },
    { number: "1M+", label: "Happy Customers", icon: Target },
    { number: "50K+", label: "Products Listed", icon: ShoppingBag },
    { number: "99.9%", label: "Uptime", icon: BarChart3 },
  ]

  const whyChooseUs = [
    {
      icon: Award,
      title: "Trusted Platform",
      description: "Verified sellers and secure transactions",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable shipping nationwide",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Multiple payment options with full security",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer assistance",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <Badge className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2" />
              Trusted by 10,000+ sellers across India
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Build Your
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Dream Business
              </span>
              Online
            </h1>

            <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join India's fastest-growing e-commerce platform. Start selling today with zero setup fees, powerful
              tools, and dedicated support to grow your business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Selling Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8 py-4 border-2 hover:bg-neutral-50 bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Browse Products
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-neutral-500">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="flex items-center">
                  <item.icon className="h-5 w-5 text-success-600 mr-2" />
                  <span className="font-medium">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-100 to-primary-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-neutral-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="inline-flex items-center px-4 py-2 bg-secondary-100 text-secondary-700 text-sm font-medium mb-4">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Powerful tools and features designed to help you build, manage, and scale your online business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="inline-flex items-center px-4 py-2 bg-success-100 text-success-700 text-sm font-medium mb-4">
                Why Choose Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Why Choose GrowEasy?</h2>
              <p className="text-xl text-neutral-600 mb-8">
                We provide everything you need to start, manage, and grow your online business successfully.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center group">
                    <CheckCircle className="h-6 w-6 text-success-600 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-neutral-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/20 rounded-full"></div>
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-primary-100 mb-6">
                  Join thousands of successful sellers who have grown their business with GrowEasy.
                </p>
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full bg-white text-primary-600 hover:bg-neutral-50 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Create Your Store Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="inline-flex items-center px-4 py-2 bg-warning-100 text-warning-700 text-sm font-medium mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">What Our Sellers Say</h2>
            <p className="text-xl text-neutral-600">
              Don't just take our word for it - hear from successful sellers on our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-warning-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                      <div className="text-sm text-neutral-600">{testimonial.role}</div>
                      <div className="text-xs text-primary-600 font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful sellers and start building your online empire today. No setup fees, no hidden
            costs - just pure growth potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-neutral-50 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Free Store
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4 bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
