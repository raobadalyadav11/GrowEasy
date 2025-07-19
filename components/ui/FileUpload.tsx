"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, FileText, ImageIcon } from "lucide-react"
import Button from "./Button"

interface FileUploadProps {
  onUpload: (url: string) => void
  accept?: string
  maxSize?: number // in MB
  folder?: string
  label?: string
  required?: boolean
}

export default function FileUpload({
  onUpload,
  accept = "image/*,.pdf",
  maxSize = 5,
  folder = "documents",
  label = "Upload File",
  required = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setError("")
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const { url } = await response.json()
      setUploadedFile(url)
      onUpload(url)
    } catch (error) {
      setError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setUploadedFile(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = (url: string) => {
    if (url.includes(".pdf")) {
      return <FileText className="h-8 w-8 text-red-500" />
    }
    return <ImageIcon className="h-8 w-8 text-blue-500" />
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {!uploadedFile ? (
        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            required={required}
          />

          <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-4" />

          <div className="space-y-2">
            <p className="text-sm text-neutral-600">Click to upload or drag and drop</p>
            <p className="text-xs text-neutral-500">
              {accept.includes("image") && "Images, "}PDF files up to {maxSize}MB
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 bg-transparent"
            onClick={() => fileInputRef.current?.click()}
            loading={uploading}
          >
            Choose File
          </Button>
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(uploadedFile)}
              <div>
                <p className="text-sm font-medium text-neutral-900">File uploaded successfully</p>
                <p className="text-xs text-neutral-500">Click to view</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button type="button" variant="outline" size="sm" onClick={() => window.open(uploadedFile, "_blank")}>
                View
              </Button>
              <button type="button" onClick={handleRemove} className="text-neutral-400 hover:text-red-500">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
