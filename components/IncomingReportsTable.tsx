"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, Settings } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import type { Report } from "@/types"
import { StaffDetailModal } from "./StaffDetailModal"
import { ProcessReportModal } from "./ProcessReportModal"

interface IncomingReportsTableProps {
  reports: Report[]
  basePath: string // e.g., '/admin/reports' or '/master/reports'
}

export function IncomingReportsTable({ reports, basePath }: IncomingReportsTableProps) {
  const router = useRouter()
  const { allUsers } = useUserStore()
  const [showStaffDetailModal, setShowStaffDetailModal] = useState(false)
  const [selectedStaffId, setSelectedStaffId] = useState<string>("")
  const [showProcessReportModal, setShowProcessReportModal] = useState(false)
  const [selectedReportId, setSelectedReportId] = useState<string>("")

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-red-100 text-red-800"
      case "rejected":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  const getUserName = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId)
    return user ? user.name : "User Tidak Ditemukan"
  }

  const handleDetailClick = (staffId: string) => {
    setSelectedStaffId(staffId)
    setShowStaffDetailModal(true)
  }

  const handleProcessClick = (reportId: string) => {
    setSelectedReportId(reportId)
    setShowProcessReportModal(true)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Antrian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Lengkap Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Masalah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permasalahan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada laporan masuk terbaru.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{report.id.substring(0, 6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserName(report.createdBy)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate w-64">
                      {report.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(report.status)}`}
                      >
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDetailClick(report.createdBy)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          title="Detail Staff"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleProcessClick(report.id)}
                          className="text-green-600 hover:text-green-900 transition-colors duration-200"
                          title="Proses Laporan"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StaffDetailModal
        isOpen={showStaffDetailModal}
        onClose={() => setShowStaffDetailModal(false)}
        staffId={selectedStaffId}
      />
      <ProcessReportModal
        isOpen={showProcessReportModal}
        onClose={() => setShowProcessReportModal(false)}
        reportId={selectedReportId}
      />
    </>
  )
}
