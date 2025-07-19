import { Globe, Heart, Lightbulb, Shield, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description:
        "We put our customers and sellers at the heart of everything we do, ensuring their success is our success.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously innovate to provide cutting-edge solutions that help businesses thrive online.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We maintain the highest standards of security and transparency in all our operations.",
    },
    {
      icon: Globe,
      title: "Global Vision",
      description: "We're building a platform that connects businesses and customers across the globe.",
    },
  ]

  const team = [
    {
      name: "Rajesh Gupta",
      role: "CEO & Founder",
      description: "15+ years in e-commerce and technology leadership",
      image: "/placeholder-user.jpg",
    },
    {
      name: "Priya Singh",
      role: "CTO",
      description: "Expert in scalable technology solutions and platform architecture",
      image: "/placeholder-user.jpg",
    },
    {
      name: "Amit Kumar",
      role: "Head of Operations",
      description: "Specialist in marketplace operations and seller success",
      image: "/placeholder-user.jpg",
    },
    {
      name: "Sneha Patel",
      role: "Head of Marketing",
      description: "Digital marketing expert with focus on growth and customer acquisition",
      image: "/placeholder-user.jpg",
    },
  ]

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Started with a vision to democratize e-commerce in India",
    },
    {
      year: "2021",
      title: "1,000 Sellers",
      description: "Reached our first major milestone of 1,000 active sellers",
    },
    {
      year: "2022",
      title: "Series A Funding",
      description: "Raised $10M to expand our platform and reach",
    },
    {
      year: "2023",
      title: "10,000+ Sellers",
      description: "Became one of India's fastest-growing marketplaces",
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Launched international shipping and multi-currency support",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Active Sellers" },
    { number: "1M+", label: "Happy Customers" },
    { number: "50K+", label: "Products Listed" },
    { number: "₹100Cr+", label: "GMV Processed" },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              About GrowEasy
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Empowering Businesses to
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Grow Online
              </span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to democratize e-commerce in India by providing powerful, easy-to-use tools that help
              businesses of all sizes succeed online.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-neutral-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-neutral-700 leading-relaxed">
                <p>
                  GrowEasy was born from a simple observation: while e-commerce was booming globally, many small and
                  medium businesses in India were struggling to establish their online presence.
                </p>
                <p>
                  Our founders, having worked in the tech industry for over a decade, recognized the gap between complex
                  enterprise solutions and the needs of growing businesses. They set out to create a platform that would
                  be powerful yet accessible, comprehensive yet simple.
                </p>
                <p>
                  Today, GrowEasy serves thousands of sellers across India, from individual entrepreneurs to established
                  brands, helping them reach millions of customers and grow their businesses online.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-primary-100 mb-6">
                  To democratize e-commerce by providing world-class tools and support that enable businesses of all
                  sizes to succeed online.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span>Empower entrepreneurs</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span>Simplify technology</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span>Drive economic growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Our Values</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              The principles that guide everything we do and shape our company culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-100 to-primary-200 rounded-2xl mb-6">
                    <value.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">{value.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Our Journey</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Key milestones in our mission to transform e-commerce in India.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">{milestone.title}</h3>
                        <p className="text-neutral-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              The passionate individuals behind GrowEasy's success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{member.name}</h3>
                  <div className="text-primary-600 font-medium mb-3">{member.role}</div>
                  <p className="text-neutral-600 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
