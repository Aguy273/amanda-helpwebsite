export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "staff" | "master"
  avatar?: string
  address?: string
}

export interface Report {
  id: string
  title: string
  description: string
  status: "completed" | "in-progress" | "pending" | "rejected"
  createdBy: string // User ID of the creator
  assignedTo?: string // User ID of the assigned staff/admin
  createdAt: string
  updatedAt?: string
}

export interface Notification {
  id: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}
