'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BankLogo from '../app/Image.png'; // Adjust the path according to your file structure

export default function WelcomePage() {
  const router = useRouter();
  const [listening, setListening] = useState(false);

  useEffect(() => {
    // Initial welcome message
    const welcomeSpeech = new SpeechSynthesisUtterance("Welcome to Finsee. Tap anywhere to start");
    window.speechSynthesis.speak(welcomeSpeech);

    // Speech Recognition Setup
    let recognition = null;
    
    if ('webkitSpeechRecognition' in window) {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onend = () => {
        setListening(false);
        // Restart recognition
        recognition.start();
      };

      recognition.start();
    }

    // Cleanup
    return () => {
      if (recognition) {
        recognition.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleTap = () => {
    router.push('/home');
  };

  return (
    <div 
      className="min-h-screen bg-white flex flex-col items-center justify-center p-4 cursor-pointer"
      onClick={handleTap}
    >
      <div className="text-center flex flex-col items-center space-y-6">
        <div className="bg-blue-500 rounded-full p-4 w-24 h-24 flex items-center justify-center">
          <Image
            src={BankLogo}
            alt="Finsee Logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
        
        <h1 className="text-2xl font-semibold text-purple-600">Finsee</h1>
        
        <div className="flex items-center space-x-2 text-gray-600">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 4a4 4 0 00-4 4v3h8V8a4 4 0 00-4-4zm3 7V8a3 3 0 10-6 0v3H5V8a5 5 0 1110 0v3h-2z" 
              clipRule="evenodd" 
            />
          </svg>
          <p className="text-sm">Use Headphones for Privacy.</p>
        </div>
        
        {/* Visual indicator for listening state */}
        <div className={`text-sm ${listening ? 'text-green-500' : 'text-gray-500'}`}>
          {listening ? 'Listening...' : 'Microphone inactive'}
        </div>

        <p className="text-gray-500 text-sm animate-pulse">
          Tap anywhere to start
        </p>
      </div>
    </div>
  );
}