'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VoiceRecognition from './VoiceRecognition';

export default function AssistantContent() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { text: "Hello, I'm FinSee! 👋 I'm your personal finance assistant. How can I help you?", isBot: true }
  ]);
  const [isListening, setIsListening] = useState(false);

  const handleCommand = (command) => {
    setMessages(prev => [...prev, { text: command, isBot: false }]);

    if (command.includes('show balance')) {
      setMessages(prev => [...prev, { text: 'Current Balance is: ₹500.00', isBot: true }]);
    } else if (command.includes('go home')) {
      router.push('/home');
    }
  };

  return (
    <>
      <VoiceRecognition onCommand={handleCommand} />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white p-4 flex items-center">
          <button onClick={() => router.back()} className="mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full mr-2"></div>
            <div>
              <div className="font-semibold">FinSee</div>
              <div className="text-xs text-green-500">Always active</div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.isBot ? 'mr-16' : 'ml-16'}`}>
              <div className={`p-3 rounded-lg ${message.isBot ? 'bg-white' : 'bg-blue-500 text-white'}`}>
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white">
          <div className={`w-12 h-12 mx-auto rounded-full ${isListening ? 'bg-red-400' : 'bg-blue-400'}`}></div>
        </div>
      </div>
    </>
  );
}