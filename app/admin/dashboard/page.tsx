"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/Card"
import { IncomingReportsTable } from "@/components/IncomingReportsTable" // Import new component

export default function AdminDashboard() {
  const { user, isAuthenticated, getAllReports } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const allReports = getAllReports()
  const completedReports = allReports.filter((r) => r.status === "completed").length
  const inProgressReports = allReports.filter((r) => r.status === "in-progress").length
  const pendingReports = allReports.filter((r) => r.status === "pending").length

  // Get recent pending reports for the incoming table
  const recentIncomingReports = allReports
    .filter((r) => r.status === "pending")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showReports showChat />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Selamat datang, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Laporan Selesai"
            value={completedReports}
            icon={CheckCircle}
            borderColor="green"
            onClick={() => router.push("/admin/reports?status=completed")}
          />

          <Card
            title="Laporan Sedang Dikerjakan"
            value={inProgressReports}
            icon={Clock}
            borderColor="blue"
            onClick={() => router.push("/admin/reports?status=in-progress")}
          />

          <Card
            title="Laporan Belum Dikerjakan"
            value={pendingReports}
            icon={AlertCircle}
            borderColor="red"
            onClick={() => router.push("/admin/reports?status=pending")}
          />
        </div>

        {/* Incoming Reports Table */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Laporan Masuk Terbaru</h2>
            <button
              onClick={() => router.push("/admin/reports")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Lihat Semua Laporan
            </button>
          </div>
          <IncomingReportsTable reports={recentIncomingReports} basePath="/admin/reports" />
        </div>
      </main>
    </div>
  )
}
