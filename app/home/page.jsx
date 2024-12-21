'use client'

import { useSpeech } from '../../context/SpeechContext'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { isListening } = useSpeech();
  const router = useRouter();

  const bankingServices = [
    { icon: '🔍', text: 'Scan any QR code', route: '/scan-qr' },
    { icon: '📱', text: 'Pay phone number', route: '/pay-phone' },
    { icon: '👥', text: 'Pay contacts', route: '/pay-contacts' },
    { icon: '🏦', text: 'Bank transfer', route: '/bank-transfer' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Banking Services</h1>
        
        {/* Banking Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {bankingServices.map((service, index) => (
            <div
              key={index}
              className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer"
              onClick={() => router.push(service.route)}
            >
              <div className="text-2xl mb-2">{service.icon}</div>
              <div className="text-sm font-medium text-blue-800">{service.text}</div>
            </div>
          ))}
        </div>

        {/* Voice Status Indicator */}
        <div className="fixed bottom-4 right-4">
          <div className={`bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center space-x-2 ${
            isListening ? 'animate-pulse' : ''
          }`}>
            <svg 
              className="w-5 h-5" 
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
            <p className="text-sm">
              {isListening ? 'Listening for "Hey Bot"...' : 'Voice assistant inactive'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}