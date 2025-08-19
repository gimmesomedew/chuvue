'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Brain,
  CheckCircle,
  Quote
} from 'lucide-react'

interface Screen {
  id: string
  type: 'start' | 'intro' | 'video' | 'content' | 'completion'
  title: string
  content: string
  videoUrl?: string
  quote?: string
  author?: string
}

interface Interactive {
  id: string
  title: string
  description: string
  screens: Screen[]
}

export default function InteractiveViewer({ params }: { params: { id: string } }) {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  // Mock data - in real app this would come from API
  const interactive: Interactive = {
    id: params.id,
    title: 'Master Coachability',
    description: 'Develop your ability to receive feedback, adapt, and grow through interactive learning experiences designed for teens and young adults.',
    screens: [
      {
        id: '1',
        type: 'start',
        title: 'Master Coachability',
        content: 'Develop your ability to receive feedback, adapt, and grow through interactive learning experiences designed for teens and young adults.'
      },
      {
        id: '2',
        type: 'intro',
        title: 'Welcome to Your Learning Journey',
        content: 'In this module, you\'ll discover the key principles of coachability and how they can transform your personal and professional growth. Get ready to explore active listening, growth mindset, and practical strategies for receiving feedback effectively.'
      },
      {
        id: '3',
        type: 'video',
        title: 'Understanding Coachability',
        content: 'Watch this short video to learn the fundamentals of coachability and why it\'s essential for success.',
        videoUrl: '/sample-video.mp4'
      },
      {
        id: '4',
        type: 'content',
        title: 'Key Principles',
        content: 'Coachability is built on three core principles: openness to feedback, willingness to change, and commitment to growth. These principles work together to create a mindset that embraces learning and development.'
      },
      {
        id: '5',
        type: 'completion',
        title: 'Congratulations!',
        content: 'You\'ve successfully completed the Master Coachability module. You now have the foundation to become more coachable and open to growth opportunities.',
        quote: 'The only way to grow is to be coachable.',
        author: 'John Maxwell'
      }
    ]
  }

  const currentScreen = interactive.screens[currentScreenIndex]
  const totalScreens = interactive.screens.length

  const goToNext = () => {
    if (currentScreenIndex < totalScreens - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1)
    }
  }

  const goToPrevious = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(currentScreenIndex - 1)
    }
  }

  const renderScreen = () => {
    switch (currentScreen.type) {
      case 'start':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-accent-purple to-primary-500 rounded-full flex items-center justify-center mx-auto">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">{currentScreen.title}</h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
              {currentScreen.content}
            </p>
            <button 
              onClick={goToNext}
              className="glass-button flex items-center space-x-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              <span>Start Learning Journey</span>
            </button>
          </div>
        )

      case 'intro':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white text-center">{currentScreen.title}</h1>
            <div className="glass-card p-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                {currentScreen.content}
              </p>
            </div>
            <div className="text-center">
              <button 
                onClick={goToNext}
                className="glass-button flex items-center space-x-2 mx-auto"
              >
                <span>Continue</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white text-center">{currentScreen.title}</h1>
            <div className="glass-card p-6">
              <p className="text-gray-300 text-sm mb-4">{currentScreen.content}</p>
              
              {/* Video Player Placeholder */}
              <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-white text-sm">Video Player</p>
                    <p className="text-gray-400 text-xs">2:00 duration</p>
                  </div>
                </div>
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    
                    <div className="flex-1 bg-white/20 rounded-full h-2">
                      <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    
                    <span className="text-white text-sm">{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
                    
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={goToNext}
                className="glass-button flex items-center space-x-2 mx-auto"
              >
                <span>Continue</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )

      case 'content':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white text-center">{currentScreen.title}</h1>
            <div className="glass-card p-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                {currentScreen.content}
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={goToPrevious}
                className="glass-button flex items-center space-x-2"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>
              
              <button 
                onClick={goToNext}
                className="glass-button flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )

      case 'completion':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-accent-green to-primary-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white">{currentScreen.title}</h1>
            
            <div className="glass-card p-6">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {currentScreen.content}
              </p>
              
              {currentScreen.quote && (
                <div className="border-l-4 border-accent-purple pl-4">
                  <Quote className="w-8 h-8 text-accent-purple mb-2" />
                  <blockquote className="text-white text-lg italic">
                    "{currentScreen.quote}"
                  </blockquote>
                  {currentScreen.author && (
                    <cite className="text-accent-purple text-sm">— {currentScreen.author}</cite>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setCurrentScreenIndex(0)}
              className="glass-button flex items-center space-x-2 mx-auto"
            >
              <span>Start Over</span>
            </button>
          </div>
        )

      default:
        return null
    }
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
        <header className="glass-panel mx-4 mt-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">LearnFlow</h1>
                <p className="text-gray-300 text-sm">{interactive.title}</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="text-center">
              <div className="text-white text-sm font-medium">
                {currentScreenIndex + 1} of {totalScreens}
              </div>
              <div className="flex space-x-1 mt-1">
                {interactive.screens.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index <= currentScreenIndex ? 'bg-primary-500' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-4 mt-4 p-6">
          <div className="glass-panel p-6 min-h-[60vh] flex items-center justify-center">
            {renderScreen()}
          </div>
        </main>

        {/* Navigation Footer */}
        {currentScreen.type !== 'start' && currentScreen.type !== 'completion' && (
          <footer className="fixed bottom-0 left-0 right-0 p-4">
            <div className="glass-panel p-4">
              <div className="flex justify-between items-center">
                <button 
                  onClick={goToPrevious}
                  disabled={currentScreenIndex === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentScreenIndex === 0 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-white hover:bg-glass-light'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>
                
                <div className="text-center">
                  <div className="text-white text-sm">
                    Screen {currentScreenIndex + 1} of {totalScreens}
                  </div>
                </div>
                
                <button 
                  onClick={goToNext}
                  disabled={currentScreenIndex === totalScreens - 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentScreenIndex === totalScreens - 1 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-white hover:bg-glass-light'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}
