export const STATUS_OPTIONS = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
  ARCHIVED: 'archived'
} as const

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced'
} as const

export type StatusType = typeof STATUS_OPTIONS[keyof typeof STATUS_OPTIONS]
export type DifficultyType = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS]

