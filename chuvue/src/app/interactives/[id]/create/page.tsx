'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../../components/Sidebar'
import { 
  ArrowLeft,
  GraduationCap,
  Save,
  Rocket,
  Plus,
  Edit,
  Trash2,
  Play,
  Video,
  Activity,
  BookOpen,
  Clock,
  Target
} from 'lucide-react'

interface Touchpoint {
  id: string
  number: number
  title: string
  description: string
  duration: string
  type: 'Video' | 'Interactive' | 'Content'
  typeIcon: any
  typeColor: string
}

export default function CreateChapterPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  const [chapterTitle, setChapterTitle] = useState('Growth vs Fixed Mindset')
  const [chapterDescription, setChapterDescription] = useState('Interactive scenarios exploring mindset differences for teens.')
  const [duration, setDuration] = useState('15-20 mins.')
  const [difficulty, setDifficulty] = useState('Beginner')

  const [touchpoints, setTouchpoints] = useState<Touchpoint[]>([
    {
      id: '1',
      number: 1,
      title: 'Introduction',
      description: 'Welcome students and introduce the concept of mindset.',
      duration: '2 mins',
      type: 'Video',
      typeIcon: Video,
      typeColor: 'text-green-400'
    },
    {
      id: '2',
      number: 2,
      title: 'Fixed Mindset Scenario',
      description: 'Interactive scenario showing fixed mindset responses.',
      duration: '4 mins',
      type: 'Interactive',
      typeIcon: Activity,
      typeColor: 'text-blue-400'
    },
    {
      id: '3',
      number: 3,
      title: 'Growth Mindset Scenario',
      description: 'Interactive scenario showing growth mindset responses.',
      duration: '4 mins',
      type: 'Interactive',
      typeIcon: Activity,
      typeColor: 'text-purple-400'
    }
  ])

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const addTouchpoint = () => {
    const newTouchpoint: Touchpoint = {
      id: Date.now().toString(),
      number: touchpoints.length + 1,
      title: 'New Touchpoint',
      description: 'Add description for this touchpoint.',
      duration: '2 mins',
      type: 'Content',
      typeIcon: BookOpen,
      typeColor: 'text-orange-400'
    }
    setTouchpoints([...touchpoints, newTouchpoint])
  }

  const deleteTouchpoint = (id: string) => {
    setTouchpoints(touchpoints.filter(tp => tp.id !== id))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return Video
      case 'Interactive':
        return Activity
      case 'Content':
        return BookOpen
      default:
        return BookOpen
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Video':
        return 'text-green-400'
      case 'Interactive':
        return 'text-blue-400'
      case 'Content':
        return 'text-orange-400'
      default:
        return 'text-gray-400'
    }
  }

  const getNumberColor = (number: number) => {
    const colors = [
      'bg-green-500',
      'bg-blue-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-red-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ]
    return colors[(number - 1) % colors.length]
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Enhanced Background Pattern with Glass Morphism */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.15)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.15)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_60%,rgba(245,158,11,0.08)_0%,transparent_50%)]"></div>
      </div>

      {/* Floating Orbs for Enhanced Glass Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent-purple/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-accent-green/10 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-accent-blue/10 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <div className="relative z-10">
          
          {/* Top Header Bar */}
          <motion.div 
            className="flex items-center justify-between p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left Side - Back Button and Module Info */}
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => router.back()}
                className="glass-hover p-2 rounded-lg"
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </motion.button>
              
              <div className="flex items-center space-x-3">
                <div className="glass-hover p-2 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-accent-purple" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{chapterTitle}</h1>
                  <p className="text-gray-400 text-sm">Chapter Creation</p>
                </div>
              </div>
            </div>

            {/* Right Side - Action Buttons and User Avatar */}
            <div className="flex items-center space-x-4">
              <motion.button
                className="glass-button bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30 px-4 py-2 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </motion.button>
              
              <motion.button
                className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 px-4 py-2 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket className="w-4 h-4" />
                <span>Publish</span>
              </motion.button>

              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-accent-green to-primary-500 rounded-full flex items-center justify-center glass-hover"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white font-bold text-sm">S</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="px-6 grid grid-cols-1 lg:grid-cols-10 gap-8 mb-8">
            
            {/* Left Panel - Chapter Details */}
            <div className="lg:col-span-5">
              <motion.div 
                className="glass-panel p-6"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Chapter Details</h2>
                  <p className="text-gray-400">Configure your interactive learning touchpoints.</p>
                </div>

                {/* Chapter Title */}
                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">Chapter Title</label>
                  <input
                    type="text"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    className="glass-input w-full p-3 text-white placeholder-gray-400"
                    placeholder="Enter chapter title"
                  />
                </div>

                {/* Chapter Description */}
                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">Description</label>
                  <textarea
                    value={chapterDescription}
                    onChange={(e) => setChapterDescription(e.target.value)}
                    rows={3}
                    className="glass-input w-full p-3 text-white placeholder-gray-400 resize-none"
                    placeholder="Enter chapter description"
                  />
                </div>

                {/* Duration & Difficulty */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="glass-input w-full p-3 text-white placeholder-gray-400"
                      placeholder="e.g., 15-20 mins."
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="glass-input w-full p-3 text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Touchpoints Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Touchpoints</h3>
                    <motion.button
                      onClick={addTouchpoint}
                      className="glass-button bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30 px-4 py-2 flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Touchpoint</span>
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {touchpoints.map((touchpoint) => (
                      <motion.div
                        key={touchpoint.id}
                        className="glass-card p-4"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -2, scale: 1.01 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${getNumberColor(touchpoint.number)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                            {touchpoint.number}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">{touchpoint.title}</h4>
                            <p className="text-gray-400 text-sm mb-2">{touchpoint.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{touchpoint.duration}</span>
                              </span>
                              <span className={`flex items-center space-x-1 ${getTypeColor(touchpoint.type)}`}>
                                <touchpoint.typeIcon className="w-3 h-3" />
                                <span>{touchpoint.type}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <motion.button
                              className="glass-hover p-2 rounded-lg"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </motion.button>
                            <motion.button
                              onClick={() => deleteTouchpoint(touchpoint.id)}
                              className="glass-hover p-2 rounded-lg"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Panel - Live Preview */}
            <div className="lg:col-span-5">
              <motion.div 
                className="glass-panel p-6"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Live Preview</h2>
                  <p className="text-gray-400">See how your chapter will look to students.</p>
                </div>

                <div className="space-y-6">
                  {touchpoints.map((touchpoint, index) => (
                    <motion.div
                      key={touchpoint.id}
                      className="glass-card p-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ y: -2, scale: 1.01 }}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-8 h-8 ${getNumberColor(touchpoint.number)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                          {touchpoint.number}
                        </div>
                        <h3 className="text-white font-semibold">{touchpoint.title}</h3>
                      </div>

                      {touchpoint.type === 'Video' && (
                        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg h-32 flex items-center justify-center mb-3">
                          <motion.div 
                            className="glass-hover p-4 rounded-full"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <Play className="w-8 h-8 text-white" />
                          </motion.div>
                        </div>
                      )}

                      {touchpoint.type === 'Interactive' && (
                        <div className="space-y-3">
                          <p className="text-white text-sm">
                            {touchpoint.number === 2 
                              ? "You failed your math test. What do you think?"
                              : "Same situation, different mindset. What would you think?"
                            }
                          </p>
                          <div className="space-y-2">
                            <button className="w-full p-3 text-left glass-button bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30">
                              "I'm just not good at math"
                            </button>
                            {touchpoint.number === 2 && (
                              <>
                                <button className="w-full p-3 text-left glass-button hover:bg-accent-green/20 hover:border-accent-green/30 hover:text-accent-green">
                                  "I need to study harder next time"
                                </button>
                                <button className="w-full p-3 text-left glass-button hover:bg-accent-green/20 hover:border-accent-green/30 hover:text-accent-green">
                                  "I can learn from this mistake"
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {touchpoint.type === 'Content' && (
                        <div className="space-y-3">
                          <p className="text-white text-sm">
                            Welcome to exploring mindsets! Let's discover how our beliefs about abilities can shape our success.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
