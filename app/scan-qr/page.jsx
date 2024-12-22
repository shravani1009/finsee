'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import TransactionAlert from '../components/TransactionAlert'
import PaymentAuth from '../components/PaymentAuth'

export default function ScanQRPage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [amount, setAmount] = useState('')
  const [isScanning, setIsScanning] = useState(false)
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
      const welcomeMessage = `Welcome to QR code scanning. You can say 'scan' to start scanning, 
        'confirm' to proceed with payment once amount is detected, or 'help' for available commands.`
      
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
      speak("Available commands are: scan QR code, confirm payment, or go back")
      return
    }

    // Back command
    if (lowerCommand.includes('go back')) {
      speak("Going back to home")
      router.back()
      return
    }

    // Scan command
    if (lowerCommand.includes('scan')) {
      if (!isScanning) {
        speak("Starting QR code scan")
        handleScanClick()
      } else {
        speak("Already scanning QR code")
      }
      return
    }

    // Confirm payment command
    if (lowerCommand.includes('confirm')) {
      if (amount) {
        speak("Opening payment authentication")
        setShowAuth(true)
      } else {
        speak("Please scan a QR code first")
      }
      return
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

  const handleScanClick = () => {
    setIsScanning(true)
    speak("Scanning QR code")
    // Simulate QR code scanning
    setTimeout(() => {
      setAmount('1000') // Simulated amount from QR code
      setIsScanning(false)
      setShowAuth(true)
      speak("QR code detected. Amount is 1000. Say confirm to proceed with payment")
    }, 1500)
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

        {/* Voice Command Transcript */}
        {transcript && (
          <div className="w-full rounded-md border p-4 bg-white mb-4">
            <p className="text-sm font-medium">Last command:</p>
            <p className="text-sm text-gray-600">{transcript}</p>
          </div>
        )}

        <div className="bg-blue-600 rounded-lg p-8 text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Scan QR Code</h1>
          <div 
            onClick={handleScanClick}
            className="bg-white p-4 rounded-lg mb-4 aspect-square max-w-sm mx-auto cursor-pointer"
          >
            <div className="border-2 border-blue-600 h-full rounded-md flex flex-col items-center justify-center relative">
              {isScanning ? (
                <div className="animate-pulse">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  <p className="text-blue-600 mt-2">Scanning...</p>
                </div>
              ) : (
                <>
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-blue-600 mt-2">Click to scan or say "scan"</p>
                </>
              )}
              {/* Scanning animation corners */}
              {isScanning && (
                <>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500"></div>
                </>
              )}
            </div>
          </div>
          <p className="text-sm">
            {isScanning ? 'Scanning QR code...' : 'Say "scan" or click to scan QR code'}
          </p>
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