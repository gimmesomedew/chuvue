'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Copy, Mail, MessageSquare, Link, Check } from 'lucide-react'
import { useState } from 'react'
import type { Chapter } from '../../../../types/chapter'

interface ShareLinkProps {
  chapter: Chapter
  interactiveId: string
  isOpen: boolean
  onClose: () => void
}

export default function ShareLink({ chapter, interactiveId, isOpen, onClose }: ShareLinkProps) {
  const [copied, setCopied] = useState(false)
  const [shareMethod, setShareMethod] = useState<'link' | 'email' | 'sms'>('link')

  // Generate a shareable link with the interactive ID and chapter ID
  const generateShareLink = () => {
    const baseUrl = window.location.origin
    const shareUrl = `${baseUrl}/interactives/${interactiveId}/chapters/${chapter.id}/preview`
    return shareUrl
  }

  const shareLink = generateShareLink()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Review Chapter: ${chapter.title}`)
    const body = encodeURIComponent(
      `Hi,\n\nI'd like you to review this chapter: ${chapter.title}\n\n` +
      `Description: ${chapter.description}\n\n` +
      `You can view it here: ${shareLink}\n\n` +
      `This chapter contains ${chapter.touchpoint_count || 0} learning screens and should take approximately ${Math.round((chapter.touchpoint_count || 0) * 2.5)} minutes to complete.\n\n` +
      `Thanks!`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaSMS = () => {
    const message = encodeURIComponent(
      `Review Chapter: ${chapter.title}\n\n` +
      `View here: ${shareLink}\n\n` +
      `${chapter.touchpoint_count || 0} screens, ~${Math.round((chapter.touchpoint_count || 0) * 2.5)} mins`
    )
    window.open(`sms:?body=${message}`)
  }

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `Review Chapter: ${chapter.title}\n\n` +
      `View here: ${shareLink}\n\n` +
      `${chapter.touchpoint_count || 0} screens, ~${Math.round((chapter.touchpoint_count || 0) * 2.5)} mins`
    )
    window.open(`https://wa.me/?text=${message}`)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card max-w-lg w-full p-6"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-accent-purple/20 text-accent-purple">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">Share Chapter</h3>
            </div>
            <motion.button
              onClick={onClose}
              className="glass-button p-2 text-gray-400 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Chapter Info */}
          <div className="mb-6 p-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
            <h4 className="font-semibold text-white mb-2">{chapter.title}</h4>
            <p className="text-gray-300 text-sm mb-2">{chapter.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>{chapter.touchpoint_count || 0} screens</span>
              <span>~{Math.round((chapter.touchpoint_count || 0) * 2.5)} minutes</span>
              <span className="capitalize">{chapter.difficulty || 'Beginner'}</span>
            </div>
          </div>

          {/* Share Link */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Shareable Link
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="glass-input w-full p-3 pr-10 text-white text-sm"
                />
                <Link className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <motion.button
                onClick={copyToClipboard}
                className="glass-button px-4 py-3 text-accent-purple hover:text-white whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
              </motion.button>
            </div>
          </div>

          {/* Share Methods */}
          <div className="space-y-3">
            <motion.button
              onClick={shareViaEmail}
              className="w-full glass-button bg-accent-blue/20 border-accent-blue/30 text-accent-blue hover:bg-accent-blue/30 py-3 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mail className="w-4 h-4" />
              <span>Share via Email</span>
            </motion.button>
            
            <motion.button
              onClick={shareViaSMS}
              className="w-full glass-button bg-accent-green/20 border-accent-green/30 text-accent-green hover:bg-accent-green/30 py-3 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share via SMS</span>
            </motion.button>

            <motion.button
              onClick={shareViaWhatsApp}
              className="w-full glass-button bg-green-600/20 border-green-600/30 text-green-400 hover:bg-green-600/30 py-3 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>Share via WhatsApp</span>
            </motion.button>
          </div>

          {/* Info */}
          <div className="mt-6 p-3 rounded-lg bg-gray-800/20 border border-gray-700/20">
            <p className="text-xs text-gray-400 text-center">
              Recipients can view this chapter using the shareable link above
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
