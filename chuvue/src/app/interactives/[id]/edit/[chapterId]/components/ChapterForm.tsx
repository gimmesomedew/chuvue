'use client'

interface ChapterFormProps {
  chapterTitle: string
  chapterDescription: string
  duration: string
  difficulty: string
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  onDurationChange: (duration: string) => void
  onDifficultyChange: (difficulty: string) => void
}

export default function ChapterForm({
  chapterTitle,
  chapterDescription,
  duration,
  difficulty,
  onTitleChange,
  onDescriptionChange,
  onDurationChange,
  onDifficultyChange
}: ChapterFormProps) {
  return (
    <div className="space-y-6">
      {/* Chapter Title */}
      <div>
        <label className="block text-white font-medium mb-2">Chapter Title</label>
        <input
          type="text"
          value={chapterTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="glass-input w-full p-3 text-white placeholder-gray-400"
          placeholder="Enter chapter title"
        />
      </div>

      {/* Chapter Description */}
      <div>
        <label className="block text-white font-medium mb-2">Description</label>
        <textarea
          value={chapterDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="glass-input w-full p-3 text-white placeholder-gray-400 resize-none"
          placeholder="Enter chapter description"
        />
      </div>

      {/* Duration & Difficulty */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-medium mb-2">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => onDurationChange(e.target.value)}
            className="glass-input w-full p-3 text-white placeholder-gray-400"
            placeholder="e.g., 15-20 mins."
          />
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="glass-input w-full p-3 text-white"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
    </div>
  )
}

