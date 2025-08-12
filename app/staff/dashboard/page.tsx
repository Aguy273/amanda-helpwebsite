"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, CheckCircle } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/Card"
import { ChatButton } from "@/components/ChatButton"
import { FAQs } from "@/components/FAQs" // Import FAQs component
import { dummyReports } from "@/data/reports"

export default function StaffDashboard() {
  const { user, isAuthenticated } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "staff") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "staff") {
    return null
  }

  const userReports = dummyReports.filter((r) => r.createdBy === user.id)
  const completedReports = userReports.filter((r) => r.status === "completed").length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showCreateReport showChat />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Staff</h1>
          <p className="text-gray-600 mt-2">Selamat datang, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            title="Buat Laporan"
            value="+"
            icon={Plus}
            borderColor="blue"
            onClick={() => router.push("/staff/create-report")}
          >
            <p className="text-sm text-gray-500 mt-2">Klik untuk membuat laporan baru</p>
          </Card>

          <Card
            title="Laporan Selesai"
            value={completedReports}
            icon={CheckCircle}
            borderColor="blue"
            onClick={() => router.push("/staff/reports")}
          >
            <p className="text-sm text-gray-500 mt-2">Total laporan yang telah selesai</p>
          </Card>
        </div>

        {/* Recent Reports
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Laporan Saya</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {userReports.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Judul
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{report.title}</div>
                          <div className="text-sm text-gray-500">{report.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              report.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : report.status === "in-progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : report.status === "pending"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800" // For rejected
                            }`}
                          >
                            {report.status === "completed"
                              ? "Selesai"
                              : report.status === "in-progress"
                                ? "Dikerjakan"
                                : report.status === "pending"
                                  ? "Pending"
                                  : "Ditolak"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(report.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => router.push(`/staff/reports/${report.id}`)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">Belum ada laporan yang dibuat</p>
                <button
                  onClick={() => router.push("/staff/create-report")}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Buat Laporan Pertama
                </button>
              </div>
            )}
          </div>
        </div>
        */}

        {/* FAQs Section */}
        <div className="mt-12">
          <FAQs />
        </div>
      </main>

      <ChatButton href="/staff/chat" />
    </div>
  )
}
