import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Notification, Report, ChatMessage } from "@/types"
import { dummyReports } from "@/data/reports" // Import dummy reports

interface UserState {
  user: User | null
  notifications: Notification[]
  isAuthenticated: boolean
  allUsers: User[]
  allReports: Report[] // Add allReports to the store
  chatMessages: ChatMessage[] // Add chatMessages to the store
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  addNotification: (notification: Omit<Notification, "id">) => void
  markNotificationRead: (id: string) => void
  getAllUsers: () => User[]
  addUser: (user: Omit<User, "id">) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
  addReport: (report: Omit<Report, "id" | "createdAt">) => void
  updateReport: (id: string, data: Partial<Report>) => void
  getReportById: (id: string) => Report | undefined
  getAllReports: () => Report[]
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  getChatMessages: () => ChatMessage[]
}

// Dummy users for authentication
const initialDummyUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@helpdesk.com",
    role: "admin",
    avatar: "/admin-avatar.png",
  },
  {
    id: "2",
    name: "Staff User",
    email: "staff@helpdesk.com",
    role: "staff",
    avatar: "/diverse-staff-avatars.png",
  },
  {
    id: "3",
    name: "Master Admin",
    email: "master@helpdesk.com",
    role: "master",
    avatar: "/master-avatar.png",
  },
]

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      notifications: [],
      isAuthenticated: false,
      allUsers: initialDummyUsers, // Initialize with dummy users
      allReports: dummyReports, // Initialize with dummy reports
      chatMessages: [], // Initialize chat messages
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const user = initialDummyUsers.find((u) => u.email === email)
        if (user && password === "password123") {
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, notifications: [] })
      },
      updateProfile: (data) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...data } })
        }
      },
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: Date.now().toString(),
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }))
      },
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }))
      },
      getAllUsers: () => {
        const { user } = get()
        const { allUsers } = get()

        if (user?.role === "master") {
          return allUsers.filter((u) => u.role !== "master")
        } else if (user?.role === "admin") {
          return allUsers.filter((u) => u.role === "staff")
        }
        return []
      },
      addUser: (userData) => {
        const newUser = {
          ...userData,
          id: Date.now().toString(),
        }
        set((state) => ({
          allUsers: [...state.allUsers, newUser],
        }))
      },
      updateUser: (id, data) => {
        set((state) => ({
          allUsers: state.allUsers.map((u) => (u.id === id ? { ...u, ...data } : u)),
        }))
      },
      deleteUser: (id) => {
        set((state) => ({
          allUsers: state.allUsers.filter((u) => u.id !== id),
        }))
      },
      addReport: (reportData) => {
        const newReport = {
          ...reportData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: "pending", // Default status for new reports
        }
        set((state) => ({
          allReports: [newReport, ...state.allReports],
        }))
        get().addNotification({
          message: `Laporan baru "${newReport.title}" telah dibuat.`,
          type: "info",
          read: false,
          createdAt: new Date().toISOString(),
        })
      },
      updateReport: (id, data) => {
        set((state) => ({
          allReports: state.allReports.map((r) =>
            r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r,
          ),
        }))
        const updatedReport = get().allReports.find((r) => r.id === id)
        if (updatedReport) {
          get().addNotification({
            message: `Laporan "${updatedReport.title}" diperbarui ke status: ${updatedReport.status}.`,
            type: "info",
            read: false,
            createdAt: new Date().toISOString(),
          })
        }
      },
      getReportById: (id) => {
        return get().allReports.find((r) => r.id === id)
      },
      getAllReports: () => {
        return get().allReports
      },
      addChatMessage: (messageData) => {
        const newMessage = {
          ...messageData,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        }
        set((state) => ({
          chatMessages: [...state.chatMessages, newMessage],
        }))
      },
      getChatMessages: () => {
        return get().chatMessages
      },
    }),
    {
      name: "user-storage",
    },
  ),
)
