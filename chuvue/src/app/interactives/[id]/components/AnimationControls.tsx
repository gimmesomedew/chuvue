'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface Touchpoint {
  id: string
  title: string
  description: string
  duration: string
  type: string
  video_url: string
  order_index: number
  animation_effect?: string
  animation_speed?: number
  animation_delay?: number
  animation_easing?: string
  animation_duration?: number
}

interface AnimationControlsProps {
  currentTouchpoint: Touchpoint
  onUpdateTouchpoint: (updates: Partial<Touchpoint>) => void
  onResetAnimation: () => void
}

// Animation configuration constants
const ANIMATION_EFFECTS = [
  { value: 'typewriter', label: 'Typewriter' },
  { value: 'fade', label: 'Fade In' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'zoom', label: 'Zoom In' },
  { value: 'stagger', label: 'Stagger' }
]

const EASING_OPTIONS = [
  { value: 'easeOut', label: 'Ease Out' },
  { value: 'easeIn', label: 'Ease In' },
  { value: 'easeInOut', label: 'Ease In Out' },
  { value: 'linear', label: 'Linear' },
  { value: 'anticipate', label: 'Anticipate' }
]

const ANIMATION_RANGES = {
  speed: { min: 10, max: 500, step: 10, default: 90 },
  delay: { min: 0, max: 5000, step: 100, default: 1400 },
  duration: { min: 500, max: 10000, step: 500, default: 3000 }
}

export default function AnimationControls({ 
  currentTouchpoint, 
  onUpdateTouchpoint, 
  onResetAnimation 
}: AnimationControlsProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleEffectChange = (effect: string) => {
    onUpdateTouchpoint({ animation_effect: effect })
    onResetAnimation()
  }

  const handleParameterChange = (param: keyof Touchpoint, value: number | string) => {
    onUpdateTouchpoint({ [param]: value })
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // This would typically save to the backend
      // For now, we'll just simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Animation settings saved:', currentTouchpoint)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="glass-card p-6" onClick={(e) => e.stopPropagation()}>
      <h4 className="text-lg font-medium text-white mb-6 text-center">Animation Settings</h4>
      
      {/* Effect Dropdown */}
      <div className="mb-6">
        <label className="block text-sm text-gray-300 mb-3">Animation Effect</label>
        <select 
          value={currentTouchpoint.animation_effect || 'typewriter'}
          onChange={(e) => handleEffectChange(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-accent-purple"
        >
          {ANIMATION_EFFECTS.map(effect => (
            <option key={effect.value} value={effect.value}>
              {effect.label}
            </option>
          ))}
        </select>
      </div>

      {/* Speed and Delay Controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-300 mb-3">
            Speed (ms)
          </label>
          <input 
            type="number"
            min={ANIMATION_RANGES.speed.min}
            max={ANIMATION_RANGES.speed.max}
            step={ANIMATION_RANGES.speed.step}
            value={currentTouchpoint.animation_speed || ANIMATION_RANGES.speed.default}
            onChange={(e) => handleParameterChange('animation_speed', parseInt(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-accent-purple text-center"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-3">
            Delay (ms)
          </label>
          <input 
            type="number"
            min={ANIMATION_RANGES.delay.min}
            max={ANIMATION_RANGES.delay.max}
            step={ANIMATION_RANGES.delay.step}
            value={currentTouchpoint.animation_delay || ANIMATION_RANGES.delay.default}
            onChange={(e) => handleParameterChange('animation_delay', parseInt(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-accent-purple text-center"
          />
        </div>
      </div>

      {/* Duration and Easing Controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-300 mb-3">
            Duration (ms)
          </label>
          <input 
            type="number"
            min={ANIMATION_RANGES.duration.min}
            max={ANIMATION_RANGES.duration.max}
            step={ANIMATION_RANGES.duration.step}
            value={currentTouchpoint.animation_duration || ANIMATION_RANGES.duration.default}
            onChange={(e) => handleParameterChange('animation_duration', parseInt(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-accent-purple text-center"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-3">
            Easing
          </label>
          <select 
            value={currentTouchpoint.animation_easing || 'easeOut'}
            onChange={(e) => handleParameterChange('animation_easing', e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-accent-purple"
          >
            {EASING_OPTIONS.map(easing => (
              <option key={easing.value} value={easing.value}>
                {easing.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <motion.button
          onClick={onResetAnimation}
          className="glass-button flex-1 px-4 py-3 text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Preview Animation
        </motion.button>
        
        <motion.button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="glass-button bg-accent-green/20 border-accent-green/30 text-accent-green hover:bg-accent-green/30 flex-1 px-4 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!isSaving ? { scale: 1.02 } : {}}
          whileTap={!isSaving ? { scale: 0.98 } : {}}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </motion.button>
      </div>
    </div>
  )
}
