import Link from "next/link"
import { ShoppingBag, Users, TrendingUp, Shield, Zap, Globe, Star, ArrowRight, CheckCircle } from "lucide-react"
import Button from "@/components/ui/Button"
import { Card, CardBody } from "@/components/ui/Card"

export default function HomePage() {
  const features = [
    {
      icon: ShoppingBag,
      title: "Multi-Vendor Marketplace",
      description: "Connect buyers with multiple sellers in one unified platform with seamless transactions",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Real-time insights and analytics to help sellers optimize their business performance",
    },
    {
      icon: Users,
      title: "Seller Management",
      description: "Comprehensive tools for managing sellers, approvals, and business relationships",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Integrated Razorpay with multiple payment options and fraud protection",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with fast loading times and smooth user experience",
    },
    {
      icon: Globe,
      title: "Global Ready",
      description: "Built for scale with multi-currency support and international shipping",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Electronics Seller",
      content: "This platform has transformed my business. Sales increased by 300% in just 6 months!",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Fashion Retailer",
      content: "The seller dashboard is incredibly intuitive. Managing inventory has never been easier.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      role: "Home Decor Seller",
      content: "Excellent support team and great commission structure. Highly recommended!",
      rating: 5,
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                GrowEasy
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/features" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="/pricing" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="/sellers" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
                For Sellers
              </Link>
              <Link href="/support" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
                Support
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="font-medium bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="sm"
                  className="font-medium bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2" />
              Trusted by 10,000+ sellers across India
            </div>
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
                  className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-lg px-8 py-4"
                >
                  Start Selling Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8 py-4 border-2 hover:bg-neutral-50 bg-transparent"
                >
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-neutral-500">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-success-600 mr-2" />
                <span className="font-medium">No Setup Fees</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-success-600 mr-2" />
                <span className="font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-success-600 mr-2" />
                <span className="font-medium">Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-neutral-600 font-medium">Active Sellers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-success-600 to-success-700 bg-clip-text text-transparent">
                1M+
              </div>
              <div className="text-neutral-600 font-medium">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-warning-500 to-warning-600 bg-clip-text text-transparent">
                50K+
              </div>
              <div className="text-neutral-600 font-medium">Products Listed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-secondary-600 to-secondary-700 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-neutral-600 font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Powerful tools and features designed to help you build, manage, and scale your online business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardBody className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-100 to-primary-200 rounded-2xl mb-6">
                    <feature.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Why Choose GrowEasy?</h2>
              <p className="text-xl text-neutral-600 mb-8">
                We provide everything you need to start, manage, and grow your online business successfully.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-success-600 mr-3 flex-shrink-0" />
                    <span className="text-neutral-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-primary-100 mb-6">
                  Join thousands of successful sellers who have grown their business with GrowEasy.
                </p>
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full bg-white text-primary-600 hover:bg-neutral-50"
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
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">What Our Sellers Say</h2>
            <p className="text-xl text-neutral-600">
              Don't just take our word for it - hear from successful sellers on our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardBody className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-warning-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-700 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                    <div className="text-sm text-neutral-600">{testimonial.role}</div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
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
                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-neutral-50 text-lg px-8 py-4"
              >
                Start Your Free Store
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4 bg-transparent"
              >
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold">GrowEasy</span>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Empowering businesses to grow online with cutting-edge e-commerce solutions and dedicated support.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-700 cursor-pointer transition-colors">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-700 cursor-pointer transition-colors">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-700 cursor-pointer transition-colors">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-3 text-neutral-400">
                <li>
                  <Link href="/features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-neutral-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/webinars" className="hover:text-white transition-colors">
                    Webinars
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-neutral-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">&copy; 2024 GrowEasy. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-neutral-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-neutral-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-neutral-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
