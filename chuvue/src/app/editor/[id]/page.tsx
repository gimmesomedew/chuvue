'use client'

import { useState } from 'react'
import { 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown,
  Video,
  FileText,
  CheckCircle,
  Settings,
  ArrowLeft
} from 'lucide-react'

interface Screen {
  id: string
  type: 'start' | 'intro' | 'video' | 'content' | 'completion'
  title: string
  content: string
  videoUrl?: string
  quote?: string
  author?: string
  order: number
}

interface Interactive {
  id: string
  title: string
  description: string
  category: string
  screens: Screen[]
  status: 'draft' | 'published'
}

export default function InteractiveEditor({ params }: { params: { id: string } }) {
  const [interactive, setInteractive] = useState<Interactive>({
    id: params.id,
    title: 'Master Coachability',
    description: 'Develop your ability to receive feedback, adapt, and grow through interactive learning experiences designed for teens and young adults.',
    category: 'Personal Development',
    status: 'draft',
    screens: [
      {
        id: '1',
        type: 'start',
        title: 'Master Coachability',
        content: 'Develop your ability to receive feedback, adapt, and grow through interactive learning experiences designed for teens and young adults.',
        order: 1
      },
      {
        id: '2',
        type: 'intro',
        title: 'Welcome to Your Learning Journey',
        content: 'In this module, you\'ll discover the key principles of coachability and how they can transform your personal and professional growth.',
        order: 2
      },
      {
        id: '3',
        type: 'video',
        title: 'Understanding Coachability',
        content: 'Watch this short video to learn the fundamentals of coachability and why it\'s essential for success.',
        videoUrl: '',
        order: 3
      },
      {
        id: '4',
        type: 'content',
        title: 'Key Principles',
        content: 'Coachability is built on three core principles: openness to feedback, willingness to change, and commitment to growth.',
        order: 4
      },
      {
        id: '5',
        type: 'completion',
        title: 'Congratulations!',
        content: 'You\'ve successfully completed the Master Coachability module. You now have the foundation to become more coachable.',
        quote: 'The only way to grow is to be coachable.',
        author: 'John Maxwell',
        order: 5
      }
    ]
  })

  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(interactive.screens[0])
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const addScreen = () => {
    if (interactive.screens.length >= 5) return

    const newScreen: Screen = {
      id: Date.now().toString(),
      type: 'content',
      title: 'New Screen',
      content: 'Enter your content here...',
      order: interactive.screens.length + 1
    }

    setInteractive({
      ...interactive,
      screens: [...interactive.screens, newScreen]
    })
    setSelectedScreen(newScreen)
  }

  const deleteScreen = (screenId: string) => {
    if (interactive.screens.length <= 1) return

    const updatedScreens = interactive.screens
      .filter(screen => screen.id !== screenId)
      .map((screen, index) => ({ ...screen, order: index + 1 }))

    setInteractive({
      ...interactive,
      screens: updatedScreens
    })

    if (selectedScreen?.id === screenId) {
      setSelectedScreen(updatedScreens[0])
    }
  }

  const moveScreen = (screenId: string, direction: 'up' | 'down') => {
    const screenIndex = interactive.screens.findIndex(screen => screen.id === screenId)
    if (
      (direction === 'up' && screenIndex === 0) ||
      (direction === 'down' && screenIndex === interactive.screens.length - 1)
    ) return

    const newScreens = [...interactive.screens]
    const targetIndex = direction === 'up' ? screenIndex - 1 : screenIndex + 1

    // Swap screens
    [newScreens[screenIndex], newScreens[targetIndex]] = [newScreens[targetIndex], newScreens[screenIndex]]

    // Update order
    newScreens.forEach((screen, index) => {
      screen.order = index + 1
    })

    setInteractive({
      ...interactive,
      screens: newScreens
    })
  }

  const updateScreen = (screenId: string, updates: Partial<Screen>) => {
    const updatedScreens = interactive.screens.map(screen =>
      screen.id === screenId ? { ...screen, ...updates } : screen
    )

    setInteractive({
      ...interactive,
      screens: updatedScreens
    })

    if (selectedScreen?.id === screenId) {
      setSelectedScreen({ ...selectedScreen, ...updates })
    }
  }

  const updateInteractive = (updates: Partial<Interactive>) => {
    setInteractive({
      ...interactive,
      ...updates
    })
  }

  const renderScreenEditor = () => {
    if (!selectedScreen) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Edit Screen {selectedScreen.order}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => moveScreen(selectedScreen.id, 'up')}
              disabled={selectedScreen.order === 1}
              className="p-2 rounded-lg bg-glass-light hover:bg-glass-dark transition-colors disabled:opacity-50"
            >
              <MoveUp className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => moveScreen(selectedScreen.id, 'down')}
              disabled={selectedScreen.order === interactive.screens.length}
              className="p-2 rounded-lg bg-glass-light hover:bg-glass-dark transition-colors disabled:opacity-50"
            >
              <MoveDown className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => deleteScreen(selectedScreen.id)}
              disabled={interactive.screens.length <= 1}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Screen Type</label>
            <select
              value={selectedScreen.type}
              onChange={(e) => updateScreen(selectedScreen.id, { type: e.target.value as any })}
              className="glass-input w-full"
            >
              <option value="start">Start Screen</option>
              <option value="intro">Introduction</option>
              <option value="video">Video</option>
              <option value="content">Content</option>
              <option value="completion">Completion</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={selectedScreen.title}
              onChange={(e) => updateScreen(selectedScreen.id, { title: e.target.value })}
              className="glass-input w-full"
              placeholder="Enter screen title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
            <textarea
              value={selectedScreen.content}
              onChange={(e) => updateScreen(selectedScreen.id, { content: e.target.value })}
              className="glass-input w-full h-32 resize-none"
              placeholder="Enter screen content..."
            />
          </div>

          {selectedScreen.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Video URL</label>
              <input
                type="text"
                value={selectedScreen.videoUrl || ''}
                onChange={(e) => updateScreen(selectedScreen.id, { videoUrl: e.target.value })}
                className="glass-input w-full"
                placeholder="Enter video URL..."
              />
            </div>
          )}

          {selectedScreen.type === 'completion' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quote</label>
                <input
                  type="text"
                  value={selectedScreen.quote || ''}
                  onChange={(e) => updateScreen(selectedScreen.id, { quote: e.target.value })}
                  className="glass-input w-full"
                  placeholder="Enter inspirational quote..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                <input
                  type="text"
                  value={selectedScreen.author || ''}
                  onChange={(e) => updateScreen(selectedScreen.id, { author: e.target.value })}
                  className="glass-input w-full"
                  placeholder="Enter quote author..."
                />
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,219,255,0.2)_0%,transparent_50%)]"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="glass-panel mx-6 mt-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg bg-glass-light hover:bg-glass-dark transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Interactive Editor</h1>
                <p className="text-gray-300">Create and manage your learning experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="glass-button flex items-center space-x-2"
              >
                <Eye className="w-5 h-5" />
                <span>{isPreviewMode ? 'Edit Mode' : 'Preview'}</span>
              </button>
              <button className="glass-button flex items-center space-x-2">
                <Save className="w-5 h-5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </header>

        <div className="mx-6 mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Interactive Settings */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Interactive Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={interactive.title}
                    onChange={(e) => updateInteractive({ title: e.target.value })}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={interactive.description}
                    onChange={(e) => updateInteractive({ description: e.target.value })}
                    className="glass-input w-full h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={interactive.category}
                    onChange={(e) => updateInteractive({ category: e.target.value })}
                    className="glass-input w-full"
                  >
                    <option value="Personal Development">Personal Development</option>
                    <option value="Communication">Communication</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Innovation">Innovation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={interactive.status}
                    onChange={(e) => updateInteractive({ status: e.target.value as 'draft' | 'published' })}
                    className="glass-input w-full"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Screen List */}
            <div className="glass-panel p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Screens ({interactive.screens.length}/5)</h2>
                <button
                  onClick={addScreen}
                  disabled={interactive.screens.length >= 5}
                  className="p-2 rounded-lg bg-accent-purple/20 hover:bg-accent-purple/30 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 text-accent-purple" />
                </button>
              </div>
              
              <div className="space-y-2">
                {interactive.screens.map((screen) => (
                  <div
                    key={screen.id}
                    onClick={() => setSelectedScreen(screen)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedScreen?.id === screen.id 
                        ? 'bg-accent-purple/20 border border-accent-purple/40' 
                        : 'bg-glass-light hover:bg-glass-dark'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-glass-dark flex items-center justify-center">
                        {screen.type === 'start' && <CheckCircle className="w-4 h-4 text-accent-green" />}
                        {screen.type === 'intro' && <FileText className="w-4 h-4 text-accent-blue" />}
                        {screen.type === 'video' && <Video className="w-4 h-4 text-accent-purple" />}
                        {screen.type === 'content' && <FileText className="w-4 h-4 text-accent-orange" />}
                        {screen.type === 'completion' && <CheckCircle className="w-4 h-4 text-accent-green" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">{screen.title}</div>
                        <div className="text-gray-400 text-xs capitalize">{screen.type}</div>
                      </div>
                      <div className="text-gray-500 text-xs">#{screen.order}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Screen Editor */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-6">
              {selectedScreen ? (
                renderScreenEditor()
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a screen to edit</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
