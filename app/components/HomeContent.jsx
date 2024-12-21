
// app/components/HomeContent.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VoiceWakeWord from './VoiceWakeWord';

export default function HomeContent() {
  const router = useRouter();
  const [balance, setBalance] = useState('₹500.00');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleWakeWord = () => {
    console.log('Wake word detected! Navigating to assistant...');
    router.push('/assistant');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <VoiceWakeWord onWakeWord={handleWakeWord} />
      <div className="min-h-screen bg-blue-50 p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">Banking Services</h1>
          <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mb-2"></div>
            <span>Scan QR</span>
          </button>
          <button className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mb-2"></div>
            <span>Pay Phone</span>
          </button>
          <button className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mb-2"></div>
            <span>Pay Contacts</span>
          </button>
          <button className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mb-2"></div>
            <span>Bank Transfer</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Balance Chart</h2>
          <div className="h-40 bg-gray-50 rounded mb-2"></div>
          <div className="text-right text-blue-600 font-bold">{balance}</div>
        </div>

        <button
          onClick={() => router.push('/assistant')}
          className="fixed bottom-6 left-6 right-6 bg-blue-500 text-white p-4 rounded-lg flex items-center justify-center"
        >
          <span className="mr-2">FinSee Assistant</span>
          <div className="w-4 h-4 bg-green-400 rounded-full"></div>
        </button>
      </div>
    </>
  );
}