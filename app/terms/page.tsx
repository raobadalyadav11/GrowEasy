import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Terms & Conditions
            </h1>
            <p className="text-gray-600 text-lg">
              Please read these terms and conditions carefully before using our platform
            </p>
            <p className="text-sm text-gray-500 mt-2">Last updated: January 2024</p>
          </div>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  By accessing and using this e-commerce platform, you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by the above, please do not use this
                  service.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Use License</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the materials on our platform for personal,
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and
                  under this license you may not:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the platform</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Account Registration</h3>
                    <p className="text-gray-600 leading-relaxed">
                      To access certain features of our platform, you must register for an account. You agree to provide
                      accurate, current, and complete information during the registration process.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Account Security</h3>
                    <p className="text-gray-600 leading-relaxed">
                      You are responsible for maintaining the confidentiality of your account credentials and for all
                      activities that occur under your account.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Seller Terms</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Seller Registration</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Sellers must provide valid business documentation including GST certificate, PAN card, and bank
                      details for verification.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Product Listings</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Sellers are responsible for accurate product descriptions, pricing, and inventory management.
                      Misleading information may result in account suspension.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Commission Structure</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Platform commission rates vary by category and are clearly communicated during the seller
                      onboarding process.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Orders and Payments</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Order Processing</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Orders are processed upon successful payment confirmation. We reserve the right to cancel orders
                      for various reasons including product unavailability or pricing errors.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Payment Methods</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We accept various payment methods including credit/debit cards, UPI, net banking, and cash on
                      delivery (where available).
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Shipping and Delivery</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Delivery times are estimates and may vary based on location and product availability. We are not
                  responsible for delays caused by external factors such as weather conditions or courier service
                  issues.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Standard delivery: 3-7 business days</li>
                  <li>Express delivery: 1-3 business days (where available)</li>
                  <li>Free shipping on orders above ₹500</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Returns and Refunds</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We offer a 7-day return policy for most products. Items must be in original condition with all tags
                  and packaging intact. Certain categories like perishables, personalized items, and intimate wear are
                  not eligible for returns.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> Refunds are processed within 5-7 business days after we receive and inspect
                    the returned item.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Prohibited Uses</h2>
                <p className="text-gray-600 leading-relaxed mb-4">You may not use our platform:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>
                    To violate any international, federal, provincial, or state regulations, rules, laws, or local
                    ordinances
                  </li>
                  <li>
                    To infringe upon or violate our intellectual property rights or the intellectual property rights of
                    others
                  </li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Privacy Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
                  information when you use our platform. By using our service, you agree to the collection and use of
                  information in accordance with our Privacy Policy.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  In no event shall our company, nor its directors, employees, partners, agents, suppliers, or
                  affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages,
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                  resulting from your use of the platform.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                  revision is material, we will try to provide at least 30 days notice prior to any new terms taking
                  effect.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    If you have any questions about these Terms & Conditions, please contact us:
                  </p>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <strong>Email:</strong> legal@ecommerce.com
                    </p>
                    <p>
                      <strong>Phone:</strong> +91 1234567890
                    </p>
                    <p>
                      <strong>Address:</strong> 123 Business District, Mumbai, Maharashtra 400001, India
                    </p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
