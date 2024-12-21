
// app/assistant/page.js
'use client'

import { useSpeech } from '../../context/SpeechContext'
import { useEffect, useRef } from 'react'

export default function AssistantPage() {
  const { isListening, messages } = useSpeech()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          {/* Messages */}
          <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-100 ml-auto' 
                    : 'bg-gray-100'
                } max-w-[80%] ${
                  message.type === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <p className="text-sm text-gray-600 mb-1">
                  {message.type === 'user' ? 'You' : 'Assistant'}
                </p>
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Status */}
          <div className="text-center p-4 border-t">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              isListening ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
            }`}>
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                />
              </svg>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {isListening ? 'Listening...' : 'Microphone inactive'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
