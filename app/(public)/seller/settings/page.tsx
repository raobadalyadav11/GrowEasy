"use client"

import { useEffect, useState } from "react"
import { Save, Bell, CreditCard, User, Globe, Mail, Phone } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"

interface SellerSettings {
  businessInfo: {
    businessName: string
    businessType: string
    gstNumber: string
    panNumber: string
    businessAddress: string
    businessPhone: string
    businessEmail: string
  }
  bankDetails: {
    accountHolderName: string
    accountNumber: string
    ifscCode: string
    bankName: string
    branchName: string
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    orderAlerts: boolean
    paymentAlerts: boolean
    enquiryAlerts: boolean
  }
  preferences: {
    currency: string
    timezone: string
    language: string
    autoApproveOrders: boolean
    minimumOrderAmount: number
  }
}

export default function SellerSettingsPage() {
  const [settings, setSettings] = useState<SellerSettings>({
    businessInfo: {
      businessName: "",
      businessType: "",
      gstNumber: "",
      panNumber: "",
      businessAddress: "",
      businessPhone: "",
      businessEmail: "",
    },
    bankDetails: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      orderAlerts: true,
      paymentAlerts: true,
      enquiryAlerts: true,
    },
    preferences: {
      currency: "INR",
      timezone: "Asia/Kolkata",
      language: "en",
      autoApproveOrders: false,
      minimumOrderAmount: 0,
    },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("business")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/seller/settings")
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
      const response = await fetch("/api/seller/settings", {
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
          <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-600 mt-2">Manage your seller account settings and preferences</p>
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
            { id: "business", name: "Business Info", icon: User },
            { id: "banking", name: "Banking", icon: CreditCard },
            { id: "notifications", name: "Notifications", icon: Bell },
            { id: "preferences", name: "Preferences", icon: Globe },
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
      {activeTab === "business" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Business Information</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Business Name"
                  value={settings.businessInfo.businessName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      businessInfo: { ...settings.businessInfo, businessName: e.target.value },
                    })
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Business Type</label>
                  <select
                    value={settings.businessInfo.businessType}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        businessInfo: { ...settings.businessInfo, businessType: e.target.value },
                      })
                    }
                    className="input"
                  >
                    <option value="">Select Business Type</option>
                    <option value="individual">Individual</option>
                    <option value="proprietorship">Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="private_limited">Private Limited</option>
                    <option value="public_limited">Public Limited</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="GST Number"
                  value={settings.businessInfo.gstNumber}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      businessInfo: { ...settings.businessInfo, gstNumber: e.target.value },
                    })
                  }
                  placeholder="22AAAAA0000A1Z5"
                />
                <Input
                  label="PAN Number"
                  value={settings.businessInfo.panNumber}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      businessInfo: { ...settings.businessInfo, panNumber: e.target.value },
                    })
                  }
                  placeholder="AAAAA0000A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Business Address</label>
                <textarea
                  value={settings.businessInfo.businessAddress}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      businessInfo: { ...settings.businessInfo, businessAddress: e.target.value },
                    })
                  }
                  rows={3}
                  className="input"
                  placeholder="Enter complete business address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Business Phone"
                  type="tel"
                  value={settings.businessInfo.businessPhone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      businessInfo: { ...settings.businessInfo, businessPhone: e.target.value },
                    })
                  }
                  icon={<Phone className="h-4 w-4" />}
                />
                <Input
                  label="Business Email"
                  type="email"
                  value={settings.businessInfo.businessEmail}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      businessInfo: { ...settings.businessInfo, businessEmail: e.target.value },
                    })
                  }
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === "banking" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Bank Account Details</h3>
            <p className="text-sm text-neutral-600">Required for receiving payments and payouts</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <Input
                label="Account Holder Name"
                value={settings.bankDetails.accountHolderName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankDetails: { ...settings.bankDetails, accountHolderName: e.target.value },
                  })
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Account Number"
                  value={settings.bankDetails.accountNumber}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankDetails: { ...settings.bankDetails, accountNumber: e.target.value },
                    })
                  }
                />
                <Input
                  label="IFSC Code"
                  value={settings.bankDetails.ifscCode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankDetails: { ...settings.bankDetails, ifscCode: e.target.value },
                    })
                  }
                  placeholder="SBIN0000123"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Bank Name"
                  value={settings.bankDetails.bankName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankDetails: { ...settings.bankDetails, bankName: e.target.value },
                    })
                  }
                />
                <Input
                  label="Branch Name"
                  value={settings.bankDetails.branchName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankDetails: { ...settings.bankDetails, branchName: e.target.value },
                    })
                  }
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-yellow-800 font-semibold mb-2">Important Note</h4>
                <p className="text-yellow-700 text-sm">
                  Bank details are used for automatic payouts. Please ensure all information is accurate to avoid
                  payment delays.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Notification Preferences</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium text-neutral-900 mb-4">Communication Methods</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">Email Notifications</p>
                      <p className="text-sm text-neutral-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, emailNotifications: e.target.checked },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">SMS Notifications</p>
                      <p className="text-sm text-neutral-500">Receive notifications via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsNotifications}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, smsNotifications: e.target.checked },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium text-neutral-900 mb-4">Alert Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">Order Alerts</p>
                      <p className="text-sm text-neutral-500">Get notified about new orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.orderAlerts}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, orderAlerts: e.target.checked },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">Payment Alerts</p>
                      <p className="text-sm text-neutral-500">Get notified about payments and payouts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.paymentAlerts}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, paymentAlerts: e.target.checked },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">Enquiry Alerts</p>
                      <p className="text-sm text-neutral-500">Get notified about product enquiry updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.enquiryAlerts}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, enquiryAlerts: e.target.checked },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === "preferences" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">General Preferences</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Currency</label>
                  <select
                    value={settings.preferences.currency}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, currency: e.target.value },
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
                    value={settings.preferences.timezone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, timezone: e.target.value },
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
                    value={settings.preferences.language}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, language: e.target.value },
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

              <Input
                label="Minimum Order Amount (₹)"
                type="number"
                value={settings.preferences.minimumOrderAmount}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, minimumOrderAmount: Number(e.target.value) },
                  })
                }
                min="0"
              />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Auto-approve Orders</p>
                  <p className="text-sm text-neutral-500">Automatically approve orders without manual review</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.preferences.autoApproveOrders}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, autoApproveOrders: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
