import Link from "next/link"
import { ShoppingBag, Users, TrendingUp, Shield, Zap, Globe } from "lucide-react"
import Button from "@/components/ui/Button"
import { Card, CardBody } from "@/components/ui/Card"

export default function HomePage() {
  const features = [
    {
      icon: ShoppingBag,
      title: "Multi-Vendor Marketplace",
      description: "Connect buyers with multiple sellers in one unified platform",
    },
    {
      icon: TrendingUp,
      title: "Affiliate Marketing",
      description: "Earn commissions through our advanced affiliate system",
    },
    {
      icon: Users,
      title: "Seller Management",
      description: "Comprehensive tools for managing sellers and their products",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Integrated Razorpay for safe and reliable transactions",
    },
    {
      icon: Zap,
      title: "Real-time Analytics",
      description: "Track performance with detailed analytics and reports",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Expand your business reach with our scalable platform",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gradient">ECommerce Platform</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/features" className="text-neutral-600 hover:text-primary-600 transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-neutral-600 hover:text-primary-600 transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-neutral-600 hover:text-primary-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-neutral-600 hover:text-primary-600 transition-colors">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Modern E-Commerce
            <span className="block text-primary-200">Marketplace Platform</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto animate-slide-up">
            Build, manage, and scale your online business with our comprehensive multi-vendor platform featuring
            affiliate marketing and seamless payment processing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Selling Today
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-600 bg-transparent"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Our platform provides all the tools and features you need to build a successful online marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardBody>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-neutral-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1K+</div>
              <div className="text-neutral-600">Sellers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-neutral-600">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">99.9%</div>
              <div className="text-neutral-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your E-Commerce Journey?</h2>
          <p className="text-xl text-secondary-300 mb-8">
            Join thousands of successful sellers and start building your online business today.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="gradient-primary">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <ShoppingBag className="h-8 w-8 text-primary-400" />
                <span className="ml-2 text-xl font-bold">ECommerce Platform</span>
              </div>
              <p className="text-neutral-400">Building the future of online commerce with innovative solutions.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-neutral-400">
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
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-neutral-400">
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
                  <Link href="/status" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 ECommerce Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
