'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

interface ChatButtonProps {
  href: string
  tooltip?: string
}

export function ChatButton({ href, tooltip = "Chat admin" }: ChatButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="relative">
        <Link
          href={href}
          className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-300 ease-in-out"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <MessageCircle className="w-6 h-6" />
        </Link>

        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap animate-in fade-in duration-200">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  )
}
