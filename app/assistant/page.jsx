'use client'

import { useEffect, useRef, useState } from 'react'

export default function AssistantPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [messages, setMessages] = useState([]) // Add messages state
  const recognitionRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    // Initial welcome message
    if (messages.length === 0) {
      const welcomeMessage = "Welcome to the AI Assistant. How can I help you today?"
      setMessages([{ type: 'assistant', text: welcomeMessage }])
      speak(welcomeMessage)
    }
  }, [messages])

  // Text-to-speech function
  const speak = (text) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

const API_URL = 'https://bc9e-35-236-173-101.ngrok-free.app';

const handleQuery = async (query) => {
  try {
      setMessages(prev => [...prev, { type: 'user', text: query }]);

      const response = await fetch(API_URL + '/chat', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ query: query }) // Make sure query is properly nested
      });
      
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.response) {
          setMessages(prev => [...prev, { type: 'assistant', text: data.response }]);
          speak(data.response);
      } else if (data.error) {
          throw new Error(data.error);
      }
  } catch (error) {
      console.error('Error:', error);
      const errorMessage = `Sorry, I encountered an error: ${error.message}`;
      setMessages(prev => [...prev, { type: 'assistant', text: errorMessage }]);
      speak(errorMessage);
  }
};

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
      if (event.results[event.results.length - 1].isFinal) {
        handleQuery(transcript)
      }
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

          {/* Transcript */}
          {transcript && (
            <div className="w-full rounded-md border p-4 bg-white mb-4">
              <p className="text-sm font-medium">Last command:</p>
              <p className="text-sm text-gray-600">{transcript}</p>
            </div>
          )}

          {/* Microphone Control */}
          <div className="text-center p-4 border-t">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
              }`}
            >
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
            </button>
            <p className="mt-2 text-sm text-gray-600">
              {isRecording ? 'Listening...' : 'Click to start speaking'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}