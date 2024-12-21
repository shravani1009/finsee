'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TransactionAlert from '../components/TransactionAlert'

export default function BankTransferPage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    bank: '',
    accountNumber: '',
    amount: '',
    description: ''
  })

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
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        router.push('/home')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {showSuccess && <TransactionAlert amount={formData.amount} />}
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
          <h1 className="text-2xl font-bold text-blue-600 mb-6">Bank Transfer</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <option>Bank of America</option>
                <option>Chase</option>
                <option>Wells Fargo</option>
              </select>
            </div>

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
              />
            </div>

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
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter description (optional)"
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