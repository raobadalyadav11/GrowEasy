"use client"

import { useEffect, useState } from "react"
import { Copy, ExternalLink, TrendingUp, Download, Eye } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { formatCurrency, formatDate } from "@/lib/utils"

interface AffiliateLink {
  _id: string
  affiliateCode: string
  productId: {
    _id: string
    name: string
    price: number
    images: string[]
    category: string
  }
  clicks: number
  conversions: number
  earnings: number
  commissionRate: number
  createdAt: string
}

export default function AffiliateLinksPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchAffiliateLinks()
  }, [currentPage, sortBy])

  const fetchAffiliateLinks = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      })

      const response = await fetch(`/api/seller/affiliate-links?${params}`)
      if (response.ok) {
        const data = await response.json()
        setLinks(data.links || [])
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error("Error fetching affiliate links:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyAffiliateLink = (affiliateCode: string) => {
    const link = `${window.location.origin}/product/${affiliateCode}`
    navigator.clipboard.writeText(link)
    alert("Affiliate link copied to clipboard!")
  }

  const exportData = () => {
    const csvContent = [
      ["Product Name", "Affiliate Code", "Clicks", "Conversions", "Earnings", "Commission Rate", "Created Date"],
      ...links.map((link) => [
        link.productId.name,
        link.affiliateCode,
        link.clicks.toString(),
        link.conversions.toString(),
        link.earnings.toString(),
        `${link.commissionRate}%`,
        formatDate(link.createdAt),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "affiliate-links-performance.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredLinks = links.filter((link) => link.productId.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalStats = {
    totalClicks: links.reduce((sum, link) => sum + link.clicks, 0),
    totalConversions: links.reduce((sum, link) => sum + link.conversions, 0),
    totalEarnings: links.reduce((sum, link) => sum + link.earnings, 0),
    conversionRate:
      links.length > 0
        ? (
            (links.reduce((sum, link) => sum + link.conversions, 0) /
              Math.max(
                links.reduce((sum, link) => sum + link.clicks, 0),
                1,
              )) *
            100
          ).toFixed(2)
        : "0.00",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Affiliate Links</h1>
          <p className="text-neutral-600 mt-2">Track and manage your affiliate link performance</p>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <ExternalLink className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total Links</p>
                <p className="text-2xl font-bold text-neutral-900">{links.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total Clicks</p>
                <p className="text-2xl font-bold text-neutral-900">{totalStats.totalClicks}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Conversions</p>
                <p className="text-2xl font-bold text-neutral-900">{totalStats.totalConversions}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total Earnings</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(totalStats.totalEarnings)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
              <option value="createdAt">Sort by Date</option>
              <option value="clicks">Sort by Clicks</option>
              <option value="conversions">Sort by Conversions</option>
              <option value="earnings">Sort by Earnings</option>
            </select>
            <div className="text-sm text-neutral-600 flex items-center">
              Conversion Rate: {totalStats.conversionRate}%
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Links Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">Your Affiliate Links</h3>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 py-4">
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/6"></div>
                  </div>
                  <div className="w-20 h-4 bg-neutral-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-12">
              <ExternalLink className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No affiliate links found</h3>
              <p className="text-neutral-600 mb-4">Generate affiliate links from your approved products.</p>
              <Button onClick={() => (window.location.href = "/seller/products")}>Go to Products</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Earnings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {filteredLinks.map((link) => (
                    <tr key={link._id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={link.productId.images[0] || "/placeholder.svg"}
                              alt={link.productId.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900">{link.productId.name}</div>
                            <div className="text-sm text-neutral-500">{formatCurrency(link.productId.price)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">
                          {link.clicks} clicks • {link.conversions} conversions
                        </div>
                        <div className="text-sm text-neutral-500">
                          {link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(1) : "0.0"}% conversion
                          rate
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">{formatCurrency(link.earnings)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary">{link.commissionRate}%</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {formatDate(link.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => copyAffiliateLink(link.affiliateCode)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-neutral-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
