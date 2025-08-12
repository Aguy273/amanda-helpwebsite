"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, Trash2, User } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import type { Report } from "@/types"

interface ReportTableProps {
  reports: Report[]
  showActions?: boolean
  showAssignedTo?: boolean
  showCreatedBy?: boolean
  onReportUpdate?: (id: string, data: Partial<Report>) => void
  onReportDelete?: (id: string) => void
  basePath: string // e.g., '/admin/reports' or '/master/reports'
}

export function ReportTable({
  reports,
  showActions = true,
  showAssignedTo = true,
  showCreatedBy = true,
  onReportUpdate,
  onReportDelete,
  basePath,
}: ReportTableProps) {
  const router = useRouter()
  const { allUsers } = useUserStore()
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [assignedToId, setAssignedToId] = useState<string>("")

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

  const getUserName = (userId?: string) => {
    if (!userId) return "N/A"
    const user = allUsers.find((u) => u.id === userId)
    return user ? user.name : "User Tidak Ditemukan"
  }

  const handleStatusChange = (reportId: string, newStatus: Report["status"]) => {
    if (onReportUpdate) {
      onReportUpdate(reportId, { status: newStatus })
    }
  }

  const handleAssignClick = (report: Report) => {
    setSelectedReport(report)
    setAssignedToId(report.assignedTo || "")
    setShowAssignModal(true)
  }

  const handleAssignSubmit = () => {
    if (selectedReport && onReportUpdate) {
      onReportUpdate(selectedReport.id, { assignedTo: assignedToId || undefined })
      setShowAssignModal(false)
      setSelectedReport(null)
      setAssignedToId("")
    }
  }

  const staffUsers = allUsers.filter((u) => u.role === "staff" || u.role === "admin") // Admin can also be assigned reports

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
              {showCreatedBy && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat Oleh
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              {showAssignedTo && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ditugaskan Ke
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    showActions && showAssignedTo && showCreatedBy
                      ? 6
                      : (showActions && showAssignedTo) ||
                          (showActions && showCreatedBy) ||
                          (showAssignedTo && showCreatedBy)
                        ? 5
                        : showActions || showAssignedTo || showCreatedBy
                          ? 4
                          : 3
                  }
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Tidak ada laporan yang ditemukan.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.title}</div>
                    <div className="text-sm text-gray-500 truncate w-64">{report.description}</div>
                  </td>
                  {showCreatedBy && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserName(report.createdBy)}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(report.status)}`}
                    >
                      {getStatusText(report.status)}
                    </span>
                  </td>
                  {showAssignedTo && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserName(report.assignedTo)}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`${basePath}/${report.id}`)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {onReportUpdate && (
                          <>
                            <select
                              value={report.status}
                              onChange={(e) => handleStatusChange(report.id, e.target.value as Report["status"])}
                              className="border border-gray-300 rounded-md text-xs py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">Dikerjakan</option>
                              <option value="completed">Selesai</option>
                              <option value="rejected">Ditolak</option>
                            </select>
                            <button
                              onClick={() => handleAssignClick(report)}
                              className="text-yellow-600 hover:text-yellow-900 transition-colors duration-200"
                              title="Tugaskan"
                            >
                              <User className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {onReportDelete && (
                          <button
                            onClick={() => onReportDelete(report.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            title="Hapus Laporan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tugaskan Laporan</h2>
              <p className="text-gray-700 mb-4">Tugaskan laporan "{selectedReport.title}" ke staff:</p>
              <select
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Staff</option>
                {staffUsers.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} ({staff.role})
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleAssignSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Tugaskan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
