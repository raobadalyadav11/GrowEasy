"use client"

import { useEffect, useState } from "react"
import { Wallet, TrendingUp, Download, CreditCard, Calendar, DollarSign } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { formatCurrency, formatDate } from "@/lib/utils"

interface WalletTransaction {
  type: "credit" | "debit"
  amount: number
  description: string
  orderId?: string
  status: "pending" | "completed" | "failed"
  createdAt: string
}

interface WalletData {
  _id: string
  balance: number
  totalEarnings: number
  totalWithdrawn: number
  transactions: WalletTransaction[]
  lastPayoutDate?: string
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBankForm, setShowBankForm] = useState(false)
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    bankName: "",
  })
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchWallet()
  }, [])

  const fetchWallet = async () => {
    try {
      const response = await fetch("/api/seller/wallet")
      if (response.ok) {
        const data = await response.json()
        setWallet(data.wallet)
      }
    } catch (error) {
      console.error("Error fetching wallet:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateBankDetails = async () => {
    setUpdating(true)
    try {
      const response = await fetch("/api/seller/wallet", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bankDetails }),
      })

      if (response.ok) {
        setShowBankForm(false)
        alert("Bank details updated successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update bank details")
      }
    } catch (error) {
      console.error("Error updating bank details:", error)
      alert("Failed to update bank details")
    } finally {
      setUpdating(false)
    }
  }

  const exportTransactions = () => {
    if (!wallet) return

    const csvContent = [
      ["Date", "Type", "Description", "Amount", "Status"],
      ...wallet.transactions.map((transaction) => [
        formatDate(transaction.createdAt),
        transaction.type,
        transaction.description,
        transaction.amount.toString(),
        transaction.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "wallet-transactions.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getTransactionBadgeVariant = (type: string) => {
    return type === "credit" ? "success" : "error"
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "failed":
        return "error"
      default:
        return "warning"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8" />
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Failed to load wallet data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Wallet</h1>
          <p className="text-neutral-600 mt-2">Manage your earnings and payouts</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowBankForm(true)}>
            <CreditCard className="h-4 w-4 mr-2" />
            Update Bank Details
          </Button>
          <Button variant="outline" onClick={exportTransactions}>
            <Download className="h-4 w-4 mr-2" />
            Export Transactions
          </Button>
        </div>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Wallet className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Current Balance</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(wallet.balance)}</p>
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
                <p className="text-sm font-medium text-neutral-600">Total Earnings</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(wallet.totalEarnings)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Total Withdrawn</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(wallet.totalWithdrawn)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <Calendar className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Last Payout</p>
                <p className="text-sm font-bold text-neutral-900">
                  {wallet.lastPayoutDate ? formatDate(wallet.lastPayoutDate) : "No payouts yet"}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Payout Information */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">Payout Information</h3>
        </CardHeader>
        <CardBody>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-blue-800 font-semibold mb-2">Weekly Payout Schedule</h4>
                <p className="text-blue-700 text-sm mb-2">
                  Payouts are processed every Monday for the previous week's earnings. Minimum payout amount is $50.
                </p>
                <p className="text-blue-700 text-sm">
                  Next payout:{" "}
                  <strong>Monday, {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</strong>
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-neutral-900">Transaction History</h3>
            <span className="text-sm text-neutral-600">{wallet.transactions.length} transactions</span>
          </div>
        </CardHeader>
        <CardBody>
          {wallet.transactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
              <h4 className="text-lg font-medium text-neutral-900 mb-2">No transactions yet</h4>
              <p className="text-neutral-600">Your transaction history will appear here once you start earning.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wallet.transactions.slice(0, 10).map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-lg mr-4 ${
                        transaction.type === "credit" ? "bg-success-100" : "bg-error-100"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <TrendingUp className="h-5 w-5 text-success-600" />
                      ) : (
                        <Download className="h-5 w-5 text-error-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{transaction.description}</p>
                      <p className="text-sm text-neutral-500">{formatDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${transaction.type === "credit" ? "text-success-600" : "text-error-600"}`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {wallet.transactions.length > 10 && (
                <div className="text-center pt-4">
                  <Button variant="outline" size="sm">
                    View All Transactions
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Bank Details Modal */}
      {showBankForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-neutral-900">Update Bank Details</h2>
                <button onClick={() => setShowBankForm(false)} className="text-neutral-400 hover:text-neutral-600">
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Account Holder Name"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                  required
                />
                <Input
                  label="Bank Name"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  required
                />
                <Input
                  label="Account Number"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  required
                />
                <Input
                  label="IFSC Code"
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline" onClick={() => setShowBankForm(false)}>
                  Cancel
                </Button>
                <Button onClick={updateBankDetails} loading={updating}>
                  Update Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
