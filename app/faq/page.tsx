"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react"
import Input from "@/components/ui/Input"
import { Card, CardBody } from "@/components/ui/Card"

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "How do I create an account?",
    answer:
      "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details including name, email, and password. You'll receive a verification email to activate your account.",
    category: "Account",
  },
  {
    id: 2,
    question: "How do I become a seller?",
    answer:
      "To become a seller, register for an account and then apply through the 'Become a Seller' section. You'll need to provide business details, tax information, and identity verification documents. Our team will review your application within 2-3 business days.",
    category: "Selling",
  },
  {
    id: 3,
    question: "What are the commission rates?",
    answer:
      "Commission rates vary by product category, typically ranging from 5-15%. Electronics: 8%, Clothing: 12%, Books: 5%, Home & Garden: 10%. You can view detailed rates in your seller dashboard.",
    category: "Selling",
  },
  {
    id: 4,
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track your order by logging into your account and visiting the 'My Orders' section.",
    category: "Orders",
  },
  {
    id: 5,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards, UPI, net banking, and cash on delivery (COD) for eligible orders. All payments are processed securely through our payment partners.",
    category: "Payment",
  },
  {
    id: 6,
    question: "How do seller payouts work?",
    answer:
      "Seller payouts are processed weekly every Monday. Funds are transferred directly to your registered bank account. You can track all transactions and payout history in your seller dashboard.",
    category: "Selling",
  },
  {
    id: 7,
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some categories like perishables and personalized items are not eligible for returns.",
    category: "Returns",
  },
  {
    id: 8,
    question: "How do I cancel an order?",
    answer:
      "You can cancel an order within 24 hours of placing it if it hasn't been shipped yet. Go to 'My Orders', find your order, and click 'Cancel Order'. Refunds will be processed within 5-7 business days.",
    category: "Orders",
  },
  {
    id: 9,
    question: "How does the affiliate program work?",
    answer:
      "Our affiliate program allows sellers to earn additional income by promoting products. You'll receive a unique affiliate link and earn 5-10% commission on successful referrals. Payments are made monthly.",
    category: "Affiliate",
  },
  {
    id: 10,
    question: "What documents do I need to sell?",
    answer:
      "To sell on our platform, you need: Valid government ID (Aadhar/PAN), GST certificate (if applicable), bank account details, and business registration documents. All documents are verified during the application process.",
    category: "Selling",
  },
  {
    id: 11,
    question: "How do I contact customer support?",
    answer:
      "You can contact our customer support team 24/7 through: Email: support@ecommerce.com, Phone: +91 9876543210, Live chat on our website, or by creating a support ticket in your account dashboard.",
    category: "Support",
  },
  {
    id: 12,
    question: "Are there any listing fees?",
    answer:
      "There are no upfront listing fees. We only charge a commission when you make a sale. This includes payment processing, platform maintenance, and customer support services.",
    category: "Selling",
  },
]

const categories = ["All", "Account", "Selling", "Orders", "Payment", "Returns", "Affiliate", "Support"]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Find answers to common questions about our platform, selling, orders, and more.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "bg-white text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardBody>
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No FAQs found</h3>
                  <p className="text-neutral-600">Try adjusting your search terms or category filter.</p>
                </div>
              </CardBody>
            </Card>
          ) : (
            filteredFAQs.map((faq) => (
              <Card key={faq.id} className="hover:shadow-md transition-shadow">
                <CardBody>
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full text-left flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-neutral-900 mt-2">{faq.question}</h3>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {expandedItems.includes(faq.id) ? (
                        <ChevronUp className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                  </button>

                  {expandedItems.includes(faq.id) && (
                    <div className="px-4 pb-4">
                      <div className="border-t border-neutral-200 pt-4">
                        <p className="text-neutral-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Contact Support */}
        <Card className="mt-12">
          <CardBody>
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Still have questions?</h3>
              <p className="text-neutral-600 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="btn-primary inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium"
                >
                  Contact Support
                </a>
                <a
                  href="/feedback"
                  className="btn-outline inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium"
                >
                  Send Feedback
                </a>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
