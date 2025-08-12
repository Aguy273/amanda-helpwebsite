"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Home, FileText, MessageCircle, ChevronDown, User, Settings, LogOut, Menu, X } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { Dropdown } from "./Dropdown"
import { ProfileModal } from "./ProfileModal"
import Image from "next/image"

interface NavbarProps {
  showReports?: boolean
  showCreateReport?: boolean
  showChat?: boolean
}

export function Navbar({ showReports = false, showCreateReport = false, showChat = false }: NavbarProps) {
  const { user, logout, notifications } = useUserStore()
  const router = useRouter()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleSettingsClick = () => {
    if (user?.role === "admin") {
      router.push("/admin/setting")
    } else if (user?.role === "master") {
      router.push("/master/setting")
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const profileDropdownItems = [
    {
      label: "Profile",
      icon: User,
      onClick: () => setIsProfileModalOpen(true),
    },
    ...(user?.role !== "staff"
      ? [
          {
            label: "Settings",
            icon: Settings,
            onClick: handleSettingsClick,
          },
        ]
      : []),
    {
      label: "Logout",
      icon: LogOut,
      onClick: handleLogout,
    },
  ]

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <img src="/amanda.png" alt="logoamanda" />
                </div>
                <img src="/text.png" className="w-80 h-6" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href={`/${user?.role}/dashboard`}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>

              {showReports && (
                <Link
                  href={`/${user?.role}/reports`}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <FileText className="w-5 h-5" />
                  <span>Laporan</span>
                </Link>
              )}

              {showCreateReport && (
                <Link
                  href="/staff/create-report"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <FileText className="w-5 h-5" />
                  <span>Buat Laporan</span>
                </Link>
              )}

              {showChat && (
                <Link
                  href={`/${user?.role}/chat`}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat</span>
                </Link>
              )}

              {/* Notifications */}
              <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <Dropdown
                trigger={
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
                    <img
                      src={user?.avatar || "/placeholder.svg"}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="hidden lg:block">{user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                }
                items={profileDropdownItems}
              />
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link
                  href={`/${user?.role}/dashboard`}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>

                {showReports && (
                  <Link
                    href={`/${user?.role}/reports`}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileText className="w-5 h-5" />
                    <span>Laporan</span>
                  </Link>
                )}

                {showCreateReport && (
                  <Link
                    href="/staff/create-report"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileText className="w-5 h-5" />
                    <span>Buat Laporan</span>
                  </Link>
                )}

                {showChat && (
                  <Link
                    href={`/${user?.role}/chat`}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat</span>
                  </Link>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <img
                      src={user?.avatar || "/placeholder.svg"}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  )
}
