"use client"

import { Card, CardBody } from "@/components/ui/Card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Terms & Conditions</h1>
          <p className="text-lg text-neutral-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardBody className="prose prose-neutral max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-neutral-700 leading-relaxed">
                  By accessing and using this e-commerce platform, you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by the above, please do not use this
                  service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">2. Use License</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the materials on our platform for personal,
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and
                  under this license you may not:
                </p>
                <ul className="list-disc list-inside text-neutral-700 space-y-2">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the platform</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">3. User Accounts</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  When you create an account with us, you must provide information that is accurate, complete, and
                  current at all times. You are responsible for safeguarding the password and for all activities that
                  occur under your account.
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  You agree not to disclose your password to any third party and to take sole responsibility for any
                  activities or actions under your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">4. Seller Terms</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  If you register as a seller on our platform, you agree to:
                </p>
                <ul className="list-disc list-inside text-neutral-700 space-y-2">
                  <li>Provide accurate product descriptions and pricing</li>
                  <li>Fulfill orders in a timely manner</li>
                  <li>Maintain adequate inventory levels</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Pay applicable fees and commissions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">5. Payment Terms</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  All payments are processed securely through our payment partners. By making a purchase, you agree to:
                </p>
                <ul className="list-disc list-inside text-neutral-700 space-y-2">
                  <li>Provide accurate payment information</li>
                  <li>Pay all charges incurred by your account</li>
                  <li>Accept our refund and return policy</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">6. Affiliate Program</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Our affiliate program allows sellers to earn commissions on referred sales. Participation in the
                  affiliate program is subject to additional terms and conditions, including commission rates, payment
                  schedules, and performance requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">7. Privacy Policy</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
                  information when you use our platform. By using our service, you agree to the collection and use of
                  information in accordance with our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">8. Prohibited Uses</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">You may not use our platform:</p>
                <ul className="list-disc list-inside text-neutral-700 space-y-2">
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

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">9. Disclaimer</h2>
                <p className="text-neutral-700 leading-relaxed">
                  The information on this platform is provided on an 'as is' basis. To the fullest extent permitted by
                  law, this Company excludes all representations, warranties, conditions and terms whether express or
                  implied, statutory or otherwise.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">10. Limitations</h2>
                <p className="text-neutral-700 leading-relaxed">
                  In no event shall our company or its suppliers be liable for any damages (including, without
                  limitation, damages for loss of data or profit, or due to business interruption) arising out of the
                  use or inability to use the materials on our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">11. Revisions</h2>
                <p className="text-neutral-700 leading-relaxed">
                  We may revise these terms of service at any time without notice. By using this platform, you are
                  agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">12. Contact Information</h2>
                <p className="text-neutral-700 leading-relaxed">
                  If you have any questions about these Terms & Conditions, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-neutral-100 rounded-lg">
                  <p className="text-neutral-700">
                    <strong>Email:</strong> legal@ecommerce.com
                    <br />
                    <strong>Phone:</strong> +91 9876543210
                    <br />
                    <strong>Address:</strong> 123 Business Street, Mumbai, Maharashtra 400001, India
                  </p>
                </div>
              </section>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
