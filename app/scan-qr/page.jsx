'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TransactionAlert from '../components/TransactionAlert'
import PaymentAuth from '../components/PaymentAuth'

export default function ScanQRPage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [amount, setAmount] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  const handleScanClick = () => {
    setIsScanning(true)
    // Simulate QR code scanning
    setTimeout(() => {
      setAmount('1000') // Simulated amount from QR code
      setIsScanning(false)
      setShowAuth(true) // Show auth instead of immediate success
    }, 1500) // Simulate scanning delay
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
                  <p className="text-blue-600 mt-2">Click to scan QR code</p>
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
            {isScanning ? 'Scanning QR code...' : 'Hold the QR code steady in the frame'}
          </p>
        </div>
      </div>
    </div>
  )
}