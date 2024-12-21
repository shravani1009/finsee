'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TransactionAlert from '../components/TransactionAlert'
import PaymentAuth from '../components/PaymentAuth'

export default function PayPhonePage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (phoneNumber && amount) {
      setShowAuth(true) // Show auth instead of immediate success
    }
  }

  const handleAuthSuccess = () => {
    setShowAuth(false)
    setShowSuccess(true)
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
          onCancel={() => setShowAuth(false)}
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
                placeholder="Enter phone number"
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
                placeholder="Enter amount"
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
      </div>
    </div>
  )
}