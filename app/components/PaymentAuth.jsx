// app/components/PaymentAuth.jsx
'use client'

import { useState, useEffect } from 'react'

export default function PaymentAuth({ onSuccess, onCancel, amount }) {
  const [code, setCode] = useState(['', '', '', '', ''])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleInputChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)
      setError('') // Clear error when user types
      
      if (value && index < 4) {
        const nextInput = document.querySelector(`input[name="code-${index + 1}"]`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleSubmit = () => {
    const enteredCode = code.join('')
    if (enteredCode === '12345') {
      setMessage('Payment Successfully Transferred!')
      // Show success message for 1.5 seconds before closing
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } else {
      setError('Invalid code. Payment cannot be processed.')
      setCode(['', '', '', '', ''])
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-blue-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">Enter code:</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            {message}
          </div>
        )}

        <div className="flex justify-between mb-8 gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              name={`code-${index}`}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-12 h-12 border-2 rounded-lg text-center text-xl font-semibold bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
              maxLength={1}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Confirm
        </button>

        <div className="mt-6 flex justify-center">
          <button 
            className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
          >
            <svg 
              className="w-8 h-8 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}