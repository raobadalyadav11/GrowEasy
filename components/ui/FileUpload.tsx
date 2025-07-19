"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, FileText, ImageIcon } from "lucide-react"
import Button from "./Button"

interface FileUploadProps {
  label: string
  onUpload: (url: string) => void
  accept?: string
  folder?: string
  required?: boolean
  maxSize?: number // in MB
}

export default function FileUpload({
  label,
  onUpload,
  accept = "image/*,.pdf",
  folder = "uploads",
  required = false,
  maxSize = 5,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

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
      console.error("Upload error:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    onUpload("")
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

      {uploadedFile ? (
        <div className="border border-neutral-300 rounded-lg p-4 bg-neutral-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(uploadedFile)}
              <div>
                <p className="text-sm font-medium text-neutral-900">File uploaded successfully</p>
                <p className="text-xs text-neutral-500">Click to view</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeFile}
              className="text-red-600 hover:text-red-700 bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? "border-primary-500 bg-primary-50" : "border-neutral-300 hover:border-neutral-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
            required={required}
          />

          <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <p className="text-sm text-neutral-600 mb-2">
            Drag and drop your file here, or{" "}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-neutral-500">
            Supports: {accept.replace(/\*/g, "all")} (max {maxSize}MB)
          </p>

          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-center">
                <div className="spinner w-5 h-5 mr-2" />
                <span className="text-sm text-neutral-600">Uploading...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
