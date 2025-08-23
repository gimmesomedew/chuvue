'use client'

export default function LoadingState() {
  return (
    <div className="text-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple mx-auto mb-6"></div>
      <p className="text-gray-400">Loading chapters...</p>
    </div>
  )
}

