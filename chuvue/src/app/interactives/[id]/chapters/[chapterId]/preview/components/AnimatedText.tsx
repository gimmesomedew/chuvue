'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  effect?: string
  speed?: number
  delay?: number
  easing?: string
  duration?: number
  onComplete?: () => void
}

// Helper function to convert string easing to Framer Motion easing
const getEasingFunction = (easing: string) => {
  switch (easing) {
    case 'easeOut':
      return 'easeOut'
    case 'easeIn':
      return 'easeIn'
    case 'easeInOut':
      return 'easeInOut'
    case 'linear':
      return 'linear'
    case 'anticipate':
      return 'anticipate'
    default:
      return 'easeOut'
  }
}

export default function AnimatedText({ 
  text, 
  effect = 'typewriter',
  speed = 90,
  delay = 1400,
  easing = 'easeOut',
  duration = 3000,
  onComplete 
}: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!text) return

    setIsAnimating(true)
    setDisplayedText('')
    setCurrentIndex(0)

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= text.length) {
            clearInterval(interval)
            setIsAnimating(false)
            onComplete?.()
            return prev
          }
          setDisplayedText(text.slice(0, prev + 1))
          return prev + 1
        })
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [text, speed, delay, onComplete])

  const renderText = () => {
    const easingFunction = getEasingFunction(easing)
    
    switch (effect) {
      case 'typewriter':
        return (
          <motion.span 
            className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {displayedText}
            {isAnimating && (
              <motion.span
                className="inline-block w-0.5 h-6 bg-accent-purple ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.span>
        )
      
      case 'fade':
        return (
          <motion.span 
            className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration / 1000, ease: easingFunction }}
          >
            {displayedText}
          </motion.span>
        )
      
      case 'slide-up':
        return (
          <motion.span 
            className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration / 1000, ease: easingFunction }}
          >
            {displayedText}
          </motion.span>
        )
      
      case 'zoom':
        return (
          <motion.span 
            className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: duration / 1000, ease: easingFunction }}
          >
            {displayedText}
          </motion.span>
        )
      
      case 'stagger':
        return (
          <span className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            {displayedText}
          </span>
        )
      
      default:
        return (
          <span className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            {displayedText}
          </span>
        )
    }
  }

  return (
    <div className="relative">
      {renderText()}
    </div>
  )
}
