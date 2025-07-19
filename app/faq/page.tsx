"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Search, HelpCircle, ShoppingCart, Truck, CreditCard, Users, Settings } from "lucide-react"

const faqData = [
  {
    category: "General",
    icon: HelpCircle,
    color: "bg-blue-100 text-blue-600",
    questions: [
      {
        question: "What is this e-commerce platform?",
        answer:
          "Our platform is a comprehensive multi-vendor marketplace that connects buyers with sellers across India. We offer a wide range of products from electronics to clothing, with secure payment processing and reliable delivery services.",
      },
      {
        question: "How do I create an account?",
        answer:
          "Click on the 'Sign Up' button in the top right corner, fill in your details including name, email, and password. You'll receive a verification email to activate your account.",
      },
      {
        question: "Is it free to use the platform?",
        answer:
          "Yes, creating an account and browsing products is completely free for customers. Sellers pay a small commission on successful sales.",
      },
      {
        question: "What areas do you deliver to?",
        answer:
          "We deliver across India to most pin codes. During checkout, you can verify if delivery is available to your location.",
      },
    ],
  },
  {
    category: "Orders & Shopping",
    icon: ShoppingCart,
    color: "bg-green-100 text-green-600",
    questions: [
      {
        question: "How do I place an order?",
        answer:
          "Browse products, add items to your cart, proceed to checkout, fill in your delivery address, choose payment method, and confirm your order.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer:
          "You can cancel your order within 1 hour of placing it if it hasn't been processed. For modifications, please contact our support team immediately.",
      },
      {
        question: "What if an item is out of stock?",
        answer:
          "If an item goes out of stock after you've ordered, we'll notify you immediately and offer a full refund or suggest similar alternatives.",
      },
      {
        question: "How do I track my order?",
        answer:
          "Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track orders from your account dashboard.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    icon: Truck,
    color: "bg-purple-100 text-purple-600",
    questions: [
      {
        question: "What are the delivery charges?",
        answer:
          "Delivery is free for orders above ₹500. For orders below ₹500, delivery charges are ₹50. Express delivery options are available at additional cost.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Standard delivery takes 3-7 business days. Express delivery takes 1-3 business days. Delivery times may vary based on location and product availability.",
      },
      {
        question: "Do you deliver on weekends?",
        answer: "Yes, we deliver on Saturdays. Sunday delivery is available in select cities for express orders.",
      },
      {
        question: "What if I'm not available during delivery?",
        answer:
          "Our delivery partner will attempt delivery 3 times. If unsuccessful, the package will be held at the local facility for pickup or rescheduled delivery.",
      },
    ],
  },
  {
    category: "Payments & Refunds",
    icon: CreditCard,
    color: "bg-orange-100 text-orange-600",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept credit/debit cards, UPI, net banking, digital wallets, and cash on delivery (COD) for eligible orders.",
      },
      {
        question: "Is it safe to pay online?",
        answer:
          "Yes, all online payments are processed through secure, encrypted gateways. We use industry-standard security measures to protect your financial information.",
      },
      {
        question: "How do refunds work?",
        answer:
          "Refunds are processed within 5-7 business days after we receive and inspect returned items. The amount is credited back to your original payment method.",
      },
      {
        question: "Can I get a refund for COD orders?",
        answer:
          "Yes, for COD orders, refunds are processed via bank transfer. You'll need to provide your bank account details.",
      },
    ],
  },
  {
    category: "Seller Information",
    icon: Users,
    color: "bg-red-100 text-red-600",
    questions: [
      {
        question: "How can I become a seller?",
        answer:
          "Click on 'Become a Seller', fill out the registration form with your business details, upload required documents (GST, PAN, bank details), and wait for approval.",
      },
      {
        question: "What documents do I need to sell?",
        answer:
          "You need GST certificate, PAN card, Aadhar card, bank account details, and business registration documents.",
      },
      {
        question: "What commission do you charge?",
        answer:
          "Commission rates vary by category, typically ranging from 5-15%. Exact rates are communicated during the seller onboarding process.",
      },
      {
        question: "How do I get paid as a seller?",
        answer:
          "Payments are settled weekly to your registered bank account after deducting applicable commissions and fees.",
      },
    ],
  },
  {
    category: "Account & Settings",
    icon: Settings,
    color: "bg-gray-100 text-gray-600",
    questions: [
      {
        question: "How do I reset my password?",
        answer:
          "Click on 'Forgot Password' on the login page, enter your email address, and follow the instructions in the reset email.",
      },
      {
        question: "Can I change my email address?",
        answer:
          "Yes, you can update your email address from your account settings. You'll need to verify the new email address.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "Contact our support team to request account deletion. Please note that this action is irreversible and all data will be permanently removed.",
      },
      {
        question: "Can I have multiple accounts?",
        answer:
          "Each person should have only one account. Multiple accounts may result in suspension of all associated accounts.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<string[]>([])

  const filteredFAQs = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => !selectedCategory || category.category === selectedCategory)
    .filter((category) => category.questions.length > 0)

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-lg">Find answers to common questions about our platform</p>
          </div>

          {/* Search and Filter */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === null ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Badge>
                {faqData.map((category) => (
                  <Badge
                    key={category.category}
                    variant={selectedCategory === category.category ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category.category)}
                  >
                    {category.category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Content */}
          <div className="space-y-6">
            {filteredFAQs.map((category) => (
              <Card key={category.category} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className={`p-2 rounded-lg ${category.color} mr-3`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">{category.category}</h2>
                  </div>

                  <div className="space-y-4">
                    {category.questions.map((faq, index) => {
                      const itemId = `${category.category}-${index}`
                      const isOpen = openItems.includes(itemId)

                      return (
                        <Collapsible key={itemId} open={isOpen} onOpenChange={() => toggleItem(itemId)}>
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            <span className="font-medium text-gray-800">{faq.question}</span>
                            <ChevronDown
                              className={`h-4 w-4 text-gray-500 transition-transform ${
                                isOpen ? "transform rotate-180" : ""
                              }`}
                            />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-4 py-3 text-gray-600 leading-relaxed">
                            {faq.answer}
                          </CollapsibleContent>
                        </Collapsible>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse all categories</p>
              </CardContent>
            </Card>
          )}

          {/* Contact Support */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white mt-8">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
              <p className="text-blue-100 mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Contact Support
                </a>
                <a
                  href="/support/tickets"
                  className="border border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Create Ticket
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
