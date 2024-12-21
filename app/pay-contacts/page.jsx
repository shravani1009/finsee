'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TransactionAlert from '../components/TransactionAlert'

export default function PayContactsPage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [amount, setAmount] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  const contacts = [
    { name: 'John Doe', phone: '+1 234 567 890' },
    { name: 'Jane Smith', phone: '+1 234 567 891' },
    { name: 'Alice Johnson', phone: '+1 234 567 892' },
    { name: 'bob', phone: '+1 578 889 125' },
    { name: 'charlie', phone: '+1 589 669 235' },
    { name: 'karan', phone: '+1 897 558 204' },
    

  ]

  const handleContactSelect = (contact) => {
    setSelectedContact(contact)
  }

  const handlePayment = (e) => {
    e.preventDefault()
    if (amount && selectedContact) {
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        router.push('/home')
      }, 3000)
    }
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-white p-4">
      {showSuccess && <TransactionAlert amount={amount} />}
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
          
          <div className="mb-4">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search contacts..."
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
                  onClick={() => setSelectedContact(null)}
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
          )}
        </div>
      </div>
    </div>
  )
}