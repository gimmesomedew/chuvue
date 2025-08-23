export type TouchpointType = 'Video' | 'Interactive' | 'Content'

export interface Touchpoint {
  id: string
  number: number
  title: string
  description: string
  duration: string
  type: TouchpointType
  typeIcon: any
  typeColor: string
  videoUrl?: string
}

