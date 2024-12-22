'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import TransactionAlert from '../components/TransactionAlert'
import PaymentAuth from '../components/PaymentAuth'
import Fuse from 'fuse.js'

export default function BankTransferPage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [processingCommand, setProcessingCommand] = useState(false)
  const recognitionRef = useRef(null)
  const initialAnnouncementMade = useRef(false)
  const paymentAuthRef = useRef(null)

  const [formData, setFormData] = useState({
    bank: '',
    accountNumber: '',
    amount: '',
    description: ''
  })

  // Available banks for validation
  const availableBanks = {
    'america': 'Bank of America',
    'chase': 'Chase',
    'wells': 'Wells Fargo'
  }

  // Command patterns with fuzzy matching
  const commandPatterns = {
    transfer: [
      /transfer\s+(\d+(?:\.\d{2})?)\s+(?:dollars?\s+)?(?:to\s+)?(\w+)\s+(?:bank\s+)?(?:account\s+)?(\d+)/i,
      /send\s+(\d+(?:\.\d{2})?)\s+(?:dollars?\s+)?(?:to\s+)?(\w+)\s+(?:bank\s+)?(?:account\s+)?(\d+)/i,
    ],
    amount: /(\d+(?:\.\d{2})?)\s+dollars?/i,
    accountNumber: /account\s+(\d+)/i,
    bank: new Fuse(Object.values(availableBanks), {
      threshold: 0.4,
      keys: ['name']
    })
  }

  // Speech synthesis queue management
  const speechQueue = useRef([])
  const isSpeaking = useRef(false)

  const speak = (text, priority = false) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.1
      utterance.pitch = 1
      
      utterance.onend = () => {
        isSpeaking.current = false
        if (speechQueue.current.length > 0) {
          const nextText = speechQueue.current.shift()
          speak(nextText)
        }
        resolve()
      }

      if (priority) {
        window.speechSynthesis.cancel()
        speechQueue.current = []
        window.speechSynthesis.speak(utterance)
        isSpeaking.current = true
      } else if (isSpeaking.current) {
        speechQueue.current.push(text)
      } else {
        window.speechSynthesis.speak(utterance)
        isSpeaking.current = true
      }
    })
  }

  // Process complete transfer statements
  const processCompleteStatement = (statement) => {
    const lowerStatement = statement.toLowerCase()

    for (const pattern of commandPatterns.transfer) {
      const match = lowerStatement.match(pattern)
      if (match) {
        const [_, amount, bankInput, accountNumber] = match
        
        // Find closest matching bank
        const bankResult = commandPatterns.bank.search(bankInput)[0]
        if (bankResult) {
          const bankName = bankResult.item

          setFormData(prev => ({
            ...prev,
            amount,
            bank: bankName,
            accountNumber
          }))

          speak(`I understood: Transfer ${amount} dollars to ${bankName} account ${accountNumber}. Is this correct?`)
          return true
        }
      }
    }

    return false
  }

  // Voice command handler
  const handleVoiceCommand = async (command) => {
    if (processingCommand) return
    setProcessingCommand(true)

    try {
      const lowerCommand = command.toLowerCase()

      // Cancel command
      if (lowerCommand.includes('cancel') || lowerCommand.includes('stop')) {
        setFormData({
          bank: '',
          accountNumber: '',
          amount: '',
          description: ''
        })
        speak("Transfer cancelled. Starting over.")
        setProcessingCommand(false)
        return
      }

      // Try to process complete statement first
      if (processCompleteStatement(command)) {
        setProcessingCommand(false)
        return
      }

      // Handle confirmation
      if (lowerCommand.includes('confirm') || lowerCommand.includes('yes') || 
          lowerCommand.includes('correct')) {
        if (formData.bank && formData.accountNumber && formData.amount) {
          await speak("Great! Proceeding to authentication.")
          setShowAuth(true)
        } else {
          const missing = []
          if (!formData.bank) missing.push('bank')
          if (!formData.accountNumber) missing.push('account number')
          if (!formData.amount) missing.push('amount')
          speak(`Please provide the following information first: ${missing.join(', ')}`)
        }
        setProcessingCommand(false)
        return
      }

      // Help command
      if (lowerCommand.includes('help')) {
        speak(`Here are some things you can say:
          For a complete transfer: "Transfer 100 dollars to Chase account 12345"
          Or "Send 50 dollars to Bank of America account 67890"
          You can also say:
          "What's the status" to hear current details,
          "Cancel" to start over,
          or "Confirm" when ready to proceed.`)
        return
      }

      // Status command
      if (lowerCommand.includes('status')) {
        const status = []
        if (formData.bank) status.push(`Bank is ${formData.bank}`)
        if (formData.accountNumber) status.push(`Account number is ${formData.accountNumber}`)
        if (formData.amount) status.push(`Amount is ${formData.amount} dollars`)
        if (formData.description) status.push(`Description is ${formData.description}`)
        
        speak(status.length > 0 
          ? `Current transfer details: ${status.join(', ')}` 
          : 'No transfer details have been set yet')
        return
      }

    } catch (error) {
      console.error('Error processing voice command:', error)
      speak("I didn't quite catch that. Please try again or say 'help' for assistance.")
    } finally {
      setProcessingCommand(false)
    }
  }

    // Initial welcome message
    useEffect(() => {
      if (!initialAnnouncementMade.current) {
        const welcomeMessage = `Welcome to bank transfer. 
          You can say complete commands like 
          'Transfer 100 dollars to Chase account 12345' 
          or 'Send 50 dollars to Bank of America account 67890'.
          You can also say 'help' for more options.
          What would you like to do?`
        
        setTimeout(() => {
          speak(welcomeMessage, true)
          initialAnnouncementMade.current = true
          startRecording()
        }, 1000)
      }
    }, [])
  
    // Improved speech recognition setup
    const startRecording = () => {
      try {
        setIsRecording(true)
        recognitionRef.current = new window.webkitSpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'
  
        recognitionRef.current.onresult = (event) => {
          const lastResult = event.results[event.results.length - 1]
          const transcript = lastResult[0].transcript
          
          if (lastResult.isFinal) {
            setTranscript(transcript)
            handleVoiceCommand(transcript)
          }
        }
  
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          if (event.error === 'no-speech') {
            speak("I'm listening but didn't hear anything. Please try again.")
          } else {
            speak("There was an error with voice recognition. Restarting...")
          }
          restartRecognition()
        }
  
        recognitionRef.current.onend = () => {
          if (isRecording) {
            restartRecognition()
          }
        }
  
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        speak("Sorry, voice recognition isn't available. Please use the form instead.")
      }
    }
  
    // Helper function to restart recognition
    const restartRecognition = () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.error('Error stopping recognition:', e)
        }
        setTimeout(() => {
          if (isRecording) {
            try {
              recognitionRef.current.start()
            } catch (e) {
              console.error('Error restarting recognition:', e)
              setIsRecording(false)
            }
          }
        }, 100)
      }
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
  
    // Form handlers
    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  
    const handleSubmit = (e) => {
      e.preventDefault()
      if (formData.bank && formData.accountNumber && formData.amount) {
        speak("Please authenticate your payment")
        setShowAuth(true)
      } else {
        const missing = []
        if (!formData.bank) missing.push('bank')
        if (!formData.accountNumber) missing.push('account number')
        if (!formData.amount) missing.push('amount')
        speak(`Please fill in the following required fields: ${missing.join(', ')}`)
      }
    }
  
    const handleAuthSuccess = () => {
      setShowAuth(false)
      setShowSuccess(true)
      speak(`Successfully transferred ${formData.amount} dollars. Redirecting to home page.`)
      setTimeout(() => {
        setShowSuccess(false)
        router.push('/home')
      }, 3000)
    }
  
    return (
      <div className="min-h-screen bg-white p-4">
        {/* Success Alert */}
        {showSuccess && <TransactionAlert amount={formData.amount} />}
  
        {/* Authentication Modal */}
        {showAuth && (
          <PaymentAuth 
            ref={paymentAuthRef}
            amount={formData.amount}
            onSuccess={handleAuthSuccess}
            onCancel={() => {
              speak("Payment cancelled")
              setShowAuth(false)
            }}
          />
        )}
        
        <div className="max-w-xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              speak("Going back to previous page")
              router.back()
            }}
            className="mb-4 text-blue-600 flex items-center hover:text-blue-700 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
  
          {/* Main Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-blue-600 mb-6">Bank Transfer</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bank Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Bank
                </label>
                <select 
                  name="bank"
                  value={formData.bank}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select bank</option>
                  {Object.values(availableBanks).map((bank) => (
                    <option key={bank}>{bank}</option>
                  ))}
                </select>
              </div>
  
              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter account number"
                  required
                  pattern="\d+"
                  title="Please enter numbers only"
                />
              </div>
  
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
  
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter description"
                />
              </div>
  
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Proceed to Pay
              </button>
            </form>
          </div>
  
          {/* Voice Command Status */}
          <div className="mt-4">
            {/* Voice Command Transcript */}
            {transcript && (
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <p className="text-sm font-medium">Last command:</p>
                <p className="text-sm text-gray-600">{transcript}</p>
              </div>
            )}
  
            {/* Voice Command Examples */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">Voice Command Examples:</p>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>"Transfer 100 dollars to Chase account 12345"</li>
                <li>"Send 50 dollars to Bank of America account 67890"</li>
                <li>"Check status"</li>
                <li>"Help"</li>
              </ul>
            </div>
          </div>
  
          {/* Microphone Control */}
          <div className="fixed bottom-4 right-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center justify-center ${
                isRecording ? 'bg-red-400 hover:bg-red-500' : 'bg-blue-400 hover:bg-blue-500'
              } rounded-full w-16 h-16 focus:outline-none shadow-lg transition-colors`}
              aria-label={isRecording ? "Stop voice commands" : "Start voice commands"}
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