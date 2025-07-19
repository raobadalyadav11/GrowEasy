"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"

interface ApplicationStatus {
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  feedback?: string
}

export default function SellerApplicationPage() {
  const [application, setApplication] = useState<ApplicationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchApplicationStatus()
  }, [])

  const fetchApplicationStatus = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        if (userData.role === "seller") {
          setApplication({
            status: userData.status,
            submittedAt: userData.createdAt,
            feedback: userData.rejectionReason,
          })

          // If approved, redirect to dashboard
          if (userData.status === "approved") {
            router.push("/seller/dashboard")
          }
        }
      }
    } catch (error) {
      console.error("Error fetching application status:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-12 w-12 text-success-600" />
      case "rejected":
        return <XCircle className="h-12 w-12 text-error-600" />
      default:
        return <Clock className="h-12 w-12 text-warning-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success"
      case "rejected":
        return "error"
      default:
        return "warning"
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "approved":
        return "Congratulations! Your seller application has been approved. You can now start selling on our platform."
      case "rejected":
        return "Unfortunately, your seller application has been rejected. Please review the feedback below and consider reapplying."
      default:
        return "Your seller application is currently under review. We'll notify you once a decision has been made."
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
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">Seller Application Status</h1>
              <p className="text-neutral-600">Track the progress of your seller application</p>
            </div>
          </CardHeader>
          <CardBody>
            {application && (
              <div className="space-y-6">
                {/* Status Display */}
                <div className="text-center">
                  <div className="flex justify-center mb-4">{getStatusIcon(application.status)}</div>
                  <Badge variant={getStatusColor(application.status) as any} className="text-lg px-4 py-2">
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                  <p className="text-neutral-600 mt-4 text-lg">{getStatusMessage(application.status)}</p>
                </div>

                {/* Application Details */}
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Application Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Submitted:</span>
                      <span className="font-medium">
                        {new Date(application.submittedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {application.reviewedAt && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Reviewed:</span>
                        <span className="font-medium">
                          {new Date(application.reviewedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Feedback Section */}
                {application.feedback && application.status === "rejected" && (
                  <div className="bg-error-50 border border-error-200 rounded-lg p-6">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-error-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-error-800 font-semibold mb-2">Rejection Feedback</h4>
                        <p className="text-error-700">{application.feedback}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  {application.status === "approved" && (
                    <Button onClick={() => router.push("/seller/dashboard")} size="lg">
                      Go to Dashboard
                    </Button>
                  )}
                  {application.status === "rejected" && (
                    <Button onClick={() => router.push("/auth/register?role=seller")} size="lg">
                      Reapply
                    </Button>
                  )}
                  {application.status === "pending" && (
                    <Button variant="outline" onClick={() => window.location.reload()} size="lg">
                      Refresh Status
                    </Button>
                  )}
                </div>

                {/* Help Section */}
                <div className="text-center pt-6 border-t border-neutral-200">
                  <p className="text-neutral-600 mb-4">Need help with your application?</p>
                  <div className="space-x-4">
                    <Button variant="outline" onClick={() => router.push("/contact")}>
                      Contact Support
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/faq")}>
                      View FAQ
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
