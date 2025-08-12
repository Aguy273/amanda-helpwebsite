'use client'

import { ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'

interface CardProps {
  title: string
  value: string | number
  icon: LucideIcon
  borderColor: 'green' | 'blue' | 'red' | 'yellow'
  onClick?: () => void
  className?: string
  children?: ReactNode
}

const borderColorMap = {
  green: 'border-l-green-500',
  blue: 'border-l-blue-500',
  red: 'border-l-red-500',
  yellow: 'border-l-yellow-500'
}

const iconColorMap = {
  green: 'text-green-500',
  blue: 'text-blue-500',
  red: 'text-red-500',
  yellow: 'text-yellow-500'
}

export function Card({ 
  title, 
  value, 
  icon: Icon, 
  borderColor, 
  onClick, 
  className = '',
  children 
}: CardProps) {
  const isClickable = !!onClick

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md border-l-4 ${borderColorMap[borderColor]} 
        p-6 transition-all duration-300 ease-in-out
        ${isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {children}
        </div>
        <div className={`p-3 rounded-full bg-gray-50 ${iconColorMap[borderColor]}`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  )
}
