'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'

export default function HomePage() {
  const { isAuthenticated, user } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(`/${user.role}/dashboard`)
    } else {
      router.push('/login')
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(to top right, #01303F, #027EA5)'}}>
      <div className="text-center">
        <div className="w-45 h-45 items-center justify-center">
          <img src="logo123.png" alt="loadinglogo" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">E-HelpDesk</h1>
        <p className="text-blue-100">Loading...</p>
      </div>
    </div>
  )
}
