'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import TransactionAlert from '../components/TransactionAlert'
import PaymentAuth from '../components/PaymentAuth'

export default function PayContactsPage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [amount, setAmount] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef(null)
  const initialAnnouncementMade = useRef(false)
  
  const contacts = [
    { name: 'John Doe', phone: '+1 234 567 890' },
    { name: 'Jane Smith', phone: '+1 234 567 891' },
    { name: 'Alice Johnson', phone: '+1 234 567 892' },
    { name: 'bob', phone: '+1 578 889 125' },
    { name: 'charlie', phone: '+1 589 669 235' },
    { name: 'karan', phone: '+1 897 558 204' },
  ]

  // Text-to-speech function
  const speak = (text) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  // Initial announcement
  useEffect(() => {
    if (!initialAnnouncementMade.current) {
      const welcomeMessage = `Welcome to contact payments. You can say 'search' followed by a name to find contacts, 
        'select' followed by a name to choose a contact, 'amount' followed by a number to set payment amount, 
        or 'confirm' to proceed with payment. Say 'help' anytime to hear these commands again.`
      
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
      speak("Available commands are: search followed by name, select followed by name, amount followed by number, confirm payment, or go back")
      return
    }

    // Back command
    if (lowerCommand.includes('go back')) {
      speak("Going back to home")
      router.back()
      return
    }

    // Search command
    if (lowerCommand.startsWith('search')) {
      const searchTerm = lowerCommand.replace('search', '').trim()
      setSearchQuery(searchTerm)
      speak(`Searching for ${searchTerm}`)
      return
    }

    // Select contact command
    if (lowerCommand.startsWith('select')) {
      const contactName = lowerCommand.replace('select', '').trim()
      const contact = contacts.find(c => 
        c.name.toLowerCase().includes(contactName)
      )
      if (contact) {
        setSelectedContact(contact)
        speak(`Selected ${contact.name}`)
      } else {
        speak("Contact not found. Please try again.")
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
    if (lowerCommand.includes('confirm') && selectedContact && amount) {
      speak("Opening payment authentication")
      setShowAuth(true)
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

  const handleContactSelect = (contact) => {
    setSelectedContact(contact)
    speak(`Selected ${contact.name}`)
  }

  const handlePayment = (e) => {
    e.preventDefault()
    if (amount && selectedContact) {
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

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  )

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
          <h1 className="text-2xl font-bold text-blue-600 mb-6">Pay Contacts</h1>
          
          {/* Voice Command Transcript */}
          {transcript && (
            <div className="w-full rounded-md border p-4 bg-white mb-4">
              <p className="text-sm font-medium">Last command:</p>
              <p className="text-sm text-gray-600">{transcript}</p>
            </div>
          )}

          <div className="mb-4">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search contacts or say 'search' followed by name..."
            />
          </div>

          {!selectedContact ? (
            <div className="space-y-2">
              {filteredContacts.map((contact, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => handleContactSelect(contact)}
                >
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-gray-600">{contact.phone}</div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="font-medium">{selectedContact.name}</div>
                <div className="text-sm text-gray-600">{selectedContact.phone}</div>
                <button 
                  onClick={() => {
                    setSelectedContact(null)
                    speak("Contact selection cleared")
                  }}
                  className="text-sm text-blue-600 mt-2 hover:text-blue-800"
                >
                  Change Contact
                </button>
              </div>
              
              <form onSubmit={handlePayment} className="space-y-4">
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
          )}
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