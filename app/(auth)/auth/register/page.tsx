"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, ShoppingBag } from "lucide-react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardBody } from "@/components/ui/Card"
import FileUpload from "@/components/ui/FileUpload"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "customer",
    businessName: "",
    businessType: "",
    gstNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
    },
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      bankName: "",
    },
    documents: {
      gstCertificate: "",
      aadharCard: "",
      panCard: "",
      bankPassbook: "",
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate seller documents
    if (formData.role === "seller") {
      if (!formData.documents.aadharCard || !formData.documents.panCard || !formData.documents.bankPassbook) {
        setError("Please upload all required documents for seller registration")
        setLoading(false)
        return
      }
    }

    try {
      const payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      }

      if (formData.role === "seller") {
        payload.businessInfo = {
          businessName: formData.businessName,
          businessType: formData.businessType,
          gstNumber: formData.gstNumber,
          address: formData.address,
        }
        payload.bankDetails = formData.bankDetails
        payload.documents = formData.documents
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Show success message for sellers
      if (formData.role === "seller") {
        alert("Registration successful! Your account is pending approval. You will be notified once approved.")
        router.push("/auth/login")
      } else {
        // Redirect based on role
        const { role } = data.user
        if (role === "admin") {
          router.push("/admin/dashboard")
        } else if (role === "seller") {
          router.push("/seller/dashboard")
        } else {
          router.push("/customer/dashboard")
        }
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...(formData as any)[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleDocumentUpload = (documentType: string, url: string) => {
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [documentType]: url,
      },
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <ShoppingBag className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-neutral-900">Create your account</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">{error}</div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Account Type</label>
                <select name="role" value={formData.role} onChange={handleChange} className="input" required>
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                label="Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Seller-specific fields */}
              {formData.role === "seller" && (
                <>
                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">Business Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Business Name"
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Business Type"
                        type="text"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Input
                      label="GST Number (Optional)"
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Street Address"
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="City"
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="State"
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="ZIP Code"
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Country"
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">Bank Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Account Holder Name"
                        type="text"
                        name="bankDetails.accountHolderName"
                        value={formData.bankDetails.accountHolderName}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Bank Name"
                        type="text"
                        name="bankDetails.bankName"
                        value={formData.bankDetails.bankName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Account Number"
                        type="text"
                        name="bankDetails.accountNumber"
                        value={formData.bankDetails.accountNumber}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="IFSC Code"
                        type="text"
                        name="bankDetails.ifscCode"
                        value={formData.bankDetails.ifscCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">Required Documents</h3>
                    <p className="text-sm text-neutral-600 mb-6">
                      Please upload the following documents for verification. All documents are required for seller
                      registration.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FileUpload
                        label="Aadhar Card"
                        onUpload={(url) => handleDocumentUpload("aadharCard", url)}
                        accept="image/*,.pdf"
                        folder="documents/aadhar"
                        required
                      />

                      <FileUpload
                        label="PAN Card"
                        onUpload={(url) => handleDocumentUpload("panCard", url)}
                        accept="image/*,.pdf"
                        folder="documents/pan"
                        required
                      />

                      <FileUpload
                        label="Bank Passbook/Statement"
                        onUpload={(url) => handleDocumentUpload("bankPassbook", url)}
                        accept="image/*,.pdf"
                        folder="documents/bank"
                        required
                      />

                      {formData.gstNumber && (
                        <FileUpload
                          label="GST Certificate"
                          onUpload={(url) => handleDocumentUpload("gstCertificate", url)}
                          accept="image/*,.pdf"
                          folder="documents/gst"
                        />
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-neutral-900">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" loading={loading} className="w-full" size="lg">
                Create Account
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
