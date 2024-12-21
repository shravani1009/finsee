// context/VoiceContext.js
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const VoiceContext = createContext({})

export function VoiceProvider({ children }) {
  const router = useRouter()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    let recognition = null

    const initializeRecognition = () => {
      if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onstart = () => {
          setIsListening(true)
          console.log('Voice recognition started')
        }

        recognition.onend = () => {
          setIsListening(false)
          console.log('Voice recognition ended')
          // Restart recognition after it ends
          recognition.start()
        }

        recognition.onerror = (event) => {
          console.error('Voice recognition error:', event.error)
          if (event.error === 'no-speech') {
            // Restart recognition if no speech is detected
            recognition.stop()
            recognition.start()
          }
        }

        recognition.onresult = (event) => {
          const currentTranscript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')

          setTranscript(currentTranscript)

          // Check for wake word
          if (currentTranscript.toLowerCase().includes('hey bot')) {
            // Add user message
            const newMessage = {
              type: 'user',
              text: currentTranscript
            }
            setMessages(prev => [...prev, newMessage])
            
            // Navigate to assistant page
            router.push('/assistant')
          }

          // Process other commands when on assistant page
          if (router.pathname === '/assistant') {
            processCommand(currentTranscript)
          }
        }

        recognition.start()
      }
    }

    initializeRecognition()

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [router])

  const processCommand = (command) => {
    // Add your command processing logic here
    // Example response logic
    const assistantResponse = {
      type: 'assistant',
      text: generateResponse(command)
    }
    setMessages(prev => [...prev, assistantResponse])
  }

  const generateResponse = (command) => {
    // Add your response generation logic here
    const lowerCommand = command.toLowerCase()
    
    if (lowerCommand.includes('balance')) {
      return 'Your current balance is ₹10,000'
    }
    if (lowerCommand.includes('transaction')) {
      return 'Your last transaction was ₹500 at Shopping Mall'
    }
    return `I heard: ${command}. How can I help you?`
  }

  return (
    <VoiceContext.Provider 
      value={{ 
        isListening, 
        transcript, 
        messages,
        setMessages 
      }}
    >
      {children}
    </VoiceContext.Provider>
  )
}

export const useVoice = () => useContext(VoiceContext)
