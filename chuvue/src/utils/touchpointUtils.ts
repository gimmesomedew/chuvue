import { Video, Activity, BookOpen } from 'lucide-react'

export type TouchpointType = 'Video' | 'Interactive' | 'Content'

export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Video': return Video
    case 'Interactive': return Activity
    case 'Content': return BookOpen
    default: return BookOpen
  }
}

export const getTypeColor = (type: string) => {
  switch (type) {
    case 'Video': return 'text-blue-400'
    case 'Interactive': return 'text-green-400'
    case 'Content': return 'text-orange-400'
    default: return 'text-orange-400'
  }
}

export const getNumberColor = (number: number) => {
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-orange-500 to-orange-600',
    'bg-gradient-to-br from-red-500 to-red-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-yellow-500 to-yellow-600'
  ]
  return colors[(number - 1) % colors.length]
}

export const TOUCHPOINT_TYPES: TouchpointType[] = ['Video', 'Interactive', 'Content']

