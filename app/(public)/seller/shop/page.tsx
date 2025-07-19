"use client"

import { useEffect, useState } from "react"
import { Save, Eye, Palette, Settings, ExternalLink } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import FileUpload from "@/components/ui/FileUpload"

interface SellerShop {
  _id: string
  shopName: string
  shopDescription: string
  logo?: string
  banner?: string
  isActive: boolean
  products: string[]
  customization: {
    primaryColor: string
    secondaryColor: string
    theme: "light" | "dark"
  }
  analytics: {
    totalVisits: number
    totalOrders: number
    totalRevenue: number
  }
}

export default function ShopManagementPage() {
  const [shop, setShop] = useState<SellerShop | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    fetchShop()
  }, [])

  const fetchShop = async () => {
    try {
      const response = await fetch("/api/seller/shop")
      if (response.ok) {
        const data = await response.json()
        setShop(data.shop)
      }
    } catch (error) {
      console.error("Error fetching shop:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!shop) return

    setSaving(true)
    try {
      const response = await fetch("/api/seller/shop", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shop),
      })

      if (response.ok) {
        alert("Shop updated successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update shop")
      }
    } catch (error) {
      console.error("Error updating shop:", error)
      alert("Failed to update shop")
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = (url: string) => {
    if (shop) {
      setShop({ ...shop, logo: url })
    }
  }

  const handleBannerUpload = (url: string) => {
    if (shop) {
      setShop({ ...shop, banner: url })
    }
  }

  const previewShop = () => {
    window.open(`/shop/${shop?._id}`, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8" />
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Failed to load shop data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Shop Management</h1>
          <p className="text-neutral-600 mt-2">Customize your shop appearance and settings</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={previewShop}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Shop
          </Button>
          <Button onClick={handleSave} loading={saving}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Shop Status */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Shop Status</h3>
              <p className="text-neutral-600">Your shop is currently {shop.isActive ? "active" : "inactive"}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-neutral-600">
                {shop.isActive ? "Visible to customers" : "Hidden from customers"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={shop.isActive}
                  onChange={(e) => setShop({ ...shop, isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{shop.analytics.totalVisits}</p>
              <p className="text-sm text-neutral-600">Total Visits</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-2xl font-bold text-success-600">{shop.analytics.totalOrders}</p>
              <p className="text-sm text-neutral-600">Total Orders</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning-600">${shop.analytics.totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-neutral-600">Total Revenue</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "general", name: "General", icon: Settings },
            { id: "appearance", name: "Appearance", icon: Palette },
            { id: "products", name: "Products", icon: ExternalLink },
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-neutral-900">Basic Information</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <Input
                  label="Shop Name"
                  value={shop.shopName}
                  onChange={(e) => setShop({ ...shop, shopName: e.target.value })}
                  placeholder="Enter your shop name"
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Shop Description</label>
                  <textarea
                    value={shop.shopDescription}
                    onChange={(e) => setShop({ ...shop, shopDescription: e.target.value })}
                    rows={4}
                    className="input"
                    placeholder="Describe your shop and what you sell..."
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-neutral-900">Shop Images</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FileUpload label="Shop Logo" onUpload={handleLogoUpload} accept="image/*" folder="shops/logos" />
                  {shop.logo && (
                    <div className="mt-4">
                      <img
                        src={shop.logo || "/placeholder.svg"}
                        alt="Shop Logo"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <FileUpload
                    label="Shop Banner"
                    onUpload={handleBannerUpload}
                    accept="image/*"
                    folder="shops/banners"
                  />
                  {shop.banner && (
                    <div className="mt-4">
                      <img
                        src={shop.banner || "/placeholder.svg"}
                        alt="Shop Banner"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === "appearance" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Customization</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Primary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={shop.customization.primaryColor}
                      onChange={(e) =>
                        setShop({
                          ...shop,
                          customization: { ...shop.customization, primaryColor: e.target.value },
                        })
                      }
                      className="w-12 h-12 rounded border border-neutral-300"
                    />
                    <Input
                      value={shop.customization.primaryColor}
                      onChange={(e) =>
                        setShop({
                          ...shop,
                          customization: { ...shop.customization, primaryColor: e.target.value },
                        })
                      }
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Secondary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={shop.customization.secondaryColor}
                      onChange={(e) =>
                        setShop({
                          ...shop,
                          customization: { ...shop.customization, secondaryColor: e.target.value },
                        })
                      }
                      className="w-12 h-12 rounded border border-neutral-300"
                    />
                    <Input
                      value={shop.customization.secondaryColor}
                      onChange={(e) =>
                        setShop({
                          ...shop,
                          customization: { ...shop.customization, secondaryColor: e.target.value },
                        })
                      }
                      placeholder="#1F2937"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Theme</label>
                <select
                  value={shop.customization.theme}
                  onChange={(e) =>
                    setShop({
                      ...shop,
                      customization: { ...shop.customization, theme: e.target.value as "light" | "dark" },
                    })
                  }
                  className="input"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === "products" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">Shop Products</h3>
          </CardHeader>
          <CardBody>
            <div className="text-center py-8">
              <ExternalLink className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
              <h4 className="text-lg font-medium text-neutral-900 mb-2">Manage Shop Products</h4>
              <p className="text-neutral-600 mb-4">Add approved products to your shop from the Products page</p>
              <Button onClick={() => (window.location.href = "/seller/products")}>Go to Products</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
