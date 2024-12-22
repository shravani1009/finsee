'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import TransactionAlert from '../components/TransactionAlert'
import PaymentAuth from '../components/PaymentAuth'

export default function PayPhonePage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef(null)
  const initialAnnouncementMade = useRef(false)

  // Text-to-speech function
  const speak = (text) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  // Initial announcement
  useEffect(() => {
    if (!initialAnnouncementMade.current) {
      const welcomeMessage = `Welcome to phone payment. You can say 'phone' followed by a number to input phone number, 
        'amount' followed by a number to set payment amount, 'confirm' to proceed with payment, or 'help' for available commands.`
      
      setTimeout(() => {
        speak(welcomeMessage)
        initialAnnouncementMade.current = true
        startRecording()
      }, 1000)
    }
  }, [])

  // Handle voice commands
  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase()

    // Help command
    if (lowerCommand.includes('help')) {
      speak("Available commands are: phone followed by number, amount followed by number, confirm payment, or go back")
      return
    }

    // Back command
    if (lowerCommand.includes('go back')) {
      speak("Going back to home")
      router.back()
      return
    }

    // Phone number command
    if (lowerCommand.startsWith('phone')) {
      const phoneStr = lowerCommand.replace('phone', '').trim()
      const numbers = phoneStr.match(/\d+/g)
      if (numbers) {
        const phoneNum = numbers.join('')
        setPhoneNumber(phoneNum)
        speak(`Phone number set to ${phoneNum.split('').join(' ')}`)
      } else {
        speak("Please specify a valid phone number")
      }
      return
    }

    // Amount command
    if (lowerCommand.startsWith('amount')) {
      const amountStr = lowerCommand.replace('amount', '').trim()
      const numberMatch = amountStr.match(/\d+/)
      if (numberMatch) {
        const amountNum = numberMatch[0]
        setAmount(amountNum)
        speak(`Amount set to ${amountNum}`)
      } else {
        speak("Please specify a valid amount number")
      }
      return
    }

    // Confirm payment command
    if (lowerCommand.includes('confirm') && phoneNumber && amount) {
      speak("Opening payment authentication")
      setShowAuth(true)
      return
    } else if (lowerCommand.includes('confirm')) {
      speak("Please set both phone number and amount before confirming")
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    recognitionRef.current = new window.webkitSpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true

    recognitionRef.current.onstart = () => {
      console.log("Voice recognition started")
    }

    recognitionRef.current.onresult = (event) => {
      const { transcript } = event.results[event.results.length - 1][0]
      setTranscript(transcript)
      handleVoiceCommand(transcript)
    }

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsRecording(false)
      setTimeout(startRecording, 1000)
    }

    recognitionRef.current.onend = () => {
      if (isRecording) {
        recognitionRef.current.start()
      }
    }

    recognitionRef.current.start()
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      window.speechSynthesis.cancel()
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (phoneNumber && amount) {
      setShowAuth(true)
      speak("Opening payment authentication")
    }
  }

  const handleAuthSuccess = () => {
    setShowAuth(false)
    setShowSuccess(true)
    speak("Payment successful")
    setTimeout(() => {
      setShowSuccess(false)
      router.push('/home')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {showSuccess && <TransactionAlert amount={amount} />}
      {showAuth && (
        <PaymentAuth 
          amount={amount}
          onSuccess={handleAuthSuccess}
          onCancel={() => {
            setShowAuth(false)
            speak("Payment cancelled")
          }}
        />
      )}
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-600 flex items-center"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-6">Pay via Phone Number</h1>
          
          {/* Voice Command Transcript */}
          {transcript && (
            <div className="w-full rounded-md border p-4 bg-white mb-4">
              <p className="text-sm font-medium">Last command:</p>
              <p className="text-sm text-gray-600">{transcript}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number or say 'phone' followed by number..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount or say 'amount' followed by number..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Proceed to Pay
            </button>
          </form>
        </div>

        {/* Microphone Control */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center ${
              isRecording ? 'bg-red-400 hover:bg-red-500' : 'bg-blue-400 hover:bg-blue-500'
            } rounded-full w-16 h-16 focus:outline-none`}
          >
            {isRecording ? (
              <svg className="h-8 w-8" viewBox="0 0 24 24">
                <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 256 256" className="w-8 h-8 text-white">
                <path
                  fill="currentColor"
                  d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}