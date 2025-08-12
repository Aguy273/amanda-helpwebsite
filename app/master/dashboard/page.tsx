"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Clock, AlertCircle, Users } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/Card"
import { IncomingReportsTable } from "@/components/IncomingReportsTable"
import { ChatButton } from "@/components/ChatButton" // Import ChatButton

export default function MasterDashboard() {
  const { user, isAuthenticated, getAllReports } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "master") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "master") {
    return null
  }

  const allReports = getAllReports()
  const completedReports = allReports.filter((r) => r.status === "completed").length
  const inProgressReports = allReports.filter((r) => r.status === "in-progress").length
  const pendingReports = allReports.filter((r) => r.status === "pending").length
  const totalUsers = useUserStore.getState().allUsers.length // Get total users from store

  // Get recent pending reports for the incoming table
  const recentIncomingReports = allReports
    .filter((r) => r.status === "pending")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showReports showCreateReport showChat /> {/* Update Navbar props to include showCreateReport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Master Admin</h1>
          <p className="text-gray-600 mt-2">Selamat datang, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title="Total Users"
            value={totalUsers}
            icon={Users}
            borderColor="yellow"
            onClick={() => router.push("/master/users")}
          />

          <Card
            title="Laporan Selesai"
            value={completedReports}
            icon={CheckCircle}
            borderColor="green"
            onClick={() => router.push("/master/reports?status=completed")}
          />

          <Card
            title="Laporan Sedang Dikerjakan"
            value={inProgressReports}
            icon={Clock}
            borderColor="blue"
            onClick={() => router.push("/master/reports?status=in-progress")}
          />

          <Card
            title="Laporan Belum Dikerjakan"
            value={pendingReports}
            icon={AlertCircle}
            borderColor="red"
            onClick={() => router.push("/master/reports?status=pending")}
          />
        </div>

        {/* Incoming Reports Table */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Laporan Masuk Terbaru</h2>
            <button
              onClick={() => router.push("/master/reports")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Lihat Semua Laporan
            </button>
          </div>
          <IncomingReportsTable reports={recentIncomingReports} basePath="/master/reports" />
        </div>

        {/* System Overview */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reports */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Laporan Terbaru</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Judul
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allReports.slice(0, 5).map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{report.title}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              report.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : report.status === "in-progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {report.status === "completed"
                              ? "Selesai"
                              : report.status === "in-progress"
                                ? "Dikerjakan"
                                : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* System Stats */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistik Sistem</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total Laporan</span>
                  <span className="text-lg font-bold text-gray-900">{allReports.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Tingkat Penyelesaian</span>
                  <span className="text-lg font-bold text-green-600">
                    {Math.round((completedReports / allReports.length) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Rata-rata Response Time</span>
                  <span className="text-lg font-bold text-blue-600">2.5 jam</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">User Aktif</span>
                  <span className="text-lg font-bold text-yellow-600">{totalUsers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Add ChatButton for Master Admin */}
      <ChatButton href="/master/chat" tooltip="Chat support" />
    </div>
  )
}
