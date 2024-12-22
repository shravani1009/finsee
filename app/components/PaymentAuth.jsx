// components/PaymentAuth.jsx
'use client'

import { useState, useEffect } from 'react'

export default function PaymentAuth({ amount, onSuccess, onCancel, voiceEnabled = true }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const speak = (text) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    if (voiceEnabled) {
      speak(`Please authenticate transfer of ${amount} dollars. Say your PIN number digit by digit, or say cancel to abort.`)
    }
  }, [amount, voiceEnabled])

  const handlePinInput = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit
      setPin(newPin)
      speak(`Digit ${digit} entered`)

      if (newPin.length === 4) {
        verifyPin(newPin)
      }
    }
  }

  const verifyPin = (pinToVerify) => {
    // Mock PIN verification - replace with actual verification logic
    if (pinToVerify === '1234') {
      speak('Authentication successful')
      onSuccess()
    } else {
      setError('Incorrect PIN')
      setPin('')
      speak('Incorrect PIN. Please try again')
    }
  }

  const clearPin = () => {
    setPin('')
    speak('PIN cleared')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Authenticate Payment</h2>
        <p className="mb-4">Amount: ${amount}</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter PIN
          </label>
          <input
            type="password"
            value={pin}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="****"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Clear', 0, 'Cancel'].map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item === 'Clear') clearPin()
                else if (item === 'Cancel') onCancel()
                else handlePinInput(item.toString())
              }}
              className={`p-3 rounded-md ${
                typeof item === 'number'
                  ? 'bg-blue-100 hover:bg-blue-200'
                  : item === 'Clear'
                  ? 'bg-yellow-100 hover:bg-yellow-200'
                  : 'bg-red-100 hover:bg-red-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}