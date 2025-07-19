"use client"

import { useEffect, useState } from "react"
import { Save, Globe, Mail, Shield, CreditCard, Bell, Database } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"

interface AdminSettings {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    adminEmail: string
    supportEmail: string
    currency: string
    timezone: string
    language: string
  }
  payment: {
    razorpayKeyId: string
    razorpayKeySecret: string
    razorpayAccountNumber: string
    paymentMethods: string[]
    minimumPayoutAmount: number
    payoutSchedule: "daily" | "weekly" | "monthly"
  }
  email: {
    smtpHost: string
    smtpPort: number
    smtpUsername: string
    smtpPassword: string
    fromEmail: string
    fromName: string
  }
  security: {
    jwtSecret: string
    sessionTimeout: number
    maxLoginAttempts: number
    passwordMinLength: number
    requireTwoFactor: boolean
  }
  features: {
    allowSellerRegistration: boolean
    requireSellerApproval: boolean
    enableAffiliateProgram: boolean
    enableCoupons: boolean
    enableReviews: boolean
    enableWishlist: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    orderNotifications: boolean
    paymentNotifications: boolean
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    general: {
      siteName: "GrowEasy",
      siteDescription: "Modern Multi-Vendor E-commerce Platform",
      siteUrl: "https://groweasy.com",
      adminEmail: "admin@groweasy.com",
      supportEmail: "support@groweasy.com",
      currency: "INR",
      timezone: "Asia/Kolkata",
      language: "en",
    },
    payment: {
      razorpayKeyId: "",
      razorpayKeySecret: "",
      razorpayAccountNumber: "",
      paymentMethods: ["card", "netbanking", "upi", "wallet"],
      minimumPayoutAmount: 100,
      payoutSchedule: "weekly",
    },
    email: {
      smtpHost: "",
      smtpPort: 587,
      smtpUsername: "",
      smtpPassword: "",
      fromEmail: "",
      fromName: "GrowEasy",
    },
    security: {
      jwtSecret: "",
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireTwoFactor: false,
    },
    features: {
      allowSellerRegistration: true,
      requireSellerApproval: true,
      enableAffiliateProgram: true,
      enableCoupons: true,
      enableReviews: true,
      enableWishlist: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderNotifications: true,
      paymentNotifications: true,
    },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings || settings)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert("Settings updated successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update settings")
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      alert("Failed to update settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">System Settings</h1>
          <p className="text-neutral-600 mt-2">Configure platform settings and preferences</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "general", name: "General", icon: Globe },
            { id: "payment", name: "Payment", icon: CreditCard },
            { id: "email", name: "Email", icon: Mail },
            { id: "security", name: "Security", icon: Shield },
            { id: "features", name: "Features", icon: Database },
            { id: "notifications", name: "Notifications", icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "general" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">General Settings</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Site Name"
                  value={settings.general.siteName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, siteName: e.target.value },
                    })
                  }
                />
                <Input
                  label="Site URL"
                  value={settings.general.siteUrl}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, siteUrl: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Site Description</label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, siteDescription: e.target.value },
                    })
                  }
                  rows={3}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Admin Email"
                  type="email"
                  value={settings.general.adminEmail}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, adminEmail: e.target.value },
                    })
                  }
                />
                <Input
                  label="Support Email"
                  type="email"
                  value={settings.general.supportEmail}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, supportEmail: e.target.value },
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Currency</label>
                  <select
                    value={settings.general.currency}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, currency: e.target.value },
                      })
                    }
                    className="input"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Timezone</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, timezone: e.target.value },
                      })
                    }
                    className="input"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Language</label>
                  <select
                    value={settings.general.language}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, language: e.target.value },
                      })
                    }
                    className="input"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === "payment" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Payment Settings</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Razorpay Key ID"
                  value={settings.payment.razorpayKeyId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment: { ...settings.payment, razorpayKeyId: e.target.value },
                    })
                  }
                />
                <Input
                  label="Razorpay Key Secret"
                  type="password"
                  value={settings.payment.razorpayKeySecret}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment: { ...settings.payment, razorpayKeySecret: e.target.value },
                    })
                  }
                />
              </div>

              <Input
                label="Razorpay Account Number"
                value={settings.payment.razorpayAccountNumber}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    payment: { ...settings.payment, razorpayAccountNumber: e.target.value },
                  })
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Minimum Payout Amount (₹)"
                  type="number"
                  value={settings.payment.minimumPayoutAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment: { ...settings.payment, minimumPayoutAmount: Number(e.target.value) },
                    })
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Payout Schedule</label>
                  <select
                    value={settings.payment.payoutSchedule}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payment: {
                          ...settings.payment,
                          payoutSchedule: e.target.value as "daily" | "weekly" | "monthly",
                        },
                      })
                    }
                    className="input"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Enabled Payment Methods</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["card", "netbanking", "upi", "wallet"].map((method) => (
                    <div key={method} className="flex items-center">
                      <input
                        type="checkbox"
                        id={method}
                        checked={settings.payment.paymentMethods.includes(method)}
                        onChange={(e) => {
                          const methods = e.target.checked
                            ? [...settings.payment.paymentMethods, method]
                            : settings.payment.paymentMethods.filter((m) => m !== method)
                          setSettings({
                            ...settings,
                            payment: { ...settings.payment, paymentMethods: methods },
                          })
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={method} className="text-sm font-medium text-neutral-700 capitalize">
                        {method === "upi" ? "UPI" : method}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === "features" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Feature Settings</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {Object.entries(settings.features).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 capitalize">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {key === "allowSellerRegistration" && "Allow new sellers to register on the platform"}
                      {key === "requireSellerApproval" && "Require admin approval for new seller registrations"}
                      {key === "enableAffiliateProgram" && "Enable affiliate marketing program for sellers"}
                      {key === "enableCoupons" && "Allow creation and usage of discount coupons"}
                      {key === "enableReviews" && "Enable product reviews and ratings"}
                      {key === "enableWishlist" && "Allow customers to create wishlists"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          features: { ...settings.features, [key]: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
