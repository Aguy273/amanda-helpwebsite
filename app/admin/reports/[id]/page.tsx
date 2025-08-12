"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import type { Report } from "@/types"
import { ArrowLeft, User, Calendar, Info, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react"

export default function AdminReportDetailPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated, getReportById, updateReport, allUsers } = useUserStore()
  const router = useRouter()
  const reportId = params.id
  const report = getReportById(reportId)
  const [currentStatus, setCurrentStatus] = useState<Report["status"] | "">(report?.status || "")
  const [assignedTo, setAssignedTo] = useState<string>(report?.assignedTo || "")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    if (report) {
      setCurrentStatus(report.status)
      setAssignedTo(report.assignedTo || "")
    }
  }, [report])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Navbar showReports showChat />
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Laporan Tidak Ditemukan</h1>
          <p className="text-gray-600">Laporan dengan ID {reportId} tidak ada.</p>
          <button
            onClick={() => router.back()}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>
      </div>
    )
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Report["status"]
    setCurrentStatus(newStatus)
    updateReport(report.id, { status: newStatus })
  }

  const handleAssignedToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAssignedTo = e.target.value
    setAssignedTo(newAssignedTo)
    updateReport(report.id, { assignedTo: newAssignedTo || undefined })
  }

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-500" />
      case "pending":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-gray-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: Report["status"]) => {
    switch (status) {
      case "completed":
        return "Selesai"
      case "in-progress":
        return "Dikerjakan"
      case "pending":
        return "Pending"
      case "rejected":
        return "Ditolak"
      default:
        return "Tidak Diketahui"
    }
  }

  const getAssignedUserName = (userId?: string) => {
    if (!userId) return "Belum Ditugaskan"
    const user = allUsers.find((u) => u.id === userId)
    return user ? user.name : "User Tidak Ditemukan"
  }

  const createdByUser = allUsers.find((u) => u.id === report.createdBy)
  const staffUsers = allUsers.filter((u) => u.role === "staff" || u.role === "admin") // Admin can also be assigned reports

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showReports showChat />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Daftar Laporan</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Detail Laporan</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{report.title}</h2>
            <p className="text-gray-700">{report.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-6">
            <div>
              <p className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-1">
                <User className="w-4 h-4" />
                <span>Dibuat Oleh:</span>
              </p>
              <p className="text-gray-800 font-semibold">{createdByUser?.name || "User Tidak Ditemukan"}</p>
              <p className="text-sm text-gray-500">{createdByUser?.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4" />
                <span>Tanggal Dibuat:</span>
              </p>
              <p className="text-gray-800 font-semibold">
                {new Date(report.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-1">
                {getStatusIcon(currentStatus as Report["status"])}
                <span>Status:</span>
              </p>
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">Dikerjakan</option>
                <option value="completed">Selesai</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-1">
                <User className="w-4 h-4" />
                <span>Ditugaskan Ke:</span>
              </p>
              <select
                value={assignedTo}
                onChange={handleAssignedToChange}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Staff</option>
                {staffUsers.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} ({staff.role})
                  </option>
                ))}
              </select>
            </div>

            {report.updatedAt && (
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Terakhir Diperbarui:</span>
                </p>
                <p className="text-gray-800 font-semibold">
                  {new Date(report.updatedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
