export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'published':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'draft':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    case 'archived':
      return 'bg-slate-600/20 text-slate-300 border-slate-600/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-500/20 text-green-400'
    case 'Intermediate':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'Advanced':
      return 'bg-red-500/20 text-red-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}

