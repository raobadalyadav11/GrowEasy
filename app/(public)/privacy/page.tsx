import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-neutral-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardContent className="prose prose-neutral max-w-none p-8">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">1. Information We Collect</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  We collect information you provide directly to us, such as when you create an account, make a
                  purchase, or contact us for support. This may include:
                </p>
                <ul className="list-disc list-inside text-neutral-700 space-y-2">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>Payment information (credit card details, billing address)</li>
                  <li>Profile information (preferences, interests)</li>
                  <li>Communication data (messages, support tickets)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-neutral-700 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Monitor and analyze trends and usage</li>
                  <li>Detect, investigate, and prevent fraudulent transactions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">3. Information Sharing</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  We may share your information in the following situations:
                </p>
                <ul className="list-disc list-inside text-neutral-700 space-y-2">
                  <li>With vendors and service providers who perform services on our behalf</li>
                  <li>With sellers when you make a purchase (limited to order fulfillment)</li>
                  <li>In response to legal requests or to protect our rights</li>
                  <li>In connection with a merger, sale, or acquisition</li>
                  <li>With your consent or at your direction</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">4. Data Security</h2>
                <p className="text-neutral-700 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction. However, no method of
                  transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">5. Your Rights</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-neutral-700 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to processing of your personal information</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">6. Cookies and Tracking</h2>
                <p className="text-neutral-700 leading-relaxed">
                  We use cookies and similar tracking technologies to collect and use personal information about you.
                  You can control cookies through your browser settings, but disabling cookies may affect the
                  functionality of our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">7. Contact Us</h2>
                <p className="text-neutral-700 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-neutral-100 rounded-lg">
                  <p className="text-neutral-700">
                    <strong>Email:</strong> privacy@groweasy.com
                    <br />
                    <strong>Phone:</strong> +91 9876543210
                    <br />
                    <strong>Address:</strong> 123 Business Street, Mumbai, Maharashtra 400001, India
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
